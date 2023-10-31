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

import type {
	PayloadAction,
} from "@reduxjs/toolkit";
import toolkit from "@reduxjs/toolkit";
import {
	type IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";

import {
	type IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface SpeakInCustomVoiceArguments {
	text: string;
	voice: IVoiceNameAndRateAndPitch;
}

export interface SpeakTextInVoiceWithOverridesArguments {
	text: string;
	voiceName: string;
}

export interface SpeakTextInLanguageWithOverridesArguments {
	text: string;
	languageCode: string;
}

export interface SpeakingState {
	// TODO: split slice.
	history: SpeakingHistoryEntry[];
	isSpeaking: boolean;
	mostRecentHash: number | null;
	mostRecentLanguage: string | null;
	mostRecentPitch: number;
	mostRecentRate: number;
	mostRecentText: string | null;
	mostRecentVoiceName: string | null;
}

const initialState: SpeakingState = {
	history: [],
	isSpeaking: false,
	mostRecentHash: null,
	mostRecentLanguage: null,
	mostRecentPitch: 1,
	mostRecentRate: 1,
	mostRecentText: null,
	mostRecentVoiceName: null,
};

const prefix = "speaking";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const iconClick = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/iconClick`,
	async (_, {
		extra,
	}) => {
		// TODO: does not actually work the same as clicking the Talkie icon; replace with a toggle method for restarting the most recent text or stopping.
		await extra.iconClick();
	},
);

export const stopSpeaking = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/stopSpeaking`,
	async (_, {
		extra,
	}) => {
		await extra.stopSpeaking();
	},
);

export const speakInCustomVoice = createAsyncThunk<void, SpeakInCustomVoiceArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakInCustomVoice`,
	({
		voice,
		text,
	}, {
		extra,
	}) => {
		// NOTE: not currently returning a promise, although it probably should, so a thunk is not necessary.
		// TODO: rework debounced versions in api?
		extra.debouncedSpeakTextInCustomVoice(text, voice);
	},
);

export const speakTextInVoiceWithOverrides = createAsyncThunk<void, SpeakTextInVoiceWithOverridesArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakTextInVoiceWithOverrides`,
	({
		voiceName,
		text,
	}, {
		extra,
	}) => {
		// NOTE: not currently returning a promise, although it probably should, so a thunk is not necessary.
		// TODO: rework debounced versions in api?
		extra.debouncedSpeakTextInVoiceWithOverrides(text, voiceName);
	},
);

export const speakTextInLanguageWithOverrides = createAsyncThunk<void, SpeakTextInLanguageWithOverridesArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakTextInLanguageWithOverrides`,
	({
		languageCode,
		text,
	}, {
		extra,
	}) => {
		// NOTE: not currently returning a promise, although it probably should, so a thunk is not necessary.
		// TODO: rework debounced versions in api?
		extra.debouncedSpeakTextInLanguageWithOverrides(text, languageCode);
	},
);

export const loadSpeakingHistory = createAsyncThunk<SpeakingHistoryEntry[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakingHistory`,
	async (
		_,
		{
			extra,
		},
	) => extra.getSpeakingHistory(),
);

export const removeSpeakingHistoryEntry = createAsyncThunk<void, number, IApiAsyncThunkConfig>(
	`${prefix}/removeSpeakingHistoryEntry`,
	async (
		hash,
		{
			dispatch,
			extra,
		},
	) => {
		await extra.removeSpeakingHistoryEntry(hash);
		await dispatch(loadSpeakingHistory());
	},
);

export const clearSpeakingHistory = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/clearSpeakingHistory`,
	async (
		_,
		{
			dispatch,
			extra,
		},
	) => {
		await extra.clearSpeakingHistory();
		await dispatch(loadSpeakingHistory());
	},
);

export const loadMostRecentSpeakingEntry = createAsyncThunk<SpeakingHistoryEntry | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadMostRecentSpeakingEntry`,
	async (
		_,
		{
			dispatch,
			extra,
		},
	) => {
		const speakingHistoryEntry = await extra.getMostRecentSpeakingEntry();

		// TODO: systematic action thunk side-effects.
		dispatch(setMostRecentHash(speakingHistoryEntry?.hash ?? null));
		dispatch(setMostRecentText(speakingHistoryEntry?.text ?? null));
		dispatch(setMostRecentLanguage(speakingHistoryEntry?.language ?? null));
		dispatch(setMostRecentVoiceName(speakingHistoryEntry?.voiceName ?? null));

		return speakingHistoryEntry;
	},
);

export const storeMostRecentSpeakingEntry = createAsyncThunk<void, SpeakingHistoryEntry, IApiAsyncThunkConfig>(
	`${prefix}/storeMostRecentSpeakingEntry`,
	async (
		speakingHistoryEntry,
		{
			dispatch,
			extra,
		},
	) => {
		await extra.storeMostRecentSpeakingEntry(speakingHistoryEntry);

		// TODO: systematic action thunk side-effects.
		dispatch(setMostRecentText(speakingHistoryEntry.text));
		dispatch(setMostRecentLanguage(speakingHistoryEntry.language));
		dispatch(setMostRecentVoiceName(speakingHistoryEntry.voiceName));
	},
);

export const speakingSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(loadSpeakingHistory.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.history = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setIsSpeaking(state, action: PayloadAction<boolean>) {
			state.isSpeaking = action.payload;
		},
		setMostRecentHash(state, action: PayloadAction<number | null>) {
			state.mostRecentHash = action.payload;
		},
		setMostRecentLanguage(state, action: PayloadAction<string | null>) {
			state.mostRecentLanguage = action.payload;
		},
		setMostRecentPitch(state, action: PayloadAction<number>) {
			state.mostRecentPitch = action.payload;
		},
		setMostRecentRate(state, action: PayloadAction<number>) {
			state.mostRecentRate = action.payload;
		},
		setMostRecentText(state, action: PayloadAction<string | null>) {
			state.mostRecentText = action.payload;
		},
		setMostRecentVoiceName(state, action: PayloadAction<string | null>) {
			state.mostRecentVoiceName = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setIsSpeaking,
	setMostRecentHash,
	setMostRecentLanguage,
	setMostRecentPitch,
	setMostRecentRate,
	setMostRecentText,
	setMostRecentVoiceName,
} = speakingSlice.actions;

export default speakingSlice.reducer;
