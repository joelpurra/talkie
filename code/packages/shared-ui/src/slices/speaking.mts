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
	PayloadAction,
} from "@reduxjs/toolkit";
import toolkit from "@reduxjs/toolkit";
import type {
	IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";

import type {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import-x/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import-x/no-named-as-default-member
	createSlice,
} = toolkit;

export interface SpeakTextInCustomVoiceArguments {
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
	isSpeaking: boolean;
}

const initialState: SpeakingState = {
	isSpeaking: false,
};

const prefix = "speaking";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const iconClick = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/iconClick`,
	async (_, {
		extra,
	}) => {
		// TODO: does not actually work the same as clicking the Talkie icon; replace with a toggle method for restarting the most recent text or stopping.
		await extra.groundwork!.ui.iconClick();
	},
);

export const stopSpeaking = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/stopSpeaking`,
	async (_, {
		extra,
	}) => {
		await extra.groundwork!.speaking.stopSpeaking();
	},
);

export const speakTextInCustomVoice = createAsyncThunk<void, SpeakTextInCustomVoiceArguments, IApiAsyncThunkConfig>(
	`${prefix}/speakTextInCustomVoice`,
	({
		voice,
		text,
	}, {
		extra,
	}) => {
		void extra.groundwork!.speaking.speakTextInCustomVoice(text, voice);
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
		void extra.groundwork!.speaking.speakTextInVoiceWithOverrides(text, voiceName);
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
		void extra.groundwork!.speaking.speakTextInLanguageWithOverrides(text, languageCode);
	},
);

export const speakingSlice = createSlice({
	initialState,
	name: prefix,
	reducers: {
		setIsSpeaking(state, action: PayloadAction<boolean>) {
			state.isSpeaking = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setIsSpeaking,
} = speakingSlice.actions;

export default speakingSlice.reducer;
