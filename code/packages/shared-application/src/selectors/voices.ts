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
	getAvailableBrowserLanguageGroupsWithNavigatorLanguages,
	getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups,
	getLanguageGroupsFromLanguages,
	getLanguagesByLanguageGroupFromVoices,
	getLanguagesFromVoices,
	getVoicesByLanguageFromVoices,
	getVoicesByLanguageGroupFromVoices,
	getVoicesByLanguagesByLanguageGroupFromVoices,
} from "@talkie/shared-application-helpers/transform-voices";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import {
	createDraftSafeSelector,
} from "@reduxjs/toolkit";

import type {
	SharedRootState,
} from "../store";
import {
	getNavigatorLanguageGroups,
	getNavigatorLanguages,
} from "./languages";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const getVoices = <S extends SharedRootState>(state: S): Readonly<SafeVoiceObject[]> => state.shared.voices.voices;

export const getVoicesCount = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => voices.length,
);

export const getSortedByNameVoices = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => voices.slice().sort((a, b) => a.name.localeCompare(b.name)),
);

export const getHaveVoices = createDraftSafeSelector(
	[
		getVoicesCount,
	],
	(voiceCount) => voiceCount > 0,
);

export const getLanguages = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => getLanguagesFromVoices(voices),
);

export const getSortedLanguages = createDraftSafeSelector(
	[
		getLanguages,
	],
	(languages) => languages.slice().sort((a, b) => a.localeCompare(b)),
);

export const getLanguagesCount = createDraftSafeSelector(
	[
		getLanguages,
	],
	(languages: Readonly<string[]>) => languages.length,
);

export const getLanguageGroups = createDraftSafeSelector(
	[
		getLanguages,
	],
	(languages: Readonly<string[]>) => getLanguageGroupsFromLanguages(languages),
);

export const getLanguageGroupsCount = createDraftSafeSelector(
	[
		getLanguageGroups,
	],
	(languageGroups: Readonly<string[]>) => languageGroups.length,
);

export const getSortedLanguageGroups = createDraftSafeSelector(
	[
		getLanguageGroups,
	],
	(languageGroups) => languageGroups.slice().sort((a, b) => a.localeCompare(b)),
);

export const getVoicesByLanguage = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguageFromVoices(voices),
);

export const getSortedByNameVoicesByLanguage = createDraftSafeSelector(
	[
		getVoicesByLanguage,
	],
	(voicesByLanguage) => {
		for (const voices of Object.values(voicesByLanguage)) {
			// TODO: ReadOnlyDeep.
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		// TODO HACK FIX: use/return immutable object.
		return voicesByLanguage;
	},
);

export const getVoicesByLanguageGroup = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguageGroupFromVoices(voices),
);

export const getSortedByNameVoicesByLanguageGroup = createDraftSafeSelector(
	[
		getVoicesByLanguageGroup,
	],
	(voicesByLanguageGroup) => {
		for (const voices of Object.values(voicesByLanguageGroup)) {
			// TODO: ReadOnlyDeep.
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		// TODO HACK FIX: use/return immutable object.
		return voicesByLanguageGroup;
	},
);

export const getLanguagesByLanguageGroup = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => getLanguagesByLanguageGroupFromVoices(voices),
);

export const getSortedLanguagesByLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesByLanguageGroup,
	],
	(languagesByLanguageGroup) => {
		for (const languages of Object.values(languagesByLanguageGroup)) {
			// TODO: ReadOnlyDeep.
			languages.sort((a, b) => a.localeCompare(b));
		}

		// TODO HACK FIX: use/return immutable object.
		return languagesByLanguageGroup;
	},
);

export const getVoicesByLanguagesByLanguageGroup = createDraftSafeSelector(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguagesByLanguageGroupFromVoices(voices),
);

export const getAvailableBrowserLanguageWithInstalledVoice = createDraftSafeSelector(
	[
		getNavigatorLanguages,
		getLanguages,
		getLanguageGroups,
	],
	(navigatorLanguages, languages, languageGroups) => getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups(navigatorLanguages, languages, languageGroups),
);

export const getBrowserLanguageGroupsWithNavigatorLanguages = createDraftSafeSelector(
	[
		getNavigatorLanguageGroups,
		getLanguageGroups,
	],
	(navigatorLanguageGroups, languageGroups) => getAvailableBrowserLanguageGroupsWithNavigatorLanguages(navigatorLanguageGroups, languageGroups),
);

export const getSortedBrowserLanguageGroupsWithNavigatorLanguages = createDraftSafeSelector(
	[
		getBrowserLanguageGroupsWithNavigatorLanguages,
	],
	(browserLanguageGroupsWithNavigatorLanguages) => browserLanguageGroupsWithNavigatorLanguages.slice().sort((a, b) => a.languageGroup.localeCompare(b.languageGroup)),
);

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */
