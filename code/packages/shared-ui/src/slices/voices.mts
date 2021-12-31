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
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";

import {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export type VoicesState = {
	voices: SafeVoiceObject[];
};

const initialState: VoicesState = {
	voices: [],
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadVoices = createAsyncThunk<SafeVoiceObject[], void, IApiAsyncThunkConfig>(
	`${prefix}/loadVoices`,
	async (_, {
		extra,
	}) => extra.getVoices(),
);

export const voicesSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addCase(loadVoices.fulfilled, (state, action) => {
				state.voices = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = voicesSlice.actions;
export default voicesSlice.reducer;
