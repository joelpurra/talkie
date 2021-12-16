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
import { IApiAsyncThunkConfig } from "@talkie/shared-ui/slices/slices-types.mjs";

export interface TabsState {
	activeTabId: string | null;
}

const initialState: TabsState = {
	activeTabId: null,
};

const prefix = "tabs";

// TODO: move/reuse helpers.
const isTabId = (tabId: string | null): tabId is string => {
	return typeof tabId === "string"
		&& tabId.length > 0
		&& tabId.split("#").length === 1;
};

// TODO: move/reuse helpers.
const isLocationHash = (locationHash: string | null): locationHash is string => {
	return typeof locationHash === "string"
		&& locationHash.length > 1
		&& locationHash.startsWith("#")
		&& locationHash.split("#").length === 2;
};

export const loadActiveTabFromLocationHash = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/loadLocationHashAsActiveTab`,
	async (_, {dispatch, extra}) => {
		const locationHash = await extra.getLocationHash();

		if (isLocationHash(locationHash)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const activeTabId = locationHash.replace(/^#/, "");

			await dispatch(setActiveTabId(activeTabId));
		} else {
			await dispatch(setActiveTabId(null));
		}

	},
);

export const setActiveTabId = createAsyncThunk<string | null, string | null, IApiAsyncThunkConfig>(
	`${prefix}/setActiveTabId`,
	async (activeTabId, {extra}) => {
		if (isTabId(activeTabId)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const locationHash = `#${activeTabId}`;

			await extra.setLocationHash(locationHash);

			return activeTabId;
		}

		// TODO: assertion/throw error?
		return null;
	},
);

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const tabsSlice = createSlice({
	initialState,
	extraReducers: (builder) => {
		builder
			.addCase(setActiveTabId.fulfilled, (state, action) => {
				state.activeTabId = action.payload;
			});
	},
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = tabsSlice.actions;
export default tabsSlice.reducer;
