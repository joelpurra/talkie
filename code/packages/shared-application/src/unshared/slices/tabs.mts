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
	createSlice,
} = toolkit;
import type {
	Draft,
	PayloadAction,
} from "@reduxjs/toolkit";

export interface TabsState {
	activeTabId: string | null;
}

const initialState: TabsState = {
	activeTabId: null,
};

const prefix = "tabs";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const tabsSlice = createSlice({
	initialState,
	name: prefix,
	reducers: {
		setActiveTabId: (state: Draft<TabsState>, action: PayloadAction<string>) => {
			state.activeTabId = action.payload;
		},
	},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

export const {
	setActiveTabId,
} = tabsSlice.actions;
export default tabsSlice.reducer;
