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
	createAsyncThunk,
	createSlice,
	Draft,
	PayloadAction,
} from "@reduxjs/toolkit";
import * as HACKYHACKFUNCTIONS from "@talkie/shared-application/slices/languages-hack-functions";
import {
	IApiAsyncThunkConfig,
} from "@talkie/shared-application/slices/slices-types";
import {
	isLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";

import type {
	OptionsRootState,
} from "../store";
import { getFirstLanguageForSelectedLanguageGroup, getFirstVoiceForSelectedLanguageCode, getLanguageCountForSelectedLanguageGroup, getVoiceCountForSelectedLanguageCode } from "../selectors/voices";

interface StoreVoiceRateOverrideArguments {
	rate: number;
	voiceName: string;
}

interface StoreVoicePitchOverrideArguments {
	pitch: number;
	voiceName: string;
}

interface StoreEffectiveVoiceNameForLanguageArguments {
	languageCodeOrGroup: string;
	voiceName: string;
}

export interface VoicesState {
	// TODO: split slice to languages/language/dialects/dialect/voices/voice.
	effectiveVoiceNameForSelectedLanguageCode: string | null;
	effectiveVoiceNameForSelectedLanguageGroup: string | null;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	sampleTextForLanguageGroup: string | null;
	selectedLanguageCode: string | null;
	selectedLanguageGroup: string | null;
	selectedVoiceName: string | null;
}

const initialState: VoicesState = {
	effectiveVoiceNameForSelectedLanguageCode: null,
	effectiveVoiceNameForSelectedLanguageGroup: null,
	pitchForSelectedVoice: 1,
	rateForSelectedVoice: 1,
	sampleTextForLanguageGroup: null,
	selectedLanguageCode: null,
	selectedLanguageGroup: null,
	selectedVoiceName: null,
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadSelectedLanguageCode = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedLanguageCode`,
	async (languageCode, thunkApi) => {
		thunkApi.dispatch(setSelectedLanguageCode(languageCode));
		await thunkApi.dispatch(loadEffectiveVoiceForLanguageCode(languageCode));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		const state: OptionsRootState = thunkApi.getState() as any;
		const voiceCountForSelectedLanguageCode = getVoiceCountForSelectedLanguageCode(state);
		const voice = voiceCountForSelectedLanguageCode === 1
			? getFirstVoiceForSelectedLanguageCode(state)
			: null;
		const voiceName = voice?.name ?? null;

		await thunkApi.dispatch(loadSelectedVoiceName(voiceName));
	},
);

export const loadSelectedLanguageGroup = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedLanguageGroup`,
	async (languageGroup, thunkApi) => {
		thunkApi.dispatch(setSelectedLanguageGroup(languageGroup));
		await thunkApi.dispatch(loadEffectiveVoiceForLanguageGroup(languageGroup));

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		const state: OptionsRootState = thunkApi.getState() as any;
		const languageCountForSelectedLanguageGroup = getLanguageCountForSelectedLanguageGroup(state);
		const language = languageCountForSelectedLanguageGroup === 1
			? getFirstLanguageForSelectedLanguageGroup(state)
			: null;

		await thunkApi.dispatch(loadSelectedLanguageCode(language));
	},
);

export const loadSelectedVoiceName = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedVoiceName`,
	async (voiceName, thunkApi) => {
		thunkApi.dispatch(setSelectedVoiceName(voiceName));

		if (typeof voiceName === "string") {
			await Promise.all([
				thunkApi.dispatch(loadEffectiveRateForVoice(voiceName)),
				thunkApi.dispatch(loadEffectivePitchForVoice(voiceName)),
			]);
		}
	},
);

export const loadEffectiveRateForVoice = createAsyncThunk<number, string, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveRateForVoice`,
	async (voiceName, thunkApi) => thunkApi.extra.getEffectiveRateForVoice(voiceName),
);

export const storeVoiceRateOverride = createAsyncThunk<void, StoreVoiceRateOverrideArguments, IApiAsyncThunkConfig>(
	`${prefix}/storeVoiceRateOverride`,
	async ({
		rate, voiceName,
	}, thunkApi) => {
		await thunkApi.extra.setVoiceRateOverride(voiceName, rate);
		thunkApi.dispatch(setRateForSelectedVoice(rate));
		void thunkApi.dispatch(speakInSelectedVoiceNameState());
	},
);

export const loadEffectivePitchForVoice = createAsyncThunk<number, string, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectivePitchForVoice`,
	async (voiceName, thunkApi) => thunkApi.extra.getEffectivePitchForVoice(voiceName),
);

export const storeVoicePitchOverride = createAsyncThunk<void, StoreVoicePitchOverrideArguments, IApiAsyncThunkConfig>(
	`${prefix}/storeVoicePitchOverride`,
	async ({
		pitch, voiceName,
	}, thunkApi) => {
		await thunkApi.extra.setVoicePitchOverride(voiceName, pitch);
		thunkApi.dispatch(setPitchForSelectedVoice(pitch));
		void thunkApi.dispatch(speakInSelectedVoiceNameState());
	},
);

export const loadEffectiveVoiceForLanguageCode = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveVoiceForLanguage`,
	async (languageCode, thunkApi) => {
		if (typeof languageCode === "string") {
			const effectiveVoiceForLanguage = await thunkApi.extra.getEffectiveVoiceForLanguage(languageCode);

			thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguage(effectiveVoiceForLanguage));
		} else {
			thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguage(null));
		}
	},
);

export const loadEffectiveVoiceForLanguageGroup = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveVoiceForLanguageGroup`,
	async (languageGroup, thunkApi) => {
		if (typeof languageGroup === "string") {
			const effectiveVoiceForLanguageGroup = await thunkApi.extra.getEffectiveVoiceForLanguage(languageGroup);

			thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguageGroup(effectiveVoiceForLanguageGroup));
		} else {
			thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguageGroup(null));
		}
	},
);

export const storeEffectiveVoiceNameForLanguage = createAsyncThunk<void, StoreEffectiveVoiceNameForLanguageArguments, IApiAsyncThunkConfig>(
	`${prefix}/storeEffectiveVoiceNameForLanguage`,
	async ({
		languageCodeOrGroup,
		voiceName,
	}, thunkApi) => {
		await thunkApi.extra.toggleLanguageVoiceOverrideName(languageCodeOrGroup, voiceName);

		// HACK: duplicate function to set either language code or group?
		await (isLanguageGroup(languageCodeOrGroup) ? thunkApi.dispatch(loadEffectiveVoiceForLanguageGroup(languageCodeOrGroup)) : thunkApi.dispatch(loadEffectiveVoiceForLanguageCode(languageCodeOrGroup)));
	},
);

export const loadSampleTextForLanguageGroup = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSampleTextForLanguageGroup`,
	async (_, thunkApi) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		const state: OptionsRootState = thunkApi.getState() as any;
		const {
			selectedLanguageGroup,
		} = state.voices;

		const sampleTextForLanguageGroup = typeof selectedLanguageGroup === "string"
			// eslint-disable-next-line no-sync
			? HACKYHACKFUNCTIONS.getSampleTextForLanguageSync(selectedLanguageGroup)
			: null;

		thunkApi.dispatch(setSampleTextForLanguageGroup(sampleTextForLanguageGroup));
	},
);

export const speakInSelectedVoiceNameState = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/speakInSelectedVoiceNameState`,
	async (_, thunkApi) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
		const state: OptionsRootState = thunkApi.getState() as any;
		const {
			sampleTextForLanguageGroup,
			selectedVoiceName,
			rateForSelectedVoice,
			pitchForSelectedVoice,
		} = state.voices;

		// TODO: move to function/state/selector?
		// NOTE: all logic in the if statement, since typescript's typing doesn't like having a separate boolean variable.
		if (
			typeof sampleTextForLanguageGroup === "string"
			&& sampleTextForLanguageGroup.length > 0
			&& typeof selectedVoiceName === "string"
			&& selectedVoiceName.length > 0
			&& typeof rateForSelectedVoice === "number"
			&& typeof pitchForSelectedVoice === "number"
		) {
			const text = sampleTextForLanguageGroup;
			const voice = {
				name: selectedVoiceName,
				pitch: pitchForSelectedVoice,
				rate: rateForSelectedVoice,
			};

			thunkApi.extra.debouncedSpeakTextInCustomVoice(text, voice);
		}
	},
);

export const voicesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadEffectiveRateForVoice.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.rateForSelectedVoice = action.payload;
			})
			.addCase(loadEffectivePitchForVoice.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.pitchForSelectedVoice = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setEffectiveVoiceNameForSelectedLanguage: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.effectiveVoiceNameForSelectedLanguageCode = action.payload;
		},
		setEffectiveVoiceNameForSelectedLanguageGroup: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.effectiveVoiceNameForSelectedLanguageGroup = action.payload;
		},
		setPitchForSelectedVoice: (state: Draft<VoicesState>, action: PayloadAction<number>) => {
			state.pitchForSelectedVoice = action.payload;
		},
		setRateForSelectedVoice: (state: Draft<VoicesState>, action: PayloadAction<number>) => {
			state.rateForSelectedVoice = action.payload;
		},
		setSampleTextForLanguageGroup: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.sampleTextForLanguageGroup = action.payload;
		},
		setSelectedLanguageCode: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.selectedLanguageCode = action.payload;
		},
		setSelectedLanguageGroup: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.selectedLanguageGroup = action.payload;
		},
		setSelectedVoiceName: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.selectedVoiceName = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setEffectiveVoiceNameForSelectedLanguage,
	setEffectiveVoiceNameForSelectedLanguageGroup,
	setPitchForSelectedVoice,
	setRateForSelectedVoice,
	setSampleTextForLanguageGroup,
	setSelectedLanguageCode,
	setSelectedLanguageGroup,
	setSelectedVoiceName,
} = voicesSlice.actions;
export default voicesSlice.reducer;
