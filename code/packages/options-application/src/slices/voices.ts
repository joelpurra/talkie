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
import {
	IApiAsyncThunkConfig,
} from "@talkie/shared-application/slices/slices-types";

interface StoreVoiceRateOverrideArguments {
	rate: number;
	voiceName: string;
}

interface StoreVoicePitchOverrideArguments {
	pitch: number;
	voiceName: string;
}

interface StoreEffectiveVoiceNameForLanguageArguments {
	languageCode: string;
	voiceName: string;
}

export interface VoicesState {
	effectiveVoiceNameForSelectedLanguage: string | null;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	sampleText: string;
	selectedLanguageCode: string | null;
	selectedVoiceName: string | null;
	speakLongTexts: boolean;
}

const initialState: VoicesState = {
	effectiveVoiceNameForSelectedLanguage: null,
	pitchForSelectedVoice: 1,
	rateForSelectedVoice: 1,
	sampleText: "",
	selectedLanguageCode: null,
	selectedVoiceName: null,
	speakLongTexts: false,
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadSelectedLanguageCode = createAsyncThunk<void, string, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedLanguageCode`,
	async (languageCode, thunkApi) => {
		thunkApi.dispatch(setSelectedLanguageCode(languageCode));
		await thunkApi.dispatch(loadEffectiveVoiceForLanguage(languageCode));
	},
);

export const loadSelectedVoiceName = createAsyncThunk<void, string, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedVoiceName`,
	async (voiceName, thunkApi) => {
		thunkApi.dispatch(setSelectedVoiceName(voiceName));
		await Promise.all([
			thunkApi.dispatch(loadEffectiveRateForVoice(voiceName)),
			thunkApi.dispatch(loadEffectivePitchForVoice(voiceName)),
		]);
		await thunkApi.dispatch(speakState());
	},
);

export const loadSampleText = createAsyncThunk<string, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSampleText`,
	async (_, thunkApi) => thunkApi.extra.getSampleText(),
);

export const loadSpeakLongTexts = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakLongTexts`,
	async (_, thunkApi) => thunkApi.extra.getSpeakLongTextsOption(),
);

export const storeSpeakLongTexts = createAsyncThunk<void, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeSpeakLongTexts`,
	async (speakLongTexts, thunkApi) => {
		await thunkApi.extra.setSpeakLongTextsOption(speakLongTexts);
		thunkApi.dispatch(setSpeakLongTexts(speakLongTexts));
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
		await thunkApi.dispatch(speakState());
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
		await thunkApi.dispatch(speakState());
	},
);

export const loadEffectiveVoiceForLanguage = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveVoiceForLanguage`,
	async (languageCode, thunkApi) => {
		if (languageCode) {
			const effectiveVoiceForLanguage = await thunkApi.extra.getEffectiveVoiceForLanguage(languageCode);

			thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguage(effectiveVoiceForLanguage));

			if (typeof effectiveVoiceForLanguage === "string") {
				await thunkApi.dispatch(loadSelectedVoiceName(effectiveVoiceForLanguage));
			}
		} else {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const state: any = thunkApi.getState();

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const newSelectedVoiceName = state.shared.voices.voices.length > 0 ? state.shared.voices.voices[0]!.name : null;

			if (!newSelectedVoiceName) {
				throw new TypeError("newSelectedVoiceName");
			}

			await Promise.all([
				thunkApi.dispatch(setEffectiveVoiceNameForSelectedLanguage(null)),
				thunkApi.dispatch(loadSelectedVoiceName(newSelectedVoiceName)),
			]);
		}
	},
);

export const storeEffectiveVoiceNameForLanguage = createAsyncThunk<void, StoreEffectiveVoiceNameForLanguageArguments, IApiAsyncThunkConfig>(
	`${prefix}/storeEffectiveVoiceNameForLanguage`,
	async ({
		languageCode, voiceName,
	}, thunkApi) => {
		await thunkApi.extra.toggleLanguageVoiceOverrideName(languageCode, voiceName);
		await thunkApi.dispatch(loadEffectiveVoiceForLanguage(languageCode));
	},
);

export const speakState = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/speakState`,
	async (_, thunkApi) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const state: any = thunkApi.getState();

		// TODO: move to function and/or state?
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const readyToSpeak = typeof state?.voices?.sampleText === "string"
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		&& state.voices.sampleText.length > 0
							&& (
								(
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
									typeof state.voices.selectedLanguageCode === "string"
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
									&& state.voices.selectedLanguageCode.length > 0
								)
								|| (
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
									typeof state.voices.selectedVoiceName === "string"
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
									&& state.voices.selectedVoiceName.length > 0
								)
							)
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							&& !Number.isNaN(state.voices.rateForSelectedVoice)
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
							&& !Number.isNaN(state.voices.pitchForSelectedVoice);

		if (readyToSpeak) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const text = state.voices.sampleText;
			const voice = {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				lang: state.voices.selectedLanguageCode ?? null,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				name: state.voices.selectedVoiceName ?? null,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				pitch: state.voices.pitchForSelectedVoice,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				rate: state.voices.rateForSelectedVoice,
			};

			thunkApi.extra.debouncedSpeakTextInVoice(text, voice);
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
			})
			.addCase(loadSpeakLongTexts.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.speakLongTexts = action.payload;
			})
			.addCase(loadSampleText.fulfilled, (state, action) => {
				state.sampleText = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setEffectiveVoiceNameForSelectedLanguage: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.effectiveVoiceNameForSelectedLanguage = action.payload;
		},
		setPitchForSelectedVoice: (state: Draft<VoicesState>, action: PayloadAction<number>) => {
			state.pitchForSelectedVoice = action.payload;
		},
		setRateForSelectedVoice: (state: Draft<VoicesState>, action: PayloadAction<number>) => {
			state.rateForSelectedVoice = action.payload;
		},
		setSampleText: (state: Draft<VoicesState>, action: PayloadAction<string>) => {
			state.sampleText = action.payload;
		},
		setSelectedLanguageCode: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.selectedLanguageCode = action.payload;
		},
		setSelectedVoiceName: (state: Draft<VoicesState>, action: PayloadAction<string | null>) => {
			state.selectedVoiceName = action.payload;
		},
		setSpeakLongTexts: (state: Draft<VoicesState>, action: PayloadAction<boolean>) => {
			state.speakLongTexts = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setEffectiveVoiceNameForSelectedLanguage,
	setPitchForSelectedVoice,
	setRateForSelectedVoice,
	setSampleText,
	setSelectedLanguageCode,
	setSelectedVoiceName,
	setSpeakLongTexts,
} = voicesSlice.actions;
export default voicesSlice.reducer;
