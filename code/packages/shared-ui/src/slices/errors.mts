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
	Action,
	AsyncThunk,
} from "@reduxjs/toolkit";
// eslint-disable-next-line import/default
import toolkit from "@reduxjs/toolkit";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericAsyncThunk = AsyncThunk<any, any, any>;

// export type PendingAction = ReturnType<GenericAsyncThunk["pending"]>
export type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
// export type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>

export interface ErrorsState {
	collected: RejectedAction[];
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {
	collected: [],
} as ErrorsState;

const prefix = "errors";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const errorsSlice = createSlice({
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action: Action<string>): action is RejectedAction => action.type.endsWith("/rejected"),
				(state, action) => {
					state.collected.push(action);
				},
			);
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = errorsSlice.actions;
export default errorsSlice.reducer;
