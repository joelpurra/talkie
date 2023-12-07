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
import toolkit from "@reduxjs/toolkit";
import {
	type IApiAsyncThunkConfig,
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
	speakingHistoryLimit: number;
	continueOnTabRemoved: boolean;
	continueOnTabUpdatedUrl: boolean;
}

const initialState: SettingsState = {
	continueOnTabRemoved: false,
	continueOnTabUpdatedUrl: false,
	showAdditionalDetails: false,
	speakLongTexts: false,
	speakingHistoryLimit: 0,
};

const prefix = "settings";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadShowAdditionalDetails = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadShowAdditionalDetails`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.configuration.getShowAdditionalDetails(),
);

export const storeShowAdditionalDetails = createAsyncThunk<boolean, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeShowAdditionalDetails`,
	async (
		showAdditionalDetails,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setShowAdditionalDetails(showAdditionalDetails);

		return showAdditionalDetails;
	},
);

export const loadSpeakLongTexts = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakLongTexts`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.configuration.getSpeakLongTexts(),
);

export const storeSpeakLongTexts = createAsyncThunk<boolean, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeSpeakLongTexts`,
	async (
		speakLongTexts,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setSpeakLongTexts(speakLongTexts);

		return speakLongTexts;
	},
);

export const loadSpeakingHistoryLimit = createAsyncThunk<number, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSpeakingHistoryLimit`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.configuration.getSpeakingHistoryLimit(),
);

export const storeSpeakingHistoryLimit = createAsyncThunk<number, number, IApiAsyncThunkConfig>(
	`${prefix}/storeSpeakingHistoryLimit`,
	async (
		speakingHistoryLimit,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setSpeakingHistoryLimit(speakingHistoryLimit);

		return speakingHistoryLimit;
	},
);

export const loadContinueOnTabRemoved = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadContinueOnTabRemoved`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.configuration.getContinueOnTabRemoved(),
);

export const storeContinueOnTabRemoved = createAsyncThunk<boolean, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeContinueOnTabRemoved`,
	async (
		continueOnTabRemoved,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setContinueOnTabRemoved(continueOnTabRemoved);

		return continueOnTabRemoved;
	},
);

export const loadContinueOnTabUpdatedUrl = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadContinueOnTabUpdatedUrl`,
	async (
		_,
		{
			extra,
		},
	) => extra.groundwork!.configuration.getContinueOnTabUpdatedUrl(),
);

export const storeContinueOnTabUpdatedUrl = createAsyncThunk<boolean, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeContinueOnTabUpdatedUrl`,
	async (
		continueOnTabUpdatedUrl,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl);

		return continueOnTabUpdatedUrl;
	},
);

export const settingsSlice = createSlice({
	extraReducers(builder) {
		// TODO: deduplicate this extra async "side-effect reducer" and the exposed sync reducer?
		builder
			.addCase(loadShowAdditionalDetails.fulfilled, (state, action) => {
				state.showAdditionalDetails = action.payload;
			})
			.addCase(loadSpeakLongTexts.fulfilled, (state, action) => {
				state.speakLongTexts = action.payload;
			})
			.addCase(loadSpeakingHistoryLimit.fulfilled, (state, action) => {
				state.speakingHistoryLimit = action.payload;
			})
			.addCase(loadContinueOnTabRemoved.fulfilled, (state, action) => {
				state.continueOnTabRemoved = action.payload;
			})
			.addCase(loadContinueOnTabUpdatedUrl.fulfilled, (state, action) => {
				state.continueOnTabUpdatedUrl = action.payload;
			})
			.addCase(storeShowAdditionalDetails.fulfilled, (state, action) => {
				state.showAdditionalDetails = action.payload;
			})
			.addCase(storeSpeakLongTexts.fulfilled, (state, action) => {
				state.speakLongTexts = action.payload;
			})
			.addCase(storeSpeakingHistoryLimit.fulfilled, (state, action) => {
				state.speakingHistoryLimit = action.payload;
			})
			.addCase(storeContinueOnTabRemoved.fulfilled, (state, action) => {
				state.continueOnTabRemoved = action.payload;
			})
			.addCase(storeContinueOnTabUpdatedUrl.fulfilled, (state, action) => {
				state.continueOnTabUpdatedUrl = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setContinueOnTabRemoved(state: Draft<SettingsState>, action: PayloadAction<boolean>) {
			state.continueOnTabRemoved = action.payload;
		},
		setContinueOnTabUpdatedUrl(state: Draft<SettingsState>, action: PayloadAction<boolean>) {
			state.continueOnTabUpdatedUrl = action.payload;
		},
		setShowAdditionalDetails(state: Draft<SettingsState>, action: PayloadAction<boolean>) {
			state.showAdditionalDetails = action.payload;
		},
		setSpeakLongTexts(state: Draft<SettingsState>, action: PayloadAction<boolean>) {
			state.speakLongTexts = action.payload;
		},
		setSpeakingHistoryLimit(state: Draft<SettingsState>, action: PayloadAction<number>) {
			state.speakingHistoryLimit = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setContinueOnTabRemoved,
	setContinueOnTabUpdatedUrl,
	setShowAdditionalDetails,
	setSpeakLongTexts,
	setSpeakingHistoryLimit,
} = settingsSlice.actions;

export default settingsSlice.reducer;
