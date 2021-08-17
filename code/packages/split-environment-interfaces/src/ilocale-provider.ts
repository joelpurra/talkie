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
	I18n,
} from "webextension-polyfill";

export type LanguageDirection = "ltr" | "rtl";

// NOTE: should match directory names in _locales/
export type TalkieLocale =
| "ar"
| "bg"
| "cs"
| "da"
| "de"
| "el"
| "en"
| "es"
| "fi"
| "fr"
| "he"
| "hi"
| "hu"
| "id"
| "it"
| "ja"
| "ko"
| "nb"
| "nl"
| "pl"
| "pt"
| "ro"
| "ru"
| "sk"
| "sv"
| "th"
| "tr"
| "zh";

// TODO: create a list for UI locale, possibly based on Chromium or Firefox sources.
// https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc
// https://github.com/CLD2Owners/cld2/blob/b56fa78a2fe44ac2851bae5bf4f4693a0644da7b/internal/generated_language.cc

export type ILocaleProviderConstructor = new() => ILocaleProvider;

export default interface ILocaleProvider {
	getUILocale(): I18n.LanguageCode;
	setUILocale(uiLocale: I18n.LanguageCode): void;
	getTranslationLocale(): TalkieLocale;
	setTranslationLocale(translationLocale: TalkieLocale): void;
}
