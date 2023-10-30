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

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface ProgressState {
	current: number;
	max: number;
	min: number;
}

const initialState: ProgressState = {
	current: 0,
	max: 0,
	min: 0,
};

const prefix = "progress";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const progressSlice = createSlice({
	initialState,
	name: prefix,
	reducers: {
		setCurrent(state: Draft<ProgressState>, action: PayloadAction<number>) {
			state.current = action.payload;
		},
		setMax(state: Draft<ProgressState>, action: PayloadAction<number>) {
			state.max = action.payload;
		},
		setMin(state: Draft<ProgressState>, action: PayloadAction<number>) {
			state.min = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setCurrent,
	setMax,
	setMin,
} = progressSlice.actions;
export default progressSlice.reducer;

