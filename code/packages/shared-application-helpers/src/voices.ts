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
	IVoiceNameAndLanguage,
	IVoiceNameAndLanguageOrNull,
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";

import {
	getLanguageGroupFromLanguage,
} from "./transform-voices";

export const copySpeechSynthesisVoice = (speechSynthesisVoice: SpeechSynthesisVoice): SafeVoiceObject => ({
	"default": speechSynthesisVoice.default,
	isSafeVoiceObject: true,
	lang: speechSynthesisVoice.lang,
	localService: speechSynthesisVoice.localService,
	name: speechSynthesisVoice.name,
	voiceURI: speechSynthesisVoice.voiceURI,
});

export const getMappedVoice = <T extends IVoiceNameAndLanguage>(voice: T): IVoiceNameAndLanguage => ({
	lang: voice.lang,
	name: voice.name,
});

export const resolveVoice = async <T extends IVoiceNameAndLanguageOrNull, U extends (SpeechSynthesisVoice | SafeVoiceObject)>(voices: Readonly<U[]>, mappedVoice: T): Promise<U | null> => {
	const actualMatchingVoicesByName = voices.filter((voice) => mappedVoice.name && (voice.name === mappedVoice.name));
	const actualMatchingVoicesByLanguage = voices.filter((voice) => mappedVoice.lang && (voice.lang === mappedVoice.lang));
	const mappedVoiceLanguageGroup = typeof mappedVoice?.lang === "string" ? getLanguageGroupFromLanguage(mappedVoice.lang) : "";
	const actualMatchingVoicesByLanguageGroup = voices.filter((voice) => mappedVoice.lang && (voice.lang.startsWith(mappedVoiceLanguageGroup)));

	const resolvedVoices = new Array<U>()
		.concat(actualMatchingVoicesByName)
		.concat(actualMatchingVoicesByLanguage)
		.concat(actualMatchingVoicesByLanguageGroup);

	if (resolvedVoices.length === 0) {
		return null;
	}

	// NOTE: while there might be more than one voice for the particular voice name/language/language group, just consistently pick the first one.
	// if (actualMatchingVoices.length !== 1) {
	// throw new Error(`Found other matching voices: ${JSON.stringify(mappedVoice)} ${actualMatchingVoices.length}`);
	// }

	const resolvedVoice = resolvedVoices[0];

	if (!resolvedVoice) {
		throw new TypeError(`Could not resolve voice: ${JSON.stringify(mappedVoice)}`);
	}

	return resolvedVoice;
};

export const rateRange = {
	"default": 1,
	max: 10,
	min: 0.1,
	step: 0.1,
};

export const pitchRange = {
	"default": 1,
	max: 2,
	min: 0,
	step: 0.1,
};
