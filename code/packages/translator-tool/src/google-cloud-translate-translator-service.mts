/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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
import type {
	ReadonlyDeep,
} from "type-fest";

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
				// NOTE: the promise property is documented in the v2.Translate typing source code, but not added to the types.
				// file://./../../../node_modules/@google-cloud/translate/build/src/v2/index.d.ts
				promise: Bluebird,
			} as unknown,
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
		assert(typeof fromLanguage === "string");
		assert(typeof toLanguage === "string");
		assert(typeof original === "object");

		for (const value of Object.values(original)) {
			assert(typeof value.message === "string");
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
				chunked[chunkedIndex] = (chunked[chunkedIndex] ?? new Array<string>()).concat(preparedMessage);

				return chunked;
			},
			[],
		);

		const translationOptions = {
			format: "html",
			from: fromLanguage,
			to: toLanguage,
		};

		// NOTE: translating one chunk at a time.
		const translationResponseChunks = await Bluebird.mapSeries(
			preparedMessagesChunks,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			async (preparedMessagesChunk) => this._googleTranslate.translate(preparedMessagesChunk, translationOptions),
		);

		// NOTE: returning the chunks to the same array format as before, except the apiResponse is an array of apiResponses (one per chunk).
		// TODO: use a prettier array flattening function?
		// eslint-disable-next-line unicorn/no-array-reduce
		const translationResponses = translationResponseChunks.reduce(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(t, v) => [
				t[0].concat(v[0]),
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				t[1].concat(v[1]),
			],
			[
				[],
				[],
			],
		);

		const translations = translationResponses[0];

		// NOTE: this is now an array of apiResponses (one per chunk), not a single as in the original translate api.
		// const apiResponse = translationResponses[1];

		const translateDirtyMessages = translations
			.map((translationResponse) => striptags(translationResponse))
			.map((translationResponse) => htmlEntityDecode(translationResponse))
			.map((translationResponse) => {
				const translateDirtyMessage = translationResponse
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
