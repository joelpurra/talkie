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

// eslint-disable-next-line import/default
import toolkit from "@reduxjs/toolkit";
import {
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";

import {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export type LanguagesState = {
	navigatorLanguage: string | null;
	navigatorLanguages: Readonly<string[]>;
	translatedLanguages: TalkieLocale[];
	translationLocale: TalkieLocale;
};

const initialState: LanguagesState = {
	navigatorLanguage: null,
	navigatorLanguages: [],
	translatedLanguages: [],
	translationLocale: "en",
};

const prefix = "languages";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadNavigatorLanguage = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadNavigatorLanguage`,
	// TODO: convert to synchronous action?
	async (_, {
		extra,
	}) => extra.getNavigatorLanguage(),
);

export const loadNavigatorLanguages = createAsyncThunk<Readonly<string[]>, void, IApiAsyncThunkConfig>(
	`${prefix}/loadNavigatorLanguages`,
	// TODO: convert to synchronous action?
	async (_, {
		extra,
	}) => extra.getNavigatorLanguages(),
);

export const loadTranslatedLanguages = createAsyncThunk<TalkieLocale[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadTranslatedLanguages`,
	async (_, {
		extra,
	}) => extra.getTranslatedLanguages(),
);

export const loadTranslationLocale = createAsyncThunk<TalkieLocale, void, IApiAsyncThunkConfig>(
	`${prefix}/loadTranslationLocale`,
	async (_, {
		extra,
	}) => extra.getTranslationLocale(),
);

export const languagesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadNavigatorLanguage.fulfilled, (state, action) => {
				state.navigatorLanguage = action.payload;
			})
			.addCase(loadNavigatorLanguages.fulfilled, (state, action) => {
				state.navigatorLanguages = action.payload as string[];
			})
			.addCase(loadTranslatedLanguages.fulfilled, (state, action) => {
				state.translatedLanguages = action.payload;
			})
			.addCase(loadTranslationLocale.fulfilled, (state, action) => {
				state.translationLocale = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = languagesSlice.actions;
export default languagesSlice.reducer;
