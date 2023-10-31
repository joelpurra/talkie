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
	type IApiAsyncThunkConfig,
} from "@talkie/shared-ui/slices/slices-types.mjs";

import {
	type NavigationTabId,
} from "../components/navigation/nav-container-types.mjs";
import {
	getLocationHashFromTabId,
	getTabIdFromLocationHash,
	isLocationHash,
	isTabId,
} from "../components/navigation/nav-helpers.mjs";

const {
	// eslint-disable-next-line import/no-named-as-default-member
	createAsyncThunk,
	// eslint-disable-next-line import/no-named-as-default-member
	createSlice,
} = toolkit;

export interface TabsState {
	// TODO: list known tabs.

	activeTabId: NavigationTabId | "fallback-tab";
}

const initialState: TabsState = {
	activeTabId: "fallback-tab",
};

const prefix = "tabs";

export const loadActiveTabFromLocationHash = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/loadLocationHashAsActiveTab`,
	async (
		_,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		{
			dispatch,
			extra,
		},
	) => {
		const locationHash = await extra.getLocationHash();

		if (isLocationHash(locationHash)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const activeTabId = getTabIdFromLocationHash(locationHash);

			await dispatch(setActiveTabId(activeTabId));
		} else {
			await dispatch(setActiveTabId(null));
		}
	},
);

export const setActiveTabId = createAsyncThunk<string | "fallback-tab", NavigationTabId | null, IApiAsyncThunkConfig>(
	`${prefix}/setActiveTabId`,
	async (
		activeTabId,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		{
			extra,
		},
	) => {
		if (isTabId(activeTabId)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const locationHash = getLocationHashFromTabId(activeTabId);

			await extra.setLocationHash(locationHash);

			return activeTabId;
		}

		// TODO: assertion/throw error?
		return "fallback-tab";
	},
);

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const tabsSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(setActiveTabId.fulfilled, (state, action) => {
				state.activeTabId = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = tabsSlice.actions;
export default tabsSlice.reducer;
