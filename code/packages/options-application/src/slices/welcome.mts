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

import toolkit from "@reduxjs/toolkit";
const {
	createAsyncThunk,
	createSlice,
} = toolkit;
import {
	IApiAsyncThunkConfig,
} from "@talkie/shared-ui/slices/slices-types.mjs";
import { TalkieLocale } from "@talkie/shared-interfaces/italkie-locale.mjs";
import { OptionsRootState } from "../store/index.mjs";
import {getAvailableBrowserLanguageWithInstalledVoice} from "@talkie/shared-ui/selectors/voices.mjs";

export interface VoicesState {
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
}

interface SampleTextAndLanguage {
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
}

const initialState: VoicesState = {
	sampleText: null,
	sampleTextLanguage: null,
};

const prefix = "welcome";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadSampleTextForAvailableBrowserLanguageWithInstalledVoice = createAsyncThunk<SampleTextAndLanguage, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSampleTextForAvailableBrowserLanguageWithInstalledVoice`,
	async (_, {getState,extra}) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const availableBrowserLanguageWithInstalledVoice = getAvailableBrowserLanguageWithInstalledVoice(getState() as OptionsRootState);

		let sampleTextLanguage: TalkieLocale | null = null;

		for (const languageCode of availableBrowserLanguageWithInstalledVoice){
			// TODO: isTalkieLocale assertion.
			const isTalkieLocale = await extra.isTalkieLocale(languageCode);

			if (isTalkieLocale) {
				sampleTextLanguage = languageCode as TalkieLocale;
				break;
			}
		}

		const sampleText = typeof sampleTextLanguage === "string"
			? await extra.getSampleText(sampleTextLanguage)
			: null;

		return {
			sampleText,
			sampleTextLanguage,
		};
	},
);

export const voicesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadSampleTextForAvailableBrowserLanguageWithInstalledVoice.fulfilled, (state, action) => {
				state.sampleText = action.payload.sampleText;
				state.sampleTextLanguage = action.payload.sampleTextLanguage;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = voicesSlice.actions;
export default voicesSlice.reducer;
