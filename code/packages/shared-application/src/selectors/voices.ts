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
	getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups,
	getLanguageGroupsFromLanguages,
	getLanguagesByLanguageGroupFromVoices,
	getLanguagesFromVoices,
	getVoicesByLanguageFromVoices,
	getVoicesByLanguageGroupFromVoices,
	getVoicesByLanguagesByLanguageGroupFromVoices,
	LanguagesByLanguageGroup,
	VoicesByLanguageGroup,
	VoicesByLanguagesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import {
	createSelector,
} from "reselect";

import {
	SharedRootState,
} from "../store";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const getVoices = <S extends SharedRootState>(state: S): Readonly<SafeVoiceObject[]> => state.shared.voices.voices;

export const getVoicesCount = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, number>(
	[
		getVoices,
	],
	(voices) => voices.length,
);

export const getLanguages = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, Readonly<string[]>>(
	[
		getVoices,
	],
	(voices) => getLanguagesFromVoices(voices),
);

export const getLanguagesCount = createSelector(
	[
		getLanguages,
	],
	(languages: Readonly<string[]>) => languages.length,
);

export const getLanguageGroups = createSelector(
	[
		getLanguages,
	],
	(languages: Readonly<string[]>) => getLanguageGroupsFromLanguages(languages),
);

export const getLanguageGroupsCount = createSelector(
	[
		getLanguageGroups,
	],
	(languageGroups: Readonly<string[]>) => languageGroups.length,
);

export const getVoicesByLanguage = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, VoicesByLanguageGroup<SafeVoiceObject>>(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguageFromVoices(voices),
);

export const getVoicesByLanguageGroup = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, VoicesByLanguageGroup<SafeVoiceObject>>(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguageGroupFromVoices(voices),
);

export const getLanguagesByLanguageGroup = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, LanguagesByLanguageGroup>(
	[
		getVoices,
	],
	(voices) => getLanguagesByLanguageGroupFromVoices(voices),
);

export const getVoicesByLanguagesByLanguageGroup = createSelector<SharedRootState, Readonly<SafeVoiceObject[]>, VoicesByLanguagesByLanguageGroup<SafeVoiceObject>>(
	[
		getVoices,
	],
	(voices) => getVoicesByLanguagesByLanguageGroupFromVoices(voices),
);

export const getNavigatorLanguages = <S extends SharedRootState>(state: S): Readonly<string[]> => state.shared.voices.navigatorLanguages;

export const getAvailableBrowserLanguageWithInstalledVoice = createSelector(
	[
		getNavigatorLanguages,
		getLanguages,
		getLanguageGroups,
	],
	(navigatorLanguages, languages, languageGroups) => getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups(navigatorLanguages, languages, languageGroups),
);

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */
