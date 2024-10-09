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

import {
	type LanguageTextDirection,
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import type ITalkieLocaleHelper from "@talkie/shared-interfaces/italkie-locale-helper.mjs";

import languages, {
	type LanguageDataKey,
} from "./data/languages/languages.mjs";

export default class TalkieLocaleHelper implements ITalkieLocaleHelper {
	private static readonly languages = languages;

	getBidiDirectionSync(talkieLocale: TalkieLocale): LanguageTextDirection {
		// eslint-disable-next-line no-sync
		return this._getSync<LanguageTextDirection>(talkieLocale, "direction");
	}

	async getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection> {
		// eslint-disable-next-line no-sync
		return this.getBidiDirectionSync(talkieLocale);
	}

	getSampleTextSync(talkieLocale: TalkieLocale): string {
		// eslint-disable-next-line no-sync
		return this._getSync(talkieLocale, "sample");
	}

	async getSampleText(talkieLocale: TalkieLocale): Promise<string> {
		// eslint-disable-next-line no-sync
		return this.getSampleTextSync(talkieLocale);
	}

	getTranslatedLanguagesSync(): TalkieLocale[] {
		const allLanguages: TalkieLocale[] = this._getTalkieLocales();

		return allLanguages;
	}

	async getTranslatedLanguages(): Promise<TalkieLocale[]> {
		// eslint-disable-next-line no-sync
		return this.getTranslatedLanguagesSync();
	}

	isTalkieLocale(languageGroup: string): languageGroup is TalkieLocale {
		return this._getTalkieLocales().includes(languageGroup as TalkieLocale);
	}

	private _getSync<T extends string>(talkieLocale: TalkieLocale, name: LanguageDataKey): T {
		const value = TalkieLocaleHelper.languages.languages[talkieLocale][name]
			?? TalkieLocaleHelper.languages.base[name];

		// TODO: retrieve T from the data structure instead.
		return value as T;
	}

	private _getTalkieLocales(): TalkieLocale[] {
		return Object.keys(TalkieLocaleHelper.languages.languages) as TalkieLocale[];
	}
}
