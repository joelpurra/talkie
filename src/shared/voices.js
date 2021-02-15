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
	getBackgroundPage,
} from "./tabs";

export const getVoices = async () => {
	// TODO: check if there are any voices installed, alert user if not.
	const background = await getBackgroundPage();
	const voices = await background.getAllVoices();

	if (!Array.isArray(voices)) {
		// NOTE: the list of voices could still be empty, either due to slow loading (cold cache) or that there actually are no voices loaded.
		throw new TypeError("Could not load list of voices from browser.");
	}

	return voices;
};

const getMappedVoice = (voice) => {
	return {
		"default": voice.default,
		lang: voice.lang,
		localService: voice.localService,
		name: voice.name,
		voiceURI: voice.voiceURI,
	};
};

export const getMappedVoices = async () => {
	const voices = await getVoices();

	const mappedVoices = voices.map((voice) => getMappedVoice(voice));

	return mappedVoices;
};

export const resolveVoice = async (mappedVoice) => {
	const voices = await getVoices();

	const actualMatchingVoicesByName = voices.filter((voice) => mappedVoice.name && (voice.name === mappedVoice.name));
	const actualMatchingVoicesByLanguage = voices.filter((voice) => mappedVoice.lang && (voice.lang === mappedVoice.lang));
	const actualMatchingVoicesByLanguagePrefix = voices.filter((voice) => mappedVoice.lang && (voice.lang.slice(0, 2) === mappedVoice.lang.slice(0, 2)));

	const resolvedVoices = []
		.concat(actualMatchingVoicesByName)
		.concat(actualMatchingVoicesByLanguage)
		.concat(actualMatchingVoicesByLanguagePrefix);

	if (resolvedVoices.length === 0) {
		return null;
	}

	// NOTE: while there might be more than one voice for the particular voice name/language/language prefix, just consistently pick the first one.
	// if (actualMatchingVoices.length !== 1) {
	// throw new Error(`Found other matching voices: ${JSON.stringify(mappedVoice)} ${actualMatchingVoices.length}`);
	// }

	const resolvedVoice = resolvedVoices[0];

	return resolvedVoice;
};

export const resolveVoiceAsMappedVoice = async (mappedVoice) => {
	const resolvedVoice = await resolveVoice(mappedVoice);

	if (!resolvedVoice) {
		return null;
	}

	const resolvedVoiceAsMappedVoice = getMappedVoice(resolvedVoice);

	return resolvedVoiceAsMappedVoice;
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
