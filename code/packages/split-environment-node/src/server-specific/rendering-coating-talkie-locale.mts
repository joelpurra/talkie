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

import type ITalkieLocaleHelper from "@talkie/shared-interfaces/italkie-locale-helper.mjs";
import type IApiCoatingTalkieLocale from "@talkie/split-environment-interfaces/iapi/iapi-coating-talkie-locale.mjs";

import {
	type LanguageTextDirection,
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";

export default class RenderingCoatingTalkieLocale implements IApiCoatingTalkieLocale {
	constructor(private readonly talkieLocaleHelper: ITalkieLocaleHelper) {}
	async getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection> {
		return this.talkieLocaleHelper.getBidiDirection(talkieLocale);
	}

	async getSampleText(talkieLocale: TalkieLocale): Promise<string> {
		return this.talkieLocaleHelper.getSampleText(talkieLocale);
	}

	async isTalkieLocale(languageGroup: string): Promise<boolean> {
		return this.talkieLocaleHelper.isTalkieLocale(languageGroup);
	}

	async getTranslatedLanguages(): Promise<TalkieLocale[]> {
		return this.talkieLocaleHelper.getTranslatedLanguages();
	}
}
