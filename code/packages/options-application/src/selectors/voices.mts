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

import "reselect";
import {
	getLanguagesByLanguageGroup,
	getVoices,
	getVoicesByLanguagesByLanguageGroup,
} from "@talkie/shared-application/selectors/voices.mjs";
import toolkit from "@reduxjs/toolkit";
const {
	createDraftSafeSelector,
} = toolkit;

import type {
	OptionsRootState,
} from "../store/index.mjs";
import { getVoiceForVoiceNameFromVoices } from "@talkie/shared-application-helpers/transform-voices.mjs";

export const getSelectedLanguageGroup = <S extends OptionsRootState>(state: S): string | null => state.voices.selectedLanguageGroup;
export const getSelectedLanguageCode = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.selectedLanguageCode;
export const getSelectedVoiceName = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.selectedVoiceName;
export const getEffectiveVoiceNameForSelectedLanguageCode = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.effectiveVoiceNameForSelectedLanguageCode;
export const getEffectiveVoiceNameForSelectedLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.effectiveVoiceNameForSelectedLanguageGroup;
export const getSampleTextForLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.sampleTextForLanguageGroup;

export const getHasSelectedLanguageGroup = createDraftSafeSelector(
	[
		getSelectedLanguageGroup,
	],
	(selectedLanguageGroup) => typeof selectedLanguageGroup === "string",
);

export const getVoicesObjectByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesByLanguagesByLanguageGroup,
		getSelectedLanguageGroup,
	],
	// TODO: eliminate null case.
	(voicesByLanguagesByLanguageGroup, selectedLanguageGroup) => voicesByLanguagesByLanguageGroup[selectedLanguageGroup ?? ""] ?? {},
);

export const getVoicesByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesObjectByLanguageForSelectedLanguageGroup,
	],
		// TODO: at some point in the hierarchy, switch to using an array insted of a nested object?
		(voicesObjectByLanguagesByLanguageGroup) => Object.values(voicesObjectByLanguagesByLanguageGroup),
);

export const getSortedVoicesByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesObjectByLanguageForSelectedLanguageGroup,
	],
	(voicesObjectByLanguagesByLanguageGroup) => {
		// TODO: at some point in the hierarchy, switch to using an array insted of a nested object?
		for (const voices of Object.values(voicesObjectByLanguagesByLanguageGroup)) {
			// TODO: ReadOnlyDeep.
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		// TODO HACK FIX: use/return immutable object.
		return voicesObjectByLanguagesByLanguageGroup;
	},
);

export const getLanguagesForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesByLanguageGroup,
		getSelectedLanguageGroup,
	],
	// TODO: eliminate null case.
	(languagesByLanguageGroupFromVoices, selectedLanguageGroup) => languagesByLanguageGroupFromVoices[selectedLanguageGroup ?? ""] ?? [],
);

export const getSortedLanguagesForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(languagesForSelectedLanguageGroup) => languagesForSelectedLanguageGroup.slice().sort((a, b) => a.localeCompare(b)),
);

export const getLanguageCountForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	(languagesForSelectedLanguageGroup) => languagesForSelectedLanguageGroup.length,
);

export const getFirstLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	// TODO: assert count and type.
	(languagesForSelectedLanguageGroup) => languagesForSelectedLanguageGroup[0] || null,
);

export const getHasSelectedLanguageCode = createDraftSafeSelector(
	[
		getSelectedLanguageCode,
	],
	(selectedLanguageCode) => typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0,
);

export const getVoicesForSelectedLanguageCode = createDraftSafeSelector(
	[
		getSortedVoicesByLanguageForSelectedLanguageGroup,
		getSelectedLanguageCode,
	],
	// TODO: eliminate null case.
	(sortedVoicesByLanguageForSelectedLanguageGroup, selectedLanguageCode) => sortedVoicesByLanguageForSelectedLanguageGroup[selectedLanguageCode ?? ""] ?? [],
);

export const getVoiceCountForSelectedLanguageCode = createDraftSafeSelector(
	[
		getVoicesForSelectedLanguageCode,
	],
	(voicesForSelectedLanguageCode) => voicesForSelectedLanguageCode.length,
);

export const getFirstVoiceForSelectedLanguageCode = createDraftSafeSelector(
	[
		getVoicesForSelectedLanguageCode,
	],
	// TODO: assert count and type.
	(voicesForSelectedLanguageCode) => voicesForSelectedLanguageCode[0] || null,
);

export const getHasSelectedVoiceName = createDraftSafeSelector(
	[
		getSelectedVoiceName,
	],
	(selectedVoiceName) => typeof selectedVoiceName === "string" && selectedVoiceName.length > 0,
);

export const getVoiceForSelectedVoiceName = createDraftSafeSelector(
	[
		getVoices,
		getSelectedVoiceName,
	],
	// TODO: assert type.
	(voices, selectedVoiceName) => selectedVoiceName ? getVoiceForVoiceNameFromVoices(voices, selectedVoiceName) : null,
);

export const getIsEffectiveVoiceNameForLanguageCode = createDraftSafeSelector(
	[
		getHasSelectedVoiceName,
		getSelectedVoiceName,
		getEffectiveVoiceNameForSelectedLanguageCode,
	],
	// NOTE: not doing type safety check duplication.
	(hasSelectedVoiceName, selectedVoiceName, effectiveVoiceNameForSelectedLanguageCode) => hasSelectedVoiceName && selectedVoiceName === effectiveVoiceNameForSelectedLanguageCode,
);

export const getIsEffectiveVoiceNameForLanguageGroup = createDraftSafeSelector(
	[
		getHasSelectedVoiceName,
		getSelectedVoiceName,
		getEffectiveVoiceNameForSelectedLanguageGroup,
	],
	// NOTE: not doing type safety check duplication.
	(hasSelectedVoiceName, selectedVoiceName, effectiveVoiceNameForSelectedLanguageGroup) => hasSelectedVoiceName && selectedVoiceName === effectiveVoiceNameForSelectedLanguageGroup,
);

export const getHasSampleTextForLanguageGroup = createDraftSafeSelector(
	[
		getSampleTextForLanguageGroup,
	],
	(sampleTextForLanguageGroup) => typeof sampleTextForLanguageGroup === "string" && sampleTextForLanguageGroup.length > 0,
);
