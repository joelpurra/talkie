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
	getLanguageFromBcp47,
	getLanguageGroupFromLanguage,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	IVoiceLanguage,
	IVoiceName,
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";

export const createSafeVoiceObjectFromSpeechSynthesisVoice = (speechSynthesisVoice: SpeechSynthesisVoice): SafeVoiceObject => ({
	"default": speechSynthesisVoice.default,
	isSafeVoiceObject: true,

	// NOTE: would prefer not to transform the language here, but the 8611 (!) voices (on my system) with mislabeled BCP47 languages in firefox requires a fix.
	// NOTE: this means that there is no longer a 1-to-1 mapping between the "raw" SpeechSynthesisVoice#lang and SafeVoiceObject#lang. Each comparison must take this transformation into account.
	lang: getLanguageFromBcp47(speechSynthesisVoice.lang),

	localService: speechSynthesisVoice.localService,
	name: speechSynthesisVoice.name,
	voiceUri: speechSynthesisVoice.voiceURI,
});

const _pickFirstVoice = async <T extends IVoiceName | IVoiceLanguage>(resolvedVoices: Readonly<SpeechSynthesisVoice[]>, mappedVoiceForLogging: T): Promise<SpeechSynthesisVoice | null> => {
	if (resolvedVoices.length === 0) {
		return null;
	}

	// NOTE: while there might be more than one voice for the particular voice name/language/language group, just consistently pick the first one.
	// TODO: let the browser resolve the default?
	// if (actualMatchingVoices.length !== 1) {
	// throw new Error(`Found other matching voices: ${JSON.stringify(mappedVoiceForLogging)} ${actualMatchingVoices.length}`);
	// }

	const resolvedVoice = resolvedVoices[0];

	if (!resolvedVoice) {
		throw new TypeError(`Could not resolve voice: ${JSON.stringify(mappedVoiceForLogging)}`);
	}

	return resolvedVoice;
};

export const resolveDefaultVoiceFromLanguage = async (voices: Readonly<SpeechSynthesisVoice[]>, language: string): Promise<SpeechSynthesisVoice | null> => {
	const actualMatchingVoicesByLanguage = voices.filter((voice) => language && (getLanguageFromBcp47(voice.lang) === language));
	const mappedVoiceLanguageGroup = typeof language === "string" ? getLanguageGroupFromLanguage(language) : "";
	const actualMatchingVoicesByLanguageGroup = voices.filter((voice) => language && (voice.lang.startsWith(mappedVoiceLanguageGroup)));

	return _pickFirstVoice(
		[
			...actualMatchingVoicesByLanguage,
			...actualMatchingVoicesByLanguageGroup,
		],
		{
			lang: language,
			name: null,
		},
	);
};

export const resolveVoiceFromName = async (voices: Readonly<SpeechSynthesisVoice[]>, voiceName: string): Promise<SpeechSynthesisVoice | null> => {
	const actualMatchingVoicesByName = voices.filter((voice) => voiceName && (voice.name === voiceName));

	return _pickFirstVoice(
		actualMatchingVoicesByName,
		{
			lang: null,
			name: voiceName,
		},
	);
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const isIVoiceName = (input: unknown): input is IVoiceName => typeof input === "object" && input !== null && "name" in input && typeof (input as IVoiceName).name === "string";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const isIVoiceLanguage = (input: unknown): input is IVoiceLanguage => typeof input === "object" && input !== null && "lang" in input && typeof (input as IVoiceLanguage).lang === "string";

export const resolveVoice = async <T extends IVoiceName | IVoiceLanguage>(voices: Readonly<SpeechSynthesisVoice[]>, mappedVoice: T): Promise<SpeechSynthesisVoice | null> => {
	if (isIVoiceName(mappedVoice)) {
		return resolveVoiceFromName(voices, mappedVoice.name);
	}

	if (isIVoiceLanguage(mappedVoice)) {
		return resolveDefaultVoiceFromLanguage(voices, mappedVoice.lang);
	}

	throw new TypeError("mappedVoice");
};
