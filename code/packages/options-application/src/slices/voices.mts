/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
	Draft,
	PayloadAction,
} from "@reduxjs/toolkit";

import type {
	OptionsRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import {
	isLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	DefaultLanguageDirection,
	type LanguageTextDirection,
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import {
	type IApiAsyncThunkConfig,
} from "@talkie/shared-ui/slices/slices-types.mjs";

import {
	getAssertedSelectedVoiceName,
	getCanSpeakInSelectedVoiceName,
	getFirstLanguageForSelectedLanguageGroup,
	getFirstVoiceForSelectedLanguageCode,
	getHasSelectedLanguageGroup,
	getIsSelectedLanguageGroupTalkieLocale,
	getLanguageCountForSelectedLanguageGroup,
	getPitchForSelectedVoice,
	getRateForSelectedVoice,
	getSampleTextForLanguageGroup,
	getSelectedLanguageCode,
	getSelectedLanguageGroup,
	getSelectedVoiceName,
	getVoiceCountForSelectedLanguageCode,
} from "../selectors/voices.mjs";

const {

	createAsyncThunk,

	createSlice,
} = toolkit;

interface StoreEffectiveVoiceNameForLanguageArguments {
	languageCodeOrGroup: string;
	voiceName: string;
}

export interface VoicesState {
	// TODO: split slice to languages/language/dialects/dialect/voices/voice.
	effectiveVoiceNameForSelectedLanguageCode: string | null;
	effectiveVoiceNameForSelectedLanguageGroup: string | null;
	isSelectedLanguageGroupTalkieLocale: boolean;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	sampleTextForLanguageGroup: string | null;
	selectedLanguageCode: string | null;
	selectedLanguageGroup: string | null;
	selectedVoiceName: string | null;
	textDirectionForSelectedLanguageGroup: LanguageTextDirection;
}

const initialState: VoicesState = {
	effectiveVoiceNameForSelectedLanguageCode: null,
	effectiveVoiceNameForSelectedLanguageGroup: null,
	isSelectedLanguageGroupTalkieLocale: false,
	pitchForSelectedVoice: 1,
	rateForSelectedVoice: 1,
	sampleTextForLanguageGroup: null,
	selectedLanguageCode: null,
	selectedLanguageGroup: null,
	selectedVoiceName: null,
	textDirectionForSelectedLanguageGroup: DefaultLanguageDirection,
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadSelectedLanguageCode = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedLanguageCode`,
	async (
		languageCode,
		{
			dispatch,
			getState,
		},
	) => {
		{
			// TODO: separate slices to avoid having to repeatedly check/verify/validate state.
			// TODO: re-architecture to avoid getState() in action -- in particular when also directly/indirectly updating the state in the same call tree.
			const selectedLanguageGroup = getSelectedLanguageGroup(getState() as OptionsRootState);

			if (typeof selectedLanguageGroup === "string" && typeof languageCode === "string") {
				// TODO: better language group/code assertion/validation.
				if (languageCode.length === 0) {
					throw new RangeError("languageCode");
				}

				if (!languageCode.startsWith(selectedLanguageGroup)) {
					throw new Error("selectedLanguageGroup");
				}
			}
		}

		// TODO: return, instead of dispatch, the loaded value.
		dispatch(setSelectedLanguageCode(languageCode));

		// TODO: systematic action thunk side-effects.
		await dispatch(loadEffectiveVoiceForLanguageCode());

		// TODO: re-architecture to avoid getState() in action -- in particular when also directly/indirectly updating the state in the same call tree.
		const voiceCountForSelectedLanguageCode = getVoiceCountForSelectedLanguageCode(getState() as OptionsRootState);
		const voice = voiceCountForSelectedLanguageCode === 1
			? getFirstVoiceForSelectedLanguageCode(getState() as OptionsRootState)
			: null;
		const voiceName = voice?.name ?? null;

		await dispatch(loadSelectedVoiceName(voiceName));
	},
);

export const loadSelectedLanguageGroup = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedLanguageGroup`,
	async (
		languageGroup,
		{
			dispatch,
			getState,
		},
	) => {
		// TODO: return, instead of dispatch, the loaded value.
		dispatch(setSelectedLanguageGroup(languageGroup));

		// NOTE: dependent properties load from the selected language group in the state, instead of an argument, to avoid discrepancies.
		// TODO: systematic action thunk side-effects.
		// TODO: merge the results into a single object, as the result of this action?
		// TODO: create a slice for the selected language group, including all dependent properties?
		await dispatch(loadEffectiveVoiceForLanguageGroup());
		await dispatch(loadIsSelectedLanguageGroupTalkieLocale());
		await dispatch(loadTextDirectionForSelectedLanguageGroup());
		await dispatch(loadSampleTextForLanguageGroup());

		const hasSelectedLanguageGroup = getHasSelectedLanguageGroup(getState() as OptionsRootState);
		let languageCode = null;

		if (hasSelectedLanguageGroup) {
			const languageCountForSelectedLanguageGroup = getLanguageCountForSelectedLanguageGroup(getState() as OptionsRootState);

			languageCode = languageCountForSelectedLanguageGroup === 1
				? getFirstLanguageForSelectedLanguageGroup(getState() as OptionsRootState)
				: null;
		}

		await dispatch(loadSelectedLanguageCode(languageCode));
	},
);

export const loadIsSelectedLanguageGroupTalkieLocale = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadIsSelectedLanguageGroupTalkieLocale`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedLanguageGroup = getSelectedLanguageGroup(getState() as OptionsRootState);

		if (typeof selectedLanguageGroup !== "string") {
			return false;
		}

		return extra.coating!.talkieLocale.isTalkieLocale(selectedLanguageGroup);
	},
);

export const loadTextDirectionForSelectedLanguageGroup = createAsyncThunk<LanguageTextDirection, void, IApiAsyncThunkConfig>(
	`${prefix}/loadTextDirectionForSelectedLanguageGroup`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedLanguageGroup = getSelectedLanguageGroup(getState() as OptionsRootState);

		if (typeof selectedLanguageGroup !== "string") {
			return DefaultLanguageDirection;
		}

		const isTalkieLocale = await extra.coating!.talkieLocale.isTalkieLocale(selectedLanguageGroup);

		if (isTalkieLocale) {
			return extra.coating!.talkieLocale.getBidiDirection(selectedLanguageGroup as TalkieLocale);
		}

		return DefaultLanguageDirection;
	},
);

export const loadSelectedVoiceName = createAsyncThunk<void, string | null, IApiAsyncThunkConfig>(
	`${prefix}/loadSelectedVoiceName`,
	async (
		voiceName,
		{
			dispatch,
		},
	) => {
		// TODO: return, instead of dispatch, the loaded value.
		dispatch(setSelectedVoiceName(voiceName));

		// TODO: systematic action thunk side-effects.
		await Promise.all([
			dispatch(loadEffectiveRateForVoice()),
			dispatch(loadEffectivePitchForVoice()),
		]);
	},
);

export const loadEffectiveRateForVoice = createAsyncThunk<number, void, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveRateForVoice`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedVoiceName = getSelectedVoiceName(getState() as OptionsRootState);

		if (typeof selectedVoiceName === "string") {
			return extra.groundwork!.voices.getEffectiveRateForVoice(selectedVoiceName);
		}

		return initialState.rateForSelectedVoice;
	},
);

export const storeVoiceRateOverride = createAsyncThunk<number, number, IApiAsyncThunkConfig>(
	`${prefix}/storeVoiceRateOverride`,
	async (
		rate,
		{
			extra,
			getState,
		},
	) => {
		const assertedSelectedVoiceName = getAssertedSelectedVoiceName(getState() as OptionsRootState);

		await extra.groundwork!.voices.setVoiceRateOverride(assertedSelectedVoiceName, rate);

		return rate;
	},
);

export const loadEffectivePitchForVoice = createAsyncThunk<number, void, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectivePitchForVoice`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedVoiceName = getSelectedVoiceName(getState() as OptionsRootState);

		if (typeof selectedVoiceName === "string") {
			return extra.groundwork!.voices.getEffectivePitchForVoice(selectedVoiceName);
		}

		return initialState.pitchForSelectedVoice;
	},
);

export const storeVoicePitchOverride = createAsyncThunk<number, number, IApiAsyncThunkConfig>(
	`${prefix}/storeVoicePitchOverride`,
	async (
		pitch,
		{
			extra,
			getState,
		},
	) => {
		const assertedSelectedVoiceName = getAssertedSelectedVoiceName(getState() as OptionsRootState);

		await extra.groundwork!.voices.setVoicePitchOverride(assertedSelectedVoiceName, pitch);

		return pitch;
	},
);

export const loadEffectiveVoiceForLanguageCode = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveVoiceForLanguageCode`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedLanguageCode = getSelectedLanguageCode(getState() as OptionsRootState);

		if (typeof selectedLanguageCode === "string") {
			const effectiveVoiceForLanguage = await extra.groundwork!.voices.getEffectiveVoiceForLanguage(selectedLanguageCode);

			return effectiveVoiceForLanguage;
		}

		return null;
	},
);

export const loadEffectiveVoiceForLanguageGroup = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadEffectiveVoiceForLanguageGroup`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const selectedLanguageGroup = getSelectedLanguageGroup(getState() as OptionsRootState);

		if (typeof selectedLanguageGroup === "string") {
			const effectiveVoiceForLanguageGroup = await extra.groundwork!.voices.getEffectiveVoiceForLanguage(selectedLanguageGroup);

			return effectiveVoiceForLanguageGroup;
		}

		return null;
	},
);

export const storeEffectiveVoiceNameForLanguage = createAsyncThunk<void, StoreEffectiveVoiceNameForLanguageArguments, IApiAsyncThunkConfig>(
	`${prefix}/storeEffectiveVoiceNameForLanguage`,
	async (
		{
			languageCodeOrGroup,
			voiceName,
		}, {
			dispatch,
			extra,
		},
	) => {
		await extra.groundwork!.voices.toggleLanguageVoiceOverrideName(languageCodeOrGroup, voiceName);

		// HACK: duplicate function to set either language code or group?
		const loader = isLanguageGroup(languageCodeOrGroup)
			? loadEffectiveVoiceForLanguageGroup()
			: loadEffectiveVoiceForLanguageCode();

		await dispatch(loader);
	},
);

export const loadSampleTextForLanguageGroup = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSampleTextForLanguageGroup`,
	async (
		_,
		{
			getState,
			extra,
		},
	) => {
		const selectedLanguageGroup = getSelectedLanguageGroup(getState() as OptionsRootState);
		const isTalkieLocale = getIsSelectedLanguageGroupTalkieLocale(getState() as OptionsRootState);

		const sampleTextForLanguageGroup = isTalkieLocale
			? await extra.coating!.talkieLocale.getSampleText(selectedLanguageGroup as TalkieLocale)
			: null;

		return sampleTextForLanguageGroup;
	},
);

export const speakInSelectedVoiceNameState = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/speakInSelectedVoiceNameState`,
	async (
		_,
		{
			extra,
			getState,
		},
	) => {
		const canSpeakInSelectedVoiceName = getCanSpeakInSelectedVoiceName(getState() as OptionsRootState);

		if (canSpeakInSelectedVoiceName) {
			const selectedVoiceName = getAssertedSelectedVoiceName(getState() as OptionsRootState);
			const sampleTextForLanguageGroup = getSampleTextForLanguageGroup(getState() as OptionsRootState);
			const rateForSelectedVoice = getRateForSelectedVoice(getState() as OptionsRootState);
			const pitchForSelectedVoice = getPitchForSelectedVoice(getState() as OptionsRootState);

			const text = sampleTextForLanguageGroup!;
			const voice = {
				name: selectedVoiceName,
				pitch: pitchForSelectedVoice,
				rate: rateForSelectedVoice,
			};

			void extra.groundwork!.speaking.speakTextInCustomVoice(text, voice);
		}
	},
);

export const voicesSlice = createSlice({
	extraReducers(builder) {
		// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
		builder
			.addCase(loadIsSelectedLanguageGroupTalkieLocale.fulfilled, (state, action) => {
				state.isSelectedLanguageGroupTalkieLocale = action.payload;
			})
			.addCase(loadTextDirectionForSelectedLanguageGroup.fulfilled, (state, action) => {
				state.textDirectionForSelectedLanguageGroup = action.payload;
			})
			.addCase(loadEffectiveRateForVoice.fulfilled, (state, action) => {
				state.rateForSelectedVoice = action.payload;
			})
			.addCase(loadEffectivePitchForVoice.fulfilled, (state, action) => {
				state.pitchForSelectedVoice = action.payload;
			})
			.addCase(loadEffectiveVoiceForLanguageCode.fulfilled, (state, action) => {
				state.effectiveVoiceNameForSelectedLanguageCode = action.payload;
			})
			.addCase(loadEffectiveVoiceForLanguageGroup.fulfilled, (state, action) => {
				state.effectiveVoiceNameForSelectedLanguageGroup = action.payload;
			})
			.addCase(loadSampleTextForLanguageGroup.fulfilled, (state, action) => {
				state.sampleTextForLanguageGroup = action.payload;
			})
			.addCase(storeVoiceRateOverride.fulfilled, (state, action) => {
				state.rateForSelectedVoice = action.payload;
			})
			.addCase(storeVoicePitchOverride.fulfilled, (state, action) => {
				state.pitchForSelectedVoice = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setEffectiveVoiceNameForSelectedLanguage(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
			state.effectiveVoiceNameForSelectedLanguageCode = action.payload;
		},
		setEffectiveVoiceNameForSelectedLanguageGroup(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
			state.effectiveVoiceNameForSelectedLanguageGroup = action.payload;
		},
		setPitchForSelectedVoice(state: Draft<VoicesState>, action: PayloadAction<number>) {
			state.pitchForSelectedVoice = action.payload;
		},
		setRateForSelectedVoice(state: Draft<VoicesState>, action: PayloadAction<number>) {
			state.rateForSelectedVoice = action.payload;
		},
		setSampleTextForLanguageGroup(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
			state.sampleTextForLanguageGroup = action.payload;
		},
		setSelectedLanguageCode(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
			state.selectedLanguageCode = action.payload;
		},
		setSelectedLanguageGroup(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
			state.selectedLanguageGroup = action.payload;
		},
		setSelectedVoiceName(state: Draft<VoicesState>, action: PayloadAction<string | null>) {
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
