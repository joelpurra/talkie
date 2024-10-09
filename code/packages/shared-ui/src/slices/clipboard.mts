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

import toolkit from "@reduxjs/toolkit";

import type {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface ClipboardState {
	clipboardText: string | null | undefined;
	hasClipboardReadPermission: boolean | null;
}

const initialState: ClipboardState = {
	clipboardText: undefined,
	hasClipboardReadPermission: null,
};

const prefix = "clipboard";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadHasClipboardReadPermission = createAsyncThunk<boolean | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadHasClipboardReadPermission`,
	async (_, {
		extra,
	}) => extra.coating!.clipboard!.hasClipboardReadPermission(),
);

export const askClipboardReadPermission = createAsyncThunk<boolean | null, void, IApiAsyncThunkConfig>(
	`${prefix}/askClipboardReadPermission`,
	async (_, {
		extra,
	}) => extra.coating!.clipboard!.askClipboardReadPermission(),
);

export const denyClipboardReadPermission = createAsyncThunk<boolean | null, void, IApiAsyncThunkConfig>(
	`${prefix}/denyClipboardReadPermission`,
	async (_, {
		extra,
	}) =>
		// NOTE: this success flag is potential source of confusion.
		extra.coating!.clipboard!.denyClipboardReadPermission(),
);

export const readFromClipboard = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/readFromClipboard`,
	async (_, {
		extra,
	}) => extra.groundwork!.clipboard.readFromClipboard(),
);

export const speakFromClipboard = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/speakFromClipboard`,
	(_, {
		extra,
	}) => {
		void extra.groundwork!.clipboard.speakFromClipboard();
	},
);

export const clipboardSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(loadHasClipboardReadPermission.fulfilled, (state, action) => {
				state.hasClipboardReadPermission = action.payload;
			})
			.addCase(askClipboardReadPermission.fulfilled, (state, action) => {
				state.hasClipboardReadPermission = action.payload;
			})
			.addCase(denyClipboardReadPermission.fulfilled, (state, action) => {
				// NOTE: this success flag is potential source of confusion.
				state.hasClipboardReadPermission = action.payload === false;
			})
			.addCase(readFromClipboard.fulfilled, (state, action) => {
				// NOTE: this success flag is potential source of confusion.
				state.clipboardText = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = clipboardSlice.actions;
export default clipboardSlice.reducer;
