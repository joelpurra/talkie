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

export const getVoicesForLanguage = (voices, languageCode) => {
	const voicesForLanguage = voices.filter((voice) => voice.lang.startsWith(languageCode));

	return voicesForLanguage;
};

export const getVoicesForLanguageExact = (voices, languageCode) => {
	const voicesForLanguage = voices.filter((voice) => voice.lang === languageCode);

	return voicesForLanguage;
};

export const getLanguageGroupsAndLanguagesFromLanguages = (languages) => {
	const languageGroupsAndLanguagesObject = languages.reduce((object, language) => {
		let languageGroupAndLanguageCodes = null;

		if (language.length === 2) {
			languageGroupAndLanguageCodes = languageGroupAndLanguageCodes.concat(language);
		} else {
			languageGroupAndLanguageCodes = languageGroupAndLanguageCodes.concat([
				language.slice(0, 2),
				language,
			]);
		}

		languageGroupAndLanguageCodes.forEach((languageGroupAndLanguageCode) => {
			object[languageGroupAndLanguageCode] = (object[languageGroupAndLanguageCode] || 0) + 1;
		});

		return object;
	},
	{});

	const languageGroups = Object.keys(languageGroupsAndLanguagesObject);

	languageGroups.sort();

	return languageGroups;
};

export const getLanguageGroupsFromLanguages = (languages) => {
	const languageGroupsObject = languages.reduce((object, language) => {
		let languageGroupCode = null;

		if (language.length === 2) {
			languageGroupCode = language;
		} else {
			languageGroupCode = language.slice(0, 2);
		}

		object[languageGroupCode] = (object[languageGroupCode] || 0) + 1;

		return object;
	},
	{});

	const languageGroups = Object.keys(languageGroupsObject);

	languageGroups.sort();

	return languageGroups;
};

export const getLanguagesFromVoices = (voices) => {
	const languagesAsKeys = voices.reduce(
		(object, voice) => {
			object[voice.lang] = (object[voice.lang] || 0) + 1;

			return object;
		},
		{},
	);

	const languages = Object.keys(languagesAsKeys);

	languages.sort();

	return languages;
};

export const getLanguageGroupsFromVoices = (voices) => {
	const languageGroupsAsKeys = voices.reduce(
		(object, voice) => {
			const group = voice.lang.slice(0, 2);
			object[group] = (object[group] || 0) + 1;

			return object;
		},
		{},
	);

	const languageGroups = Object.keys(languageGroupsAsKeys);

	languageGroups.sort();

	return languageGroups;
};

export const getVoicesByLanguageFromVoices = (voices) => {
	const voicesByLanguage = voices.reduce(
		(object, voice) => {
			object[voice.lang] = (object[voice.lang] || []).concat(Object.assign({}, voice));

			return object;
		},
		{},
	);

	return voicesByLanguage;
};

export const getVoicesByLanguageGroupFromVoices = (voices) => {
	const voicesByLanguageGroup = voices.reduce(
		(object, voice) => {
			const group = voice.lang.slice(0, 2);
			object[group] = (object[group] || []).concat(Object.assign({}, voice));

			return object;
		},
		{},
	);

	return voicesByLanguageGroup;
};

export const getVoicesByLanguagesByLanguageGroupFromVoices = (voices) => {
	const voicesByLanguage = getVoicesByLanguageFromVoices(voices);

	const languagesByLanguageGroup = voices.reduce(
		(object, voice) => {
			const group = voice.lang.slice(0, 2);
			object[group] = (object[group] || {});
			object[group][voice.lang] = voicesByLanguage[voice.lang];

			return object;
		},
		{},
	);

	return languagesByLanguageGroup;
};

export const getLanguagesByLanguageGroupFromVoices = (voices) => {
	const voicesByLanguagesByLanguageGroup = getVoicesByLanguagesByLanguageGroupFromVoices(voices);

	const languageGroups = Object.keys(voicesByLanguagesByLanguageGroup);

	const languagesByLanguageGroup = languageGroups.reduce(
		(object, group) => {
			const languages = Object.keys(voicesByLanguagesByLanguageGroup[group]);

			object[group] = languages;

			return object;
		},
		{},
	);

	Object.keys(languagesByLanguageGroup)
		.forEach((languageGroup) => languagesByLanguageGroup[languageGroup].sort());

	return languagesByLanguageGroup;
};

export const getLanguageForVoiceNameFromVoices = (voices, voiceName) => {
	const matchingVoices = voices.filter((voice) => voice.name === voiceName);

	if (matchingVoices.length !== 1) {
		throw new Error(`Mismatching number of voices found: ${matchingVoices.length}`);
	}

	const voice = matchingVoices[0];

	return voice;
};

export const getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups = (navigatorLanguages, languages, languageGroups) => []
// NOTE: preferring language groups over languages/dialects.
	.concat(navigatorLanguages.filter((navigatorLanguage) => languageGroups.includes(navigatorLanguage)))
	.concat(navigatorLanguages.filter((navigatorLanguage) => languages.includes(navigatorLanguage)));
