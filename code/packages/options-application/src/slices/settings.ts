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

export interface VoicesState {
	speakLongTexts: boolean;
}

const initialState: VoicesState = {
	speakLongTexts: false,
};

const prefix = "settings";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

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

export const voicesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadSpeakLongTexts.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.speakLongTexts = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setSpeakLongTexts: (state: Draft<VoicesState>, action: PayloadAction<boolean>) => {
			state.speakLongTexts = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setSpeakLongTexts,
} = voicesSlice.actions;
export default voicesSlice.reducer;
