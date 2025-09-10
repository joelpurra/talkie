/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type {
	OptionsRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import {
	getVoiceForVoiceNameFromVoices,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	getLanguagesByLanguageGroup,
	getVoices,
	getVoicesByLanguagesByLanguageGroup,
} from "@talkie/shared-ui/selectors/voices.mjs";
// eslint-disable-next-line import-x/no-unassigned-import
import "reselect";

const {

	createDraftSafeSelector,
} = toolkit;

export const getSelectedLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.selectedLanguageGroup;
export const getSelectedLanguageCode = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.selectedLanguageCode;
export const getIsSelectedLanguageGroupTalkieLocale = <S extends OptionsRootState>(state: S): boolean => state.voices.isSelectedLanguageGroupTalkieLocale;
export const getTextDirectionForSelectedLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string> => state.voices.textDirectionForSelectedLanguageGroup;
export const getSelectedVoiceName = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.selectedVoiceName;
export const getEffectiveVoiceNameForSelectedLanguageCode = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.effectiveVoiceNameForSelectedLanguageCode;
export const getEffectiveVoiceNameForSelectedLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.effectiveVoiceNameForSelectedLanguageGroup;
export const getSampleTextForLanguageGroup = <S extends OptionsRootState>(state: S): Readonly<string | null> => state.voices.sampleTextForLanguageGroup;
export const getRateForSelectedVoice = <S extends OptionsRootState>(state: S): Readonly<number> => state.voices.rateForSelectedVoice;
export const getPitchForSelectedVoice = <S extends OptionsRootState>(state: S): Readonly<number> => state.voices.pitchForSelectedVoice;

export const getHasSelectedLanguageGroup = createDraftSafeSelector(
	[
		getSelectedLanguageGroup,
	],
	(selectedLanguageGroup) => typeof selectedLanguageGroup === "string" && selectedLanguageGroup.length > 0,
);

export const getAssertedSelectedLanguageGroup = createDraftSafeSelector(
	[
		getSelectedLanguageGroup,
	],
	(selectedLanguageGroup) => {
		// NOTE: duplicated logic to satisfy typing.
		if (typeof selectedLanguageGroup !== "string" || selectedLanguageGroup.length === 0) {
			throw new TypeError(`getAssertedSelectedLanguageGroup selectedLanguageGroup: ${JSON.stringify(selectedLanguageGroup)}`);
		}

		return selectedLanguageGroup;
	},
);

export const getVoicesObjectByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesByLanguagesByLanguageGroup,
		getSelectedLanguageGroup,
	],
	// TODO: eliminate null case.
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voicesByLanguagesByLanguageGroup, selectedLanguageGroup) => voicesByLanguagesByLanguageGroup[selectedLanguageGroup ?? "selectedLanguageGroup-does-not-exist"] ?? {},
);

export const getVoicesByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesObjectByLanguageForSelectedLanguageGroup,
	],
	// TODO: at some point in the hierarchy, switch to using an array insted of a nested object?
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voicesObjectByLanguagesByLanguageGroup) => Object.values(voicesObjectByLanguagesByLanguageGroup),
);

export const getSortedVoicesByLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getVoicesObjectByLanguageForSelectedLanguageGroup,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voicesObjectByLanguagesByLanguageGroup) => {
		// TODO: at some point in the hierarchy, switch to using an array insted of a nested object?
		for (const voices of Object.values(voicesObjectByLanguagesByLanguageGroup)) {
			// TODO: ReadOnlyDeep.
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		return voicesObjectByLanguagesByLanguageGroup;
	},
);

export const getLanguagesForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesByLanguageGroup,
		getSelectedLanguageGroup,
	],
	// TODO: eliminate null case.
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(languagesByLanguageGroupFromVoices, selectedLanguageGroup) => languagesByLanguageGroupFromVoices[selectedLanguageGroup ?? "selectedLanguageGroup-does-not-exist"] ?? [],
);

export const getSortedLanguagesForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(languagesForSelectedLanguageGroup) => [
		...languagesForSelectedLanguageGroup,
	].sort((a, b) => a.localeCompare(b)),
);

export const getLanguageCountForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(languagesForSelectedLanguageGroup) => languagesForSelectedLanguageGroup.length,
);

export const getFirstLanguageForSelectedLanguageGroup = createDraftSafeSelector(
	[
		getLanguagesForSelectedLanguageGroup,
	],
	// TODO: assert count and type.
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(languagesForSelectedLanguageGroup) => languagesForSelectedLanguageGroup[0] ?? null,
);

export const getHasSelectedLanguageCode = createDraftSafeSelector(
	[
		getSelectedLanguageCode,
	],
	(selectedLanguageCode) => typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0,
);

export const getAssertedSelectedLanguageCode = createDraftSafeSelector(
	[
		getSelectedLanguageCode,
	],
	(selectedLanguageCode) => {
		// NOTE: duplicated logic to satisfy typing.
		if (typeof selectedLanguageCode !== "string" || selectedLanguageCode.length === 0) {
			throw new TypeError(`getAssertedSelectedLanguageCode selectedLanguageCode: ${JSON.stringify(selectedLanguageCode)}`);
		}

		return selectedLanguageCode;
	},
);

export const getVoicesForSelectedLanguageCode = createDraftSafeSelector(
	[
		getSortedVoicesByLanguageForSelectedLanguageGroup,
		getSelectedLanguageCode,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(sortedVoicesByLanguageForSelectedLanguageGroup, selectedLanguageCode) => sortedVoicesByLanguageForSelectedLanguageGroup[selectedLanguageCode ?? "selectedLanguageCode-does-not-exist"] ?? [],
);

export const getVoiceCountForSelectedLanguageCode = createDraftSafeSelector(
	[
		getVoicesForSelectedLanguageCode,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voicesForSelectedLanguageCode) => voicesForSelectedLanguageCode.length,
);

export const getFirstVoiceForSelectedLanguageCode = createDraftSafeSelector(
	[
		getVoicesForSelectedLanguageCode,
	],
	// TODO: assert count and type.
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voicesForSelectedLanguageCode) => voicesForSelectedLanguageCode[0] ?? null,
);

export const getHasSelectedVoiceName = createDraftSafeSelector(
	[
		getSelectedVoiceName,
	],
	(selectedVoiceName) => typeof selectedVoiceName === "string" && selectedVoiceName.length > 0,
);

export const getAssertedSelectedVoiceName = createDraftSafeSelector(
	[
		getSelectedVoiceName,
	],
	(selectedVoiceName) => {
		// NOTE: duplicated logic to satisfy typing.
		if (typeof selectedVoiceName !== "string" || selectedVoiceName.length === 0) {
			throw new TypeError(`getAssertedSelectedVoiceName selectedVoiceName: ${JSON.stringify(selectedVoiceName)}`);
		}

		return selectedVoiceName;
	},
);

export const getVoiceForSelectedVoiceName = createDraftSafeSelector(
	[
		getVoices,
		getSelectedVoiceName,
	],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	(voices, selectedVoiceName) => selectedVoiceName ? getVoiceForVoiceNameFromVoices(voices, selectedVoiceName) : null,
);

export const getIsEffectiveVoiceNameForLanguageCode = createDraftSafeSelector(
	[
		getSelectedVoiceName,
		getEffectiveVoiceNameForSelectedLanguageCode,
	],
	// NOTE: not doing type safety check duplication.
	(selectedVoiceName, effectiveVoiceNameForSelectedLanguageCode) => selectedVoiceName !== null && selectedVoiceName === effectiveVoiceNameForSelectedLanguageCode,
);

export const getIsEffectiveVoiceNameForLanguageGroup = createDraftSafeSelector(
	[
		getSelectedVoiceName,
		getEffectiveVoiceNameForSelectedLanguageGroup,
	],
	(selectedVoiceName, effectiveVoiceNameForSelectedLanguageGroup) => selectedVoiceName !== null && selectedVoiceName === effectiveVoiceNameForSelectedLanguageGroup,
);

export const getHasSampleTextForLanguageGroup = createDraftSafeSelector(
	[
		getSampleTextForLanguageGroup,
	],
	(sampleTextForLanguageGroup) => typeof sampleTextForLanguageGroup === "string" && sampleTextForLanguageGroup.length > 0,
);

export const getCanSpeakInSelectedVoiceName = createDraftSafeSelector(
	[
		getSelectedVoiceName,
		getSampleTextForLanguageGroup,
		getRateForSelectedVoice,
		getPitchForSelectedVoice,
	],
	(selectedVoiceName, sampleTextForLanguageGroup, rateForSelectedVoice, pitchForSelectedVoice) =>
		typeof sampleTextForLanguageGroup === "string"
		&& sampleTextForLanguageGroup.length > 0
		&& typeof selectedVoiceName === "string"
		&& selectedVoiceName.length > 0
		&& typeof rateForSelectedVoice === "number"
		&& typeof pitchForSelectedVoice === "number",
);
