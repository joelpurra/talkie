/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";

import type {
	IApiAsyncThunkConfig,
} from "./slices-types.mjs";

import toolkit from "@reduxjs/toolkit";

const {

	createAsyncThunk,

	createSlice,
} = toolkit;

export interface MetadataState {
	isPremiumEdition: boolean;
	osType: OsType | null;
	systemType: SystemType | null;
	versionName: string | null;
	versionNumber: string | null;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {
	isPremiumEdition: false,
	osType: null,
	systemType: null,
	versionName: null,
	versionNumber: null,
} as MetadataState;

const prefix = "metadata";

/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

export const loadIsPremiumEdition = createAsyncThunk<boolean, void, IApiAsyncThunkConfig>(
	`${prefix}/loadIsPremiumEdition`,
	async (_, {
		extra,
	}) =>
		// TODO: avoid multi-level fallbacks.
		extra.groundwork?.configuration.getIsPremiumEdition()
		?? extra.coating?.premium?.isPremiumEdition()
		?? false,
);

export const storeIsPremiumEdition = createAsyncThunk<boolean, boolean, IApiAsyncThunkConfig>(
	`${prefix}/storeIsPremiumEdition`,
	async (
		isPremiumEdition,
		{
			extra,
		},
	) => {
		await extra.groundwork!.configuration.setIsPremiumEdition(isPremiumEdition);

		// TODO: reconsider post-store "side-effect" here?
		return isPremiumEdition;
	},
);

export const loadVersionName = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadVersionName`,
	async (_, {
		extra,
	}) => extra.coating!.metadata.getVersionName(),
);

export const loadVersionNumber = createAsyncThunk<string | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadVersionNumber`,
	async (_, {
		extra,
	}) => extra.coating!.metadata.getVersionNumber(),
);

export const loadSystemType = createAsyncThunk<SystemType | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadSystemType`,
	async (_, {
		extra,
	}) => extra.coating!.metadata.getSystemType(),
);

export const loadOsType = createAsyncThunk<OsType | null, void, IApiAsyncThunkConfig>(
	`${prefix}/loadOsType`,
	async (_, {
		extra,
	}) => extra.coating!.metadata.getOperatingSystemType(),
);

export const metadataSlice = createSlice({
	extraReducers(builder) {
		builder
			.addCase(loadIsPremiumEdition.fulfilled, (state, action) => {
				state.isPremiumEdition = action.payload;
			})
			.addCase(storeIsPremiumEdition.fulfilled, (state, action) => {
				state.isPremiumEdition = action.payload;
			})
			.addCase(loadVersionName.fulfilled, (state, action) => {
				state.versionName = action.payload;
			})
			.addCase(loadVersionNumber.fulfilled, (state, action) => {
				state.versionNumber = action.payload;
			})
			.addCase(loadSystemType.fulfilled, (state, action) => {
				state.systemType = action.payload;
			})
			.addCase(loadOsType.fulfilled, (state, action) => {
				state.osType = action.payload;
			});
	},
	initialState,
	name: prefix,
	reducers: {},
});

/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

// export const {} = metadataSlice.actions;
export default metadataSlice.reducer;
