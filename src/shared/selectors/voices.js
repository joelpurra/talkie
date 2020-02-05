/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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
    createSelector,
} from "reselect";

import {
    getLanguageGroupsFromLanguages,
    getLanguagesByLanguageGroupFromVoices,
    getLanguagesFromVoices,
    getVoicesByLanguageFromVoices,
    getVoicesByLanguageGroupFromVoices,
    getVoicesByLanguagesByLanguageGroupFromVoices,
    getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups,
} from "../utils/transform-voices";

export const getVoices = (state) => state.shared.voices.voices;

export const getVoicesCount = createSelector(
    [
        getVoices,
    ],
    (voices) => voices.length,
);

export const getLanguages = createSelector(
    [
        getVoices,
    ],
    (voices) => getLanguagesFromVoices(voices),
);

export const getLanguagesCount = createSelector(
    [
        getLanguages,
    ],
    (languages) => languages.length,
);

export const getLanguageGroups = createSelector(
    [
        getLanguages,
    ],
    (languages) => getLanguageGroupsFromLanguages(languages),
);

export const getLanguageGroupsCount = createSelector(
    [
        getLanguageGroups,
    ],
    (languageGroups) => languageGroups.length,
);

export const getVoicesByLanguage = createSelector(
    [
        getVoices,
    ],
    (voices) => getVoicesByLanguageFromVoices(voices),
);

export const getVoicesByLanguageGroup = createSelector(
    [
        getVoices,
    ],
    (voices) => getVoicesByLanguageGroupFromVoices(voices),
);

export const getLanguagesByLanguageGroup = createSelector(
    [
        getVoices,
    ],
    (voices) => getLanguagesByLanguageGroupFromVoices(voices),
);

export const getVoicesByLanguagesByLanguageGroup = createSelector(
    [
        getVoices,
    ],
    (voices) => getVoicesByLanguagesByLanguageGroupFromVoices(voices),
);

export const getNavigatorLanguages = (state) => state.shared.voices.navigatorLanguages;

export const getAvailableBrowserLanguageWithInstalledVoice = createSelector(
    [
        getNavigatorLanguages,
        getLanguages,
        getLanguageGroups,
    ],
    (navigatorLanguages, languages, languageGroups) => getAvailableBrowserLanguageWithInstalledVoiceFromNavigatorLanguagesAndLanguagesAndLanguageGroups(navigatorLanguages, languages, languageGroups),
);
