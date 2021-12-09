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
	IVoiceLanguage,
	IVoiceNameAndLanguage,
} from "@talkie/split-environment-interfaces/moved-here/ivoices.mjs";

// TODO: create type alias for generic language strings?
// TODO: use parser which checks codes, regions, etcetera against BCP47.
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/lang
// https://en.wikipedia.org/wiki/IETF_language_tag
// export type LangaugeGroup = string;
// export type LangaugeCode = string;

export type LanguagesByLanguageGroup = Readonly<Record<string, string[]>>;
export type VoicesByLanguage<T extends IVoiceLanguage> = Readonly<Record<string, T[]>>;
export type VoicesByLanguageGroup<T extends IVoiceLanguage> = Readonly<Record<string, T[]>>;
export type VoicesByLanguagesByLanguageGroup<T extends IVoiceLanguage> = Readonly<Record<string, VoicesByLanguage<T>>>;

export interface LanguageGroupWithNavigatorLanguage {
	isNavigatorLanguage: boolean;
	languageGroup: string;
}

export const getVoicesForLanguage = <T extends IVoiceLanguage>(voices: Readonly<T[]>, languageCode: string): Readonly<T[]> => {
	const voicesForLanguage = voices.filter((voice) => voice.lang.startsWith(languageCode));

	return voicesForLanguage;
};

export const getVoicesForLanguageExact = <T extends IVoiceLanguage>(voices: Readonly<T[]>, languageCode: string): Readonly<T[]> => {
	const voicesForLanguage = voices.filter((voice) => voice.lang === languageCode);

	return voicesForLanguage;
};

export const isLanguageGroup = (language: Readonly<string>): Readonly<boolean> =>
	// TODO: use parser which checks codes, regions, etcetera against BCP47.
	// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/lang
	// https://en.wikipedia.org/wiki/IETF_language_tag
	!language.includes("-");

export const getLanguageGroupFromLanguage = (language: Readonly<string>): Readonly<string> => {
	// TODO: use parser which checks codes, regions, etcetera against BCP47.
	// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/lang
	// https://en.wikipedia.org/wiki/IETF_language_tag
	if (isLanguageGroup(language)) {
		return language;
	}

	const parts = language.split("-");
	const languageGroupCode = parts[0];

	if (!languageGroupCode) {
		throw new TypeError("languageGroupCode");
	}

	return languageGroupCode;
};

export const getLanguageFromBcp47 = (bcp47: Readonly<string>): Readonly<string> => {
	// TODO: use parser which checks codes, regions, etcetera against BCP47.
	// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/lang
	// https://en.wikipedia.org/wiki/IETF_language_tag
	if (isLanguageGroup(bcp47)) {
		return bcp47;
	}

	const parts = bcp47.split("-");
	const languageGroup = parts.slice(0, 2).join("-");

	if (!languageGroup) {
		throw new TypeError("languageGroup");
	}

	return languageGroup;
};

export const getLanguageGroupsFromLanguages = (languages: Readonly<string[]>): Readonly<string[]> => {
	const languageGroups = [
		...new Set(
			languages.map((language) => getLanguageGroupFromLanguage(language)),
		),
	];

	return languageGroups;
};

export const getLanguagesFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): Readonly<string[]> => {
	const languages = [
		...new Set(
			voices.map((voice) => voice.lang),
		),
	];

	return languages;
};

export const getLanguageGroupsFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): Readonly<string[]> => {
	const languageGroups = [
		...new Set(
			voices.map((voice) => getLanguageGroupFromLanguage(voice.lang)),
		),
	];

	return languageGroups;
};

export const getLanguagesFromVoicesByLanguage = <T extends IVoiceLanguage>(voicesByLanguage: Readonly<VoicesByLanguage<T>>): Readonly<string[]> => {
	const languages = Object.keys(voicesByLanguage);

	return languages;
};

export const getVoicesByLanguageFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): VoicesByLanguageGroup<T> => {
	// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
	const voicesByLanguage = voices.reduce<VoicesByLanguage<T>>(
		(object, voice) => ({
			...object,
			[voice.lang]: (object[voice.lang] ?? new Array<Readonly<T>>()).concat(voice),
		}),
		{},
	);

	return voicesByLanguage;
};

export const getVoicesByLanguageGroupFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): VoicesByLanguageGroup<T> => {
	// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
	const voicesByLanguageGroup = voices.reduce<VoicesByLanguageGroup<T>>(
		(object, voice) => {
			const group = getLanguageGroupFromLanguage(voice.lang);

			return ({
				...object,
				[group]: (object[group] ?? new Array<Readonly<T>>()).concat(voice),
			});
		},
		{},
	);

	return voicesByLanguageGroup;
};

export const getVoicesByLanguagesByLanguageGroupFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): VoicesByLanguagesByLanguageGroup<T> => {
	const voicesByLanguage = getVoicesByLanguageFromVoices(voices);

	// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
	const languagesByLanguageGroup = voices.reduce<VoicesByLanguagesByLanguageGroup<T>>(
		(object, voice) => {
			const group = getLanguageGroupFromLanguage(voice.lang);
			const voicesForLanguage = voicesByLanguage[voice.lang];

			if (!voicesForLanguage) {
				throw new Error(`No voices by language found: ${JSON.stringify(voice.lang)} ${JSON.stringify(voicesForLanguage)}`);
			}

			return {
				...object,
				[group]: {
					...object[group],
					[voice.lang]: voicesForLanguage,
				},
			};
		},
		{},
	);

	return languagesByLanguageGroup;
};

export const getLanguagesByLanguageGroupFromVoices = <T extends IVoiceLanguage>(voices: Readonly<T[]>): LanguagesByLanguageGroup => {
	const voicesByLanguagesByLanguageGroup = getVoicesByLanguagesByLanguageGroupFromVoices(voices);

	const languageGroups = Object.keys(voicesByLanguagesByLanguageGroup);

	// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
	const languagesByLanguageGroup = languageGroups.reduce<LanguagesByLanguageGroup>(
		(object, group) => {
			const voicesForLanguage = voicesByLanguagesByLanguageGroup[group];

			if (!voicesForLanguage) {
				throw new Error(`No voices by language group found: ${JSON.stringify(group)} ${JSON.stringify(voicesForLanguage)}`);
			}

			const languages = Object.keys(voicesForLanguage);

			return {
				...object,
				[group]: languages,
			};
		},
		{},
	);

	return languagesByLanguageGroup;
};

export const getVoiceForVoiceNameFromVoices = <T extends IVoiceNameAndLanguage>(voices: Readonly<T[]>, voiceName: string): Readonly<T> => {
	const matchingVoices = voices.filter((voice) => voice.name === voiceName);

	if (matchingVoices.length !== 1) {
		throw new Error(`Mismatching number of voices found: ${matchingVoices.length}`);
	}

	const firstVoice = matchingVoices[0];

	if (!firstVoice) {
		throw new Error(`First voice not found: ${typeof firstVoice} ${JSON.stringify(firstVoice)}`);
	}

	return firstVoice;
};

export const getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups = (navigatorLanguages: Readonly<string[]>, languages: Readonly<string[]>, languageGroups: Readonly<string[]>): string[] => new Array<string>()
	// NOTE: preferring language groups over languages/dialects.
	.concat(navigatorLanguages.filter((navigatorLanguage) => languageGroups.includes(navigatorLanguage)))
	.concat(navigatorLanguages.filter((navigatorLanguage) => languages.includes(navigatorLanguage)));

export const getAvailableBrowserLanguageGroupsWithNavigatorLanguages = (navigatorLanguageGroups: Readonly<string[]>, languageGroups: Readonly<string[]>): LanguageGroupWithNavigatorLanguage[] =>
	languageGroups
		.map(
			((languageGroup) => ({
				isNavigatorLanguage: navigatorLanguageGroups.includes(languageGroup),
				languageGroup,
			})),
		);
