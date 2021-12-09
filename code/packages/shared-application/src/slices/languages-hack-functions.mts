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
	getLanguageGroupFromLanguage,
	getVoiceForVoiceNameFromVoices,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper.mjs";
import LocaleProvider from "@talkie/split-environment/locale-provider.mjs";
import {
	LanguageDirection,
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices.mjs";
import {
	ReadonlyDeep,
} from "type-fest";

// TODO: move file contents to api.
const talkieLocaleHelper = new TalkieLocaleHelper();
const localeProvider = new LocaleProvider();

export const isTalkieLocaleSync = (languageCode: string): languageCode is TalkieLocale => talkieLocaleHelper.isTalkieLocale(languageCode);

// eslint-disable-next-line no-sync
export const getSampleTextSync = (talkieLocale: TalkieLocale): Readonly<string> => talkieLocaleHelper.getSampleTextSync(talkieLocale);

// eslint-disable-next-line no-sync
export const getBidiDirectionSync = (talkieLocale: TalkieLocale): Readonly<LanguageDirection> => talkieLocaleHelper.getBidiDirectionSync(talkieLocale);

export const getTranslationLocaleSync = (): TalkieLocale => localeProvider.getTranslationLocale();

export const getTextDirectionClassNameForLanguageGroupSync = (languageGroup: string): string => {
	const textDirectionLtr = "text-direction-ltr";
	const textDirectionRtl = "text-direction-rtl";
	const defaultTextDirection = textDirectionLtr;

	if (!isTalkieLocaleSync(languageGroup)) {
		return defaultTextDirection;
	}

	const direction = getBidiDirectionSync(languageGroup);
	let className = null;

	switch (direction) {
		case "rtl":
			className = textDirectionRtl;
			break;
		case "ltr":
			className = textDirectionLtr;
			break;
		default:
			throw new Error(`Unknown text direction: ${typeof direction} ${JSON.stringify(direction)}`);
	}

	return className;
};

export const getSampleTextForLanguageSync = (languageCode: string): string | null => {
	const languageGroup = getLanguageGroupFromLanguage(languageCode);

	if (!isTalkieLocaleSync(languageGroup)) {
		// TODO: front-end logging.
		// throw new Error(`No sample text found for the non-Talkie locale language code/group: ${JSON.stringify(languageCode)} ${JSON.stringify(languageGroup)}`);
		return null;
	}

	const text = getSampleTextSync(languageGroup);

	return text;
};

export const getSampleTextForVoiceNameSync = (voices: ReadonlyDeep<SafeVoiceObject[]>, voiceName: string): string | null => {
	const voice = getVoiceForVoiceNameFromVoices(voices, voiceName);
	const languageCode = voice.lang;

	return getSampleTextForLanguageSync(languageCode);
};

export const getNavigatorLanguage = (): Readonly<string | null> => {
	let lang = null;

	try {
		lang = window.navigator.language;
	} catch {
		// NOTE: swallowing errors.
	}

	return lang;
};

export const getNavigatorLanguages = (): Readonly<string[]> => {
	let langs: readonly string[] = [];

	try {
		langs = window.navigator.languages;
	} catch {
		// NOTE: swallowing errors.
	}

	return langs;
};
