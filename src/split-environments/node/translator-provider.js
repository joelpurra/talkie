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

import {
	logError,
} from "../../shared/log";

const jsonfile = require("jsonfile");

export default class NodeEnvironmentTranslatorProvider {
	constructor(localeProvider) {
		this.localeProvider = localeProvider;

		this.translations = {};
	}

	_getMessagesFilepath(locale) {
		return `./_locales/${locale}/messages.json`;
	}

	_getMessages(locale) {
		if (!this.translations[locale]) {
			const path = this._getMessagesFilepath(locale);
			/* eslint-disable no-sync */
			const json = jsonfile.readFileSync(path);
			/* eslint-enable no-sync */

			this.translations[locale] = json;
		}

		return this.translations[locale];
	}

	_getTranslation(locale, key, extras) {
		// TODO: use same translation system in frontend and backend?
		// translated = [key].concat(extras).join("_").toUpperCase();
		const localeMessages = this._getMessages(locale);
		const messageTemplate = localeMessages[key];

		if (!messageTemplate) {
			logError("_getTranslation", "Missing translation", arguments, messageTemplate);

			throw new Error(`Missing translation: ${key}`);
		}

		let translated = messageTemplate.message;

		if (typeof messageTemplate.placeholders === "object") {
			const variableLookups = Object.keys(messageTemplate.placeholders)
				.reduce(
					(object, placeholderName) => {
						const placeholder = messageTemplate.placeholders[placeholderName];
						const id = placeholderName.toLowerCase();
						const extrasIndex = Number.parseInt(placeholder.content.replace("$", ""), 10) - 1;

						if (isNaN(extrasIndex) || extrasIndex < 0 || extrasIndex >= extras.length) {
							throw new RangeError(`Variable lookup extras index out of range: ${extrasIndex}`);
						}

						object[id] = extras[extrasIndex];

						return object;
					},
					{},
				);

			const replace = (/* eslint-disable no-unused-vars */match/* eslint-enable no-unused-vars */, variableName) => {
				let result = null;

				const variableNameAsNumber = Number.parseInt(variableName, 10);

				if (!isNaN(variableNameAsNumber)) {
					const extrasIndex = variableNameAsNumber - 1;

					if (isNaN(extrasIndex) || extrasIndex < 0 || extrasIndex >= extras.length) {
						throw new RangeError(`Replace extras index out of range: ${extrasIndex}`);
					}

					result = extras[extrasIndex];
				} else {
					const id = variableName.toLowerCase();

					result = variableLookups[id];
				}

				if (result === null || result === undefined) {
					throw new Error(`Unmatched named extra variable: ${variableName}`);
				}

				return result;
			};

			translated = translated.replace(/\$(\w+)\$/g, replace);
		}

		const extraTextRx = /\$/;

		if (extraTextRx.test(translated)) {
			// TODO: replace extras in string.
			logError("_getTranslation", "Unhandled translation extras", arguments, messageTemplate);

			throw new Error(`Unhandled translation extras: ${key} ${extras}`);
		}

		return translated;
	}

	translate(key, extras) {
		const locale = this.localeProvider.getTranslationLocale();

		// TODO: use same translation system in frontend and backend?
		// translated = [key].concat(extras).join("_").toUpperCase();
		const translated = this._getTranslation(locale, key, extras);

		return translated;
	}
}
