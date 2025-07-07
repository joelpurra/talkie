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
	IApiAsyncThunkConfig,
} from "@talkie/shared-ui/slices/slices-types.mjs";

import type {
	NavigationTabId,
} from "../components/navigation/nav-container-types.mjs";

import toolkit, {
	type PayloadAction,
} from "@reduxjs/toolkit";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";
import {
	getLocationHash,
	setLocationHash,
} from "@talkie/shared-ui/utils/navigator-location.mjs";

import {
	getLocationHashFromTabId,
	getTabIdFromLocationHash,
	isLocationHash,
	isTabId,
} from "../components/navigation/nav-helpers.mjs";

const {

	createAsyncThunk,

	createSlice,
} = toolkit;

export interface TabsState {
	// TODO: list known tabs.
	activeNavigationTabId: NavigationTabId | "fallback-tab";
	activeNavigationTabTitle: string | null;
}

const initialState: TabsState = {
	activeNavigationTabId: "fallback-tab",
	activeNavigationTabTitle: null,
};

const prefix = "tabs";

export const delayedLoadActiveNavigationTabIdFromLocationHash = createAsyncThunk<void, void, IApiAsyncThunkConfig>(
	`${prefix}/delayedLoadActiveNavigationTabIdFromLocationHash`,
	async (
		_,
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		{
			dispatch,
		},
	) => {
		// HACK: tiny delay before loading (and updating) the tabid/hash on first client-side page load, so that hydration of the pre-rendered page can finish.
		// TODO: loadActiveNavigationTabIdFromLocationHash() already used post-hydration client-side loading -- what's the underlying cause?
		// TODO: dynamic delay, based on client-side hydration/rendering?
		await promiseDelay(10);

		await dispatch(loadActiveNavigationTabIdFromLocationHash());
	},
);

export const loadActiveNavigationTabIdFromLocationHash = createAsyncThunk<NavigationTabId | "fallback-tab", void, IApiAsyncThunkConfig>(
	`${prefix}/loadActiveNavigationTabIdFromLocationHash`,
	async () => {
		const locationHash = await getLocationHash();

		if (isLocationHash(locationHash)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const activeNavigationTabId = getTabIdFromLocationHash(locationHash);

			return activeNavigationTabId;
		}

		return "fallback-tab";
	},
);

export const setActiveNavigationTabId = createAsyncThunk<string | "fallback-tab", NavigationTabId | null, IApiAsyncThunkConfig>(
	`${prefix}/setActiveNavigationTabId`,
	async (
		activeNavigationTabId,
	) => {
		if (isTabId(activeNavigationTabId)) {
			// NOTE: all available tab ids and location hashes must match, except for the leading "#".
			const locationHash = getLocationHashFromTabId(activeNavigationTabId);

			await setLocationHash(locationHash);

			return activeNavigationTabId;
		}

		// TODO: assertion/throw error?
		return "fallback-tab";
	},
);

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const tabsSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(loadActiveNavigationTabIdFromLocationHash.fulfilled, (state, action) => {
				state.activeNavigationTabId = action.payload;
			})
			.addCase(setActiveNavigationTabId.fulfilled, (state, action) => {
				state.activeNavigationTabId = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {
		setActiveNavigationTabTitle(state, action: PayloadAction<string | null>) {
			state.activeNavigationTabTitle = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setActiveNavigationTabTitle,
} = tabsSlice.actions;

export default tabsSlice.reducer;
