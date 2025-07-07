/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type GoogleCloudTranslateTranslator from "./google-cloud-translate-translator-service.mjs";

import assert from "node:assert";

import {
	type BaseLocaleMessages,
	type BaseMessages,
	type LocaleMessage,
	type LocaleMessages,
	type Messages,
} from "./messages-translator-types.mjs";

export default class MessagesTranslator {
	constructor(private readonly _translatorService: GoogleCloudTranslateTranslator, private readonly _base: BaseMessages, private readonly _locale: Messages) {
		// NOTE: ensure the base language isn't translated onto itself.
		assert.ok(typeof this._locale.language !== this._base.language);
	}

	async _keepOnlyKeys(keys: ReadonlyDeep<string[]>, object: ReadonlyDeep<Record<string, LocaleMessage>>): Promise<LocaleMessages> {
		assert.ok(Array.isArray(keys));

		for (const key of keys) {
			assert.ok(typeof key === "string" || (typeof key === "number" && Math.floor(key) === Math.ceil(key)));
		}

		assert.ok(typeof object === "object");

		// TODO: use something like pick() from a library.
		// eslint-disable-next-line unicorn/no-array-reduce
		return keys.reduce<LocaleMessages>(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(newObject, key) => {
				newObject[key] = object[key] as LocaleMessage;

				return newObject;
			},
			{},
		);
	}

	async translate(): Promise<LocaleMessages> {
		const baseKeys = Object.keys(this._base.messages);
		const localeMessages = await this._keepOnlyKeys(baseKeys, this._locale.messages);

		// eslint-disable-next-line unicorn/no-array-reduce
		const alreadyTranslatedLocale = baseKeys.reduce<LocaleMessages>(
			// TODO: use some function like filterKeys.
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(alreadyTranslated, baseKey) => {
				const localeMessage = localeMessages[baseKey];

				if (localeMessage) {
					const baseMessage = this._base.messages[baseKey];

					if (!baseMessage) {
						throw new Error(`Unexpectedly missing base message for key ${typeof baseKey} ${JSON.stringify(baseKey)}`);
					}

					if (localeMessage.original === baseMessage.message) {
						alreadyTranslated[baseKey] = localeMessage;
					}
				}

				return alreadyTranslated;
			},
			{},
		);

		// TODO: use some function like filterKeys.
		// eslint-disable-next-line unicorn/no-array-reduce
		const untranslatedLocale = baseKeys.reduce<BaseLocaleMessages>(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(untranslated, baseKey) => {
				const baseMessage = this._base.messages[baseKey];

				if (!baseMessage) {
					throw new Error(`Unexpectedly missing base message for key ${typeof baseKey} ${JSON.stringify(baseKey)}`);
				}

				const localeMessage = localeMessages[baseKey];

				if (!localeMessage || localeMessage.original !== baseMessage.message) {
					untranslated[baseKey] = baseMessage;
				}

				return untranslated;
			},
			{},
		);

		if (Object.keys(untranslatedLocale).length === 0) {
			const translated = alreadyTranslatedLocale;

			return translated;
		}

		const automaticallyTranslated = await this._translatorService.translate(this._base.language, this._locale.language, untranslatedLocale);

		assert.ok(typeof automaticallyTranslated === "object");

		for (const automaticallyTranslatedValue of Object.values(automaticallyTranslated)) {
			assert.ok(typeof automaticallyTranslatedValue.original === "string");
			assert.ok(typeof automaticallyTranslatedValue.message === "string");
		}

		const translated = {
			...alreadyTranslatedLocale,
			...automaticallyTranslated,
		};

		return translated;
	}
}
