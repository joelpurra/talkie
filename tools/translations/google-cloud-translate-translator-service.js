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

const assert = require("assert");
const Promise = require("bluebird");

const clone = require("clone");

const {
	Translate,
} = require("@google-cloud/translate").v2;

const striptags = require("striptags");
const htmlEntityEncode = require("ent/encode");
const htmlEntityDecode = require("ent/decode");

export default class GoogleCloudTranslateTranslator {
	constructor(googleCloudTranslateApiKeyFilePath) {
		assert(typeof googleCloudTranslateApiKeyFilePath === "string");

		this._googleCloudTranslateApiKeyFilePath = googleCloudTranslateApiKeyFilePath;

		this._googleTranslateOptions = {
			promise: Promise,
			keyFilename: this._googleCloudTranslateApiKeyFilePath,
		};
		this._googleTranslate = new Translate(this._googleTranslateOptions);

		// NOTE: there is a limit to how many items can be translated per call.
		this.maxChunkSize = 128;
	}

	translate(fromLanguage, toLanguage, original) {
		assert(typeof fromLanguage === "string");
		assert(typeof toLanguage === "string");
		assert(typeof original === "object");
		Object.keys(original).forEach((originalKey) => {
			assert(typeof original[originalKey].message === "string");
		});

		return Promise.try(() => {
			const messages = clone(original);
			const keys = Object.keys(messages);

			return Promise.try(() => {
				const preparedMessages = keys
					.map((key) => messages[key].message)
					.map((message) => htmlEntityEncode(message))
					.map((encodedMessage) => {
						const preparedMessage = encodedMessage
							.replace(/Talkie Premium/g, "<span class=\"notranslate\">___TEMP_TALKIE_PREMIUM___</span>")
							.replace(/Talkie/g, "<span class=\"notranslate\">___TEMP_TALKIE___</span>")
							.replace(/Premium/g, "<span class=\"notranslate\">___TEMP_PREMIUM___</span>")
							.replace(/\$(\w+)\$/g, "<span class=\"notranslate\">$$$1$$</span>");

						const htmlMessage = `<div lang="en">${preparedMessage}</div>`;

						return htmlMessage;
					});

				return preparedMessages;
			})
				.then((preparedMessages) => {
					// NOTE: put each item in a chunk with a size up to maxChunkSize.
					const preparedMessagesChunks = preparedMessages.reduce(
						(chunked, preparedMessage, preparedMessagesIndex) => {
							const chunkedIndex = Math.floor(preparedMessagesIndex / this.maxChunkSize);
							chunked[chunkedIndex] = (chunked[chunkedIndex] || []).concat(preparedMessage);

							return chunked;
						},
						[],
					);

					return preparedMessagesChunks;
				})
				.then((preparedMessagesChunks) => {
					const translationOptions = {
						from: fromLanguage,
						to: toLanguage,
						format: "html",
					};

					// NOTE: translating one chunk at a time.
					return Promise.mapSeries(
						preparedMessagesChunks,
						(preparedMessagesChunk) => this._googleTranslate.translate(preparedMessagesChunk, translationOptions),
					);
				})
			// NOTE: returning the chunks to the same array format as before, except the apiResponse is an array of apiResponses (one per chunk).
			// TODO: use a prettier array flattening function?
				.then((translationResponseChunks) => translationResponseChunks.reduce(
					(t, v) => [
						t[0].concat(v[0]),
						t[1].concat(v[1]),
					],
					[
						[],
						[],
					],
				))
				.then((translationResponses) => {
					const translations = translationResponses[0];
					/* eslint-disable no-unused-vars */
					// NOTE: this is now an array of apiResponses (one per chunk), not a single as in the original translate api.
					const apiResponse = translationResponses[1];
					/* eslint-enable no-unused-vars */

					const translateDirtyMessages = translations
						.map((translationResponse) => striptags(translationResponse))
						.map((translationResponse) => htmlEntityDecode(translationResponse))
						.map((translationResponse) => {
							const translateDirtyMessage = translationResponse
								.replace(/___TEMP_TALKIE_PREMIUM___/g, "Talkie Premium")
								.replace(/___TEMP_TALKIE___/g, "Talkie")
								.replace(/___TEMP_PREMIUM___/g, "Premium")
								.replace(/^\s+/g, "")
								.replace(/\s+$/g, "")
								.replace(/ +\/ +/g, "/")
								.replace(/ +-+ +/g, " — ")
								.replace(/ +([.:;!?]) +/g, "$1 ")
								.replace(/ {2,}/g, " ")
								.trim();

							return translateDirtyMessage;
						});

					return translateDirtyMessages;
				})
				.then((translateDirtyMessages) => {
					keys.forEach((key, index) => {
						messages[key].original = messages[key].message;
						messages[key].message = translateDirtyMessages[index];
					});

					return messages;
				});
		});
	}
}
