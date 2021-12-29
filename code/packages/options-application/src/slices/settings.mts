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
	Draft,
	PayloadAction,
} from "@reduxjs/toolkit";
// eslint-disable-next-line import/default
import toolkit from "@reduxjs/toolkit";
import {
	IApiAsyncThunkConfig,
} from "@talkie/shared-ui/slices/slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface SettingsState {
	showAdditionalDetails: boolean;
	speakLongTexts: boolean;
}

const initialState: SettingsState = {
	showAdditionalDetails: false,
	speakLongTexts: false,
};

const prefix = "settings";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadShowAdditionalDetails = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadShowAdditionalDetails`,
	async (
		_, {
			extra,
		},
	) => extra.getShowAdditionalDetailsOption(),
);

export const storeShowAdditionalDetails = createAsyncThunk<void, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeShowAdditionalDetails`,
	async (
		showAdditionalDetails, {
			dispatch,
			extra,
		},
	) => {
		await extra.setShowAdditionalDetailsOption(showAdditionalDetails);
		dispatch(setShowAdditionalDetails(showAdditionalDetails));
	},
);

export const loadSpeakLongTexts = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakLongTexts`,
	async (
		_, {
			extra,
		},
	) => extra.getSpeakLongTextsOption(),
);

export const storeSpeakLongTexts = createAsyncThunk<void, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeSpeakLongTexts`,
	async (
		speakLongTexts, {
			dispatch,
			extra,
		},
	) => {
		await extra.setSpeakLongTextsOption(speakLongTexts);
		dispatch(setSpeakLongTexts(speakLongTexts));
	},
);

export const settingsSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadShowAdditionalDetails.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.showAdditionalDetails = action.payload;
			})
			.addCase(loadSpeakLongTexts.fulfilled, (state, action) => {
				// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
				state.speakLongTexts = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setShowAdditionalDetails: (state: Draft<SettingsState>, action: PayloadAction<boolean>) => {
			state.showAdditionalDetails = action.payload;
		},
		setSpeakLongTexts: (state: Draft<SettingsState>, action: PayloadAction<boolean>) => {
			state.speakLongTexts = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setShowAdditionalDetails,
	setSpeakLongTexts,
} = settingsSlice.actions;

export default settingsSlice.reducer;
