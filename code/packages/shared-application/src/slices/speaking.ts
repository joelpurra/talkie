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
	PayloadAction,
} from "@reduxjs/toolkit";
import {
	IVoiceNameAndLanguageAndRateAndPitch,
	IVoiceNameAndLanguageOrNull,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";

import {
	IApiAsyncThunkConfig,
} from "./slices-types";

interface SpeakInVoiceArguments {
	text: string;
	voice: IVoiceNameAndLanguageOrNull | IVoiceNameAndLanguageAndRateAndPitch;
}

interface SpeakTextInLanguageWithOverridesArguments {
	text: string;
	languageCode: string;
}

export interface SpeakingState {
	isSpeaking: boolean;
}

const initialState: SpeakingState = {
	isSpeaking: false,
};

const prefix = "speaking";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const iconClick = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/iconClick`,
	async (_, thunkApi) => {
		await thunkApi.extra.iconClick();
	},
);

export const speakInVoice = createAsyncThunk<void, SpeakInVoiceArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakInVoice`,
	({
		voice,
		text,
	}, thunkApi) => {
		// NOTE: not currently returning a promise, although it probably should, so a thunk is not necessary.
		// TODO: rework debounced versions in api?
		thunkApi.extra.debouncedSpeakTextInVoice(text, voice);
	},
);

export const speakTextInLanguageWithOverrides = createAsyncThunk<void, SpeakTextInLanguageWithOverridesArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakTextInLanguageWithOverrides`,
	({
		languageCode,
		text,
	}, thunkApi) => {
		// NOTE: not currently returning a promise, although it probably should, so a thunk is not necessary.
		// TODO: rework debounced versions in api?
		thunkApi.extra.debouncedSpeakTextInLanguageWithOverrides(text, languageCode);
	},
);

export const speakingSlice = createSlice({
	initialState,
	name: prefix,
	reducers: {
		setIsSpeaking: (state, action: PayloadAction<boolean>) => {
			state.isSpeaking = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setIsSpeaking,
} = speakingSlice.actions;
export default speakingSlice.reducer;
