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
import {
	type SafeVoiceObjects,
} from "@talkie/shared-interfaces/ivoices.mjs";

import {
	type IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface VoicesState {
	voices: SafeVoiceObjects;
}

const initialState: VoicesState = {
	voices: [],
};

const prefix = "voices";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadVoices = createAsyncThunk<SafeVoiceObjects, void, IApiAsyncThunkConfig>(
	`${prefix}/loadVoices`,
	async (_, {
		extra,
	}) => extra.getVoices(),
);

export const voicesSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(loadVoices.fulfilled, (state, action) => {
				// TODO: remove "any" when it does not trigger error TS2589: Type instantiation is excessively deep and possibly infinite.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
				state.voices = action.payload as any;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = voicesSlice.actions;
export default voicesSlice.reducer;
