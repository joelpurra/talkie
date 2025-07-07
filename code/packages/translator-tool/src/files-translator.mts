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

import type MessagesTranslatorFactory from "./messages-translator-factory.mjs";

import assert from "node:assert";

import Bluebird from "bluebird";
import clone from "clone";
import jsonfile from "jsonfile";

import {
	type BaseLocaleMessages,
	type BaseMessages,
	type LocaleMessages,
	type Messages,
} from "./messages-translator-types.mjs";

export interface FileTranslation {
	filePath: string;
	language: string;
}

export default class FilesTranslator {
	constructor(
		private readonly _messagesTranslatorFactory: MessagesTranslatorFactory,
		private readonly _base: ReadonlyDeep<FileTranslation>,
		private readonly _locales: ReadonlyDeep<FileTranslation[]>,
	) {
		// NOTE: ensure the base language isn't translated onto itself.
		assert.ok(this._locales.every((locale) => locale.language !== this._base.language));
	}

	async _translateLocale(baseWithMessages: ReadonlyDeep<BaseMessages>, locale: ReadonlyDeep<FileTranslation>): Promise<void> {
		const localeMessages = await jsonfile.readFile(locale.filePath) as LocaleMessages;
		const localeWithMessages: Messages = {
			language: locale.language,
			messages: clone(localeMessages),
		};
		const messagesTranslator = await this._messagesTranslatorFactory.create(baseWithMessages, localeWithMessages);
		const translated = await messagesTranslator.translate();

		await jsonfile.writeFile(
			locale.filePath,
			translated,
			{
				spaces: 2,
			},
		);
	}

	async translate(): Promise<void> {
		const baseMessages = await jsonfile.readFile(this._base.filePath) as BaseLocaleMessages;
		const baseWithMessages: BaseMessages = {
			language: this._base.language,
			messages: clone(baseMessages),
		};

		await Bluebird.map(
			this._locales,
			// eslint-disable-next-line unicorn/no-array-method-this-argument
			async (locale) => this._translateLocale(baseWithMessages, locale),
		);
	}
}
