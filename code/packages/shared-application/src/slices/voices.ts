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
} from "@reduxjs/toolkit";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";

import {
	IApiAsyncThunkConfig,
} from "./slices-types";
import {
	getNavigatorLanguage,
	getNavigatorLanguages,
} from "./voices-hack-functions";

export type VoicesState = {
	navigatorLanguage: string | null;
	navigatorLanguages: Readonly<string[]>;
	translatedLanguages: TalkieLocale[];
	voices: SafeVoiceObject[];
};

const initialState: VoicesState = {
	navigatorLanguage: null,
	navigatorLanguages: [],
	translatedLanguages: [],
	voices: [],
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadVoices = createAsyncThunk<SafeVoiceObject[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadVoices`,
	async (_, thunkApi) => thunkApi.extra.getVoices(),
);

export const loadNavigatorLanguage = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadNavigatorLanguage`,
	// TODO: convert to synchronous action?
	() => getNavigatorLanguage(),
);

export const loadNavigatorLanguages = createAsyncThunk<Readonly<string[]>, void, IApiAsyncThunkConfig>(
	`${prefix}/loadNavigatorLanguages`,
	// TODO: convert to synchronous action?
	() => getNavigatorLanguages(),
);

export const loadTranslatedLanguages = createAsyncThunk<TalkieLocale[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadTranslatedLanguages`,
	async (_, thunkApi) => thunkApi.extra.getTranslatedLanguages(),
);

export const voicesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadVoices.fulfilled, (state, action) => {
				state.voices = action.payload;
			})
			.addCase(loadNavigatorLanguage.fulfilled, (state, action) => {
				state.navigatorLanguage = action.payload;
			})
			.addCase(loadNavigatorLanguages.fulfilled, (state, action) => {
				state.navigatorLanguages = action.payload as string[];
			})
			.addCase(loadTranslatedLanguages.fulfilled, (state, action) => {
				state.translatedLanguages = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = voicesSlice.actions;
export default voicesSlice.reducer;
