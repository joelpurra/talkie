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

import type GoogleCloudTranslateTranslator from "./google-cloud-translate-translator-service.mjs";
import type MessagesTranslator from "./messages-translator.mjs";

import assert from "node:assert";

import Bluebird from "bluebird";

import {
	type BaseMessages,
	type Messages,
} from "./messages-translator-types.mjs";

export default class MessagesTranslatorFactory {
	constructor(private readonly _translatorService: GoogleCloudTranslateTranslator, private readonly _MessagesTranslator: typeof MessagesTranslator) {}

	async create(base: ReadonlyDeep<BaseMessages>, locale: ReadonlyDeep<Messages>): Promise<MessagesTranslator> {
		// NOTE: ensure the base language isn't translated onto itself.
		assert.ok(typeof locale.language !== base.language);

		return Bluebird.try(() => {
			const messagesTranslator = new this._MessagesTranslator(this._translatorService, base, locale);

			return messagesTranslator;
		});
	}
}
