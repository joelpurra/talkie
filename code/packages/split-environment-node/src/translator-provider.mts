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
} from "@talkie/shared-application-helpers/log.mjs";
import {
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import jsonfile from "jsonfile";
import path from "node:path";
import type {
	JsonObject,
	ReadonlyDeep,
} from "type-fest";

// NOTE: some types are duplicated to avoid sharing with the main Talkie code.
// TODO: break out types? Create shared project?
export type LocaleMessage = {
	description?: string;
	message: string;
	placeholders?: Record<string, {
		content: string;
		example?: string;
	}>;
};

export type LocaleMessages = Record<string, LocaleMessage>;

export type Locale = {
	[locale in TalkieLocale]: LocaleMessages;
};

export default class NodeEnvironmentTranslatorProvider implements ITranslatorProvider {
	private readonly translations: Partial<Locale> = {};

	constructor(private readonly localeProvider: ILocaleProvider) {}

	async translate(key: string, extras?: Readonly<string[]>): Promise<string> {
		// eslint-disable-next-line no-sync
		return this.translateSync(key, extras);
	}

	translateSync(key: string, extras?: Readonly<string[]>): string {
		const locale = this.localeProvider.getTranslationLocale();

		// TODO: use same translation system in frontend and backend?
		// translated = [key].concat(extras).join("_").toUpperCase();
		// eslint-disable-next-line no-sync
		const translated = this._getTranslationSync(locale, key, extras);

		return translated;
	}

	private _getMessagesFilepath(locale: TalkieLocale) {
		// NOTE: relative to extension root.
		const messagesPath = path.join(
			"_locales",
			locale,
			"messages.json",
		);

		// NOTE: could use path relative to PWD (possibly equal to the extension root), but using full path from current file.
		return new URL(
			path.join(
				"..",
				"..",
				"..",
				"shared-locales",
				"src",
				"data",
				messagesPath,
			),
			import.meta.url,
		);
	}

	private _getMessagesSync(locale: TalkieLocale): ReadonlyDeep<LocaleMessages> {
		let messages = this.translations[locale];

		if (!messages) {
			const path = this._getMessagesFilepath(locale);
			// eslint-disable-next-line no-sync
			const json = jsonfile.readFileSync(path) as JsonObject;

			// TODO: verify object instead of casting.
			messages = json as unknown as LocaleMessages;

			this.translations[locale] = messages;
		}

		return messages;
	}

	private _getTranslationSync(locale: TalkieLocale, key: string, extras: Readonly<string[]> = []): string {
		// TODO: use same translation system in frontend and backend?
		// translated = [key].concat(extras).join("_").toUpperCase();
		// eslint-disable-next-line no-sync
		const localeMessages = this._getMessagesSync(locale);
		const messageTemplate = localeMessages[key];

		if (!messageTemplate) {
			void logError("_getTranslation", "Missing translation", arguments, messageTemplate);

			throw new Error(`Missing translation: ${key}`);
		}

		let translated = messageTemplate.message;
		const {
			placeholders,
		} = messageTemplate;

		if (typeof placeholders === "object") {
			const variableLookups = Object.fromEntries(
				Object.entries(placeholders)
					.map(
						// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
						([
							placeholderName,
							placeholder,
						]) => {
							const id = placeholderName.toLowerCase();
							const extrasIndex = Number.parseInt(placeholder.content.replace("$", ""), 10) - 1;

							if (Number.isNaN(extrasIndex) || extrasIndex < 0 || extrasIndex >= extras.length) {
								throw new RangeError(`Variable lookup extras index out of range (${extrasIndex}) for ${JSON.stringify(placeholderName)} in ${JSON.stringify(placeholder)} of ${JSON.stringify(messageTemplate)} with key ${JSON.stringify(key)}.`);
							}

							const extra = extras[extrasIndex];

							if (typeof extra !== "string") {
								throw new TypeError(`Non-string extra value: ${key} ${extrasIndex} ${typeof extra} ${JSON.stringify(extra)} ${JSON.stringify(extras)}`);
							}

							return [
								id,
								extra,
							];
						},
					),
			);

			const replacer: (substring: string, ...args: Readonly<string[]>) => string = (_match, variableName) => {
				let result = null;

				const variableNameAsNumber = Number.parseInt(variableName, 10);

				if (Number.isNaN(variableNameAsNumber)) {
					const id = variableName.toLowerCase();

					result = variableLookups[id];
				} else {
					const extrasIndex = variableNameAsNumber - 1;

					if (Number.isNaN(extrasIndex) || extrasIndex < 0 || extrasIndex >= extras.length) {
						throw new RangeError(`Replace extras index out of range: ${extrasIndex}`);
					}

					result = extras[extrasIndex];
				}

				if (result === null || result === undefined) {
					throw new Error(`Unmatched named extra variable: ${variableName}`);
				}

				return result;
			};

			const extraVariable = /\$(\w+)\$/g;

			translated = translated.replace(extraVariable, replacer);
		}

		if (translated.includes("$")) {
			// TODO: replace extras in string.
			void logError("_getTranslation", "Unhandled translation extras", arguments, messageTemplate);

			throw new Error(`Unhandled translation extras: ${key} ${JSON.stringify(extras)}`);
		}

		return translated;
	}
}
