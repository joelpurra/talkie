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
	LanguageDirection,
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import ITalkieLocaleHelper from "@talkie/split-environment-interfaces/moved-here/italkie-locale-helper";

// NOTE: generated json data file might yield compilation error ts(2307) if missing.
import languagesJsonFile from "./data/languages/languages.json";

export type LanguageData = {
	"direction": LanguageDirection;
	"sample": string;
};

export type LanguageDataKey = keyof LanguageData;

export type LanguagesData = {
	"base": LanguageData;
	"languages": Record<TalkieLocale, LanguageData>;
};

export default class TalkieLocaleHelper implements ITalkieLocaleHelper {
	private static readonly languages = languagesJsonFile as LanguagesData;

	getBidiDirectionSync(talkieLocale: TalkieLocale): LanguageDirection {
		// eslint-disable-next-line no-sync
		return this._getSync<LanguageDirection>(talkieLocale, "direction");
	}

	async getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageDirection> {
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

	isTalkieLocale(languageCode: string): languageCode is TalkieLocale {
		return this._getTalkieLocales().includes(languageCode as TalkieLocale);
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
