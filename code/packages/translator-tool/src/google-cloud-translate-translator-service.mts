/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import type {
	ReadonlyDeep,
} from "type-fest";

import assert from "node:assert";

import {
	v2,
} from "@google-cloud/translate";
import Bluebird from "bluebird";
import clone from "clone";
import {
	decode as htmlEntityDecode,
	encode as htmlEntityEncode,
} from "ent";
import striptags from "striptags";

import {
	type BaseLocaleMessages,
	type LocaleMessage,
	type LocaleMessages,
} from "./messages-translator-types.mjs";

const {
	Translate,
} = v2;

export default class GoogleCloudTranslateTranslator {
	private readonly _googleTranslateOptions: v2.TranslateConfig;
	private readonly _googleTranslate: v2.Translate;
	private readonly maxChunkSize: number;

	constructor(private readonly _googleCloudTranslateApiKeyFilePath: string) {
		this._googleTranslateOptions = Object.assign(
			{
				keyFilename: this._googleCloudTranslateApiKeyFilePath,
			} as v2.TranslateConfig,
			{
				promise: Bluebird,
			},
		);
		this._googleTranslate = new Translate(this._googleTranslateOptions);

		// NOTE: there is a limit to how many items can be translated per call.
		this.maxChunkSize = 128;
	}

	private get __TEMP_TALKIE_PREMIUM__() {
		// NOTE: must not contain characters which could be mistaken for regexp code.
		return "__TTP__";
	}

	private get __TEMP_TALKIE__() {
		// NOTE: must not contain characters which could be mistaken for regexp code.
		return "__TT__";
	}

	private get __TEMP_PREMIUM__() {
		// NOTE: must not contain characters which could be mistaken for regexp code.
		return "__TP__";
	}

	async translate(fromLanguage: string, toLanguage: string, original: ReadonlyDeep<BaseLocaleMessages>): Promise<ReadonlyDeep<LocaleMessages>> {
		assert.strictEqual(typeof fromLanguage, "string");
		assert.strictEqual(typeof toLanguage, "string");
		assert.strictEqual(typeof original, "object");

		for (const value of Object.values(original)) {
			assert.strictEqual(typeof value.message, "string");
		}

		const messages = clone(original);
		const preparedMessages = Object.values(messages)
			.map((value) => value.message)
			.map((message) => htmlEntityEncode(message))
			.map((encodedMessage) => {
				const preparedMessage = encodedMessage
					.replaceAll("Talkie Premium", `<span class="notranslate">${this.__TEMP_TALKIE_PREMIUM__}</span>`)
					.replaceAll("Talkie", `<span class="notranslate">${this.__TEMP_TALKIE__}</span>`)
					.replaceAll("Premium", `<span class="notranslate">${this.__TEMP_PREMIUM__}</span>`)
					.replaceAll(/\$(\w+)\$/g, "<span class=\"notranslate\">$$$1$$</span>");

				const htmlMessage = `<div lang="en">${preparedMessage}</div>`;

				return htmlMessage;
			});

		// NOTE: put each item in a chunk with a size up to maxChunkSize.
		// eslint-disable-next-line unicorn/no-array-reduce
		const preparedMessagesChunks = preparedMessages.reduce<string[][]>(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(chunked, preparedMessage, preparedMessagesIndex) => {
				const chunkedIndex = Math.floor(preparedMessagesIndex / this.maxChunkSize);
				chunked[chunkedIndex] = [
					...(chunked[chunkedIndex] ?? []),
					preparedMessage,
				];

				return chunked;
			},
			[],
		);

		assert.ok(preparedMessagesChunks.length <= preparedMessages.length);
		assert.strictEqual((preparedMessagesChunks.length * this.maxChunkSize), Math.ceil(preparedMessages.length / this.maxChunkSize) * this.maxChunkSize);

		const translationOptions = {
			format: "html",
			from: fromLanguage,
			to: toLanguage,
		};

		// TODO: instead of casting to a type, upgrade google translate typings.
		type GoogleTranslateResponseChunks = Array<[string[], {data: {translations: [{translatedText: string}]}}]>;

		// NOTE: translating one chunk at a time due to (potentially hitting) api limitations.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const translationResponseChunks: GoogleTranslateResponseChunks = await Bluebird.mapSeries(
			preparedMessagesChunks,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			async (preparedMessagesChunk) => this._googleTranslate.translate(preparedMessagesChunk, translationOptions),
		);

		type GoogleTranslateResponses = [string[], string[]];

		assert.ok(Array.isArray(translationResponseChunks));
		assert.strictEqual(preparedMessagesChunks.length, translationResponseChunks.length);

		// NOTE: unchunk (reduce) array of translation array chunks, pick prepared text and translation from response, return array of two parallel translation pair arrays.
		// eslint-disable-next-line unicorn/no-array-reduce
		const translationResponses: GoogleTranslateResponses = translationResponseChunks.reduce<GoogleTranslateResponses>(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(reduced, translationResponseChunk) => {
				assert.ok(Array.isArray(reduced));
				assert.ok(Array.isArray(reduced[0]));
				assert.ok(Array.isArray(reduced[1]));
				assert.strictEqual(reduced[0].length, reduced[1].length);

				assert.ok(Array.isArray(translationResponseChunk));

				const prepared = translationResponseChunk[0];
				assert.ok(Array.isArray(prepared));

				const translationResponse = translationResponseChunk[1];
				assert.ok(typeof translationResponse === "object" && translationResponse !== null && !Array.isArray(translationResponse));
				assert.ok(typeof translationResponse.data === "object" && translationResponse.data !== null && !Array.isArray(translationResponse.data));
				assert.ok(Array.isArray(translationResponse.data.translations));

				assert.ok(prepared.length === translationResponse.data.translations.length);

				// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
				const translatedText = translationResponse.data.translations.map((translation) => {
					assert.ok(typeof translation === "object" && translation !== null && !Array.isArray(translation));
					assert.ok(typeof translation.translatedText === "string");
					assert.ok(translation.translatedText.length > 0);

					return translation.translatedText;
				});

				return [
					[
						...reduced[0],
						...prepared,
					],
					[
						...reduced[1],
						...translatedText,
					],
				];
			},
			[
				[],
				[],
			],
		);

		assert.strictEqual(preparedMessages.length, translationResponses[0].length);
		assert.strictEqual(translationResponses[0].length, translationResponses[1].length);

		interface TranslationResponsePair {
			prepared: string;
			translated: string;
		}

		const translationResponsePairs: Array<Readonly<TranslationResponsePair>> = translationResponses[0].map((prepared, index) => {
			const translated = translationResponses[1][index];

			// TODO: update typescript's nodejs typings and/or fix assert typing so that strictEqual has the same type effect as ===?
			assert.strictEqual(typeof prepared, "string");
			assert.strictEqual(typeof translated, "string");
			assert.ok(typeof translated === "string");

			return {
				prepared,
				translated,
			};
		});

		// NOTE: this is now an array of apiResponses (one per chunk), not a single as in the original translate api.
		// const apiResponse = translationResponses[1];

		const translateDirtyMessages = translationResponsePairs
			.map((translationPair) => translationPair.translated)
			.map((translated) => striptags(translated))
			.map((translated) => htmlEntityDecode(translated))
			.map((translated) => {
				const translateDirtyMessage = translated
					.replaceAll(new RegExp(this.__TEMP_TALKIE_PREMIUM__, "g"), "Talkie Premium")
					.replaceAll(new RegExp(this.__TEMP_TALKIE__, "g"), "Talkie")
					.replaceAll(new RegExp(this.__TEMP_PREMIUM__, "g"), "Premium")
					.replaceAll(/^\s+/g, "")
					.replaceAll(/\s+$/g, "")
					.replaceAll(/ +\/ +/g, "/")
					.replaceAll(/ +-+ +/g, " — ")
					.replaceAll(/ +([.:;!?]) +/g, "$1 ")
					.replaceAll(/ {2,}/g, " ")
					.trim();

				return translateDirtyMessage;
			});

		const translatedMessages: LocaleMessages = Object.fromEntries(
			Object.entries(messages)
				.map<[string, LocaleMessage]>(
					(
					// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
						[
							key,
							value,
						],
						index,
					) => [
						key,
						{
						// TODO: verify types.
							description: value.description,
							message: translateDirtyMessages[index],
							original: value.message,
							placeholders: value.placeholders,
						} as unknown as LocaleMessage,
					],
				),
		);

		return translatedMessages;
	}
}
