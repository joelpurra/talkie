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
	PayloadAction,
} from "@reduxjs/toolkit";
import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";

import type {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

import toolkit from "@reduxjs/toolkit";

const {

	createAsyncThunk,

	createSlice,
} = toolkit;

export interface HistoryState {
	// TODO: should pitch/rate be part of mostRecent and/or SpeakingHistoryEntry?
	mostRecent: Readonly<SpeakingHistoryEntry> | null;
	speakingHistory: readonly SpeakingHistoryEntry[];
}

const initialState: HistoryState = {
	mostRecent: null,
	speakingHistory: [],
};

const prefix = "history";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadSpeakingHistory = createAsyncThunk<readonly SpeakingHistoryEntry[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakingHistory`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.history.getSpeakingHistory(),
);

export const removeSpeakingHistoryEntry = createAsyncThunk<void, number, IApiAsyncThunkConfig>(
	`${prefix}/removeSpeakingHistoryEntry`,
	async (
		hash,
		{
			extra,
		},
	) => {
		await extra.groundwork!.history.removeSpeakingHistoryEntry(hash);
	},
);

export const clearSpeakingHistory = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/clearSpeakingHistory`,
	async (
		_,
		{
			extra,
		},
	) => {
		await extra.groundwork!.history.clearSpeakingHistory();
	},
);

export const loadMostRecentSpeakingEntry = createAsyncThunk<SpeakingHistoryEntry | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadMostRecentSpeakingEntry`,
	async (
		_,
		{
			extra,
		},
	) => {
		const mostRecentSpeakingEntry = await extra.groundwork!.history.getMostRecentSpeakingEntry();

		// TODO: store entire object in state, in stead of seaparate properties?
		return mostRecentSpeakingEntry;
	},
);

export const historySlice = createSlice({
	extraReducers(builder) {
		// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
		builder
			.addCase(loadSpeakingHistory.fulfilled, (state, action) => {
				state.speakingHistory = action.payload as SpeakingHistoryEntry[];
			})
			.addCase(loadMostRecentSpeakingEntry.fulfilled, (state, action) => {
				state.mostRecent = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setMostRecent(state, action: PayloadAction<Readonly<SpeakingHistoryEntry> | null>) {
			state.mostRecent = action.payload as SpeakingHistoryEntry | null;
		},
		setSpeakingHistory(state, action: PayloadAction<readonly SpeakingHistoryEntry[]>) {
			state.speakingHistory = action.payload as SpeakingHistoryEntry[];
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setMostRecent,
	setSpeakingHistory,
} = historySlice.actions;

export default historySlice.reducer;
