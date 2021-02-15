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

import * as actionTypes from "../constants/action-types-metadata";

/*eslint no-unused-vars: ["warn", { "args": "after-used" }] */

export const loadIsPremiumEdition = () =>
	async (dispatch, getState, api) => {
		const isPremiumEdition = await api.isPremiumEdition();

		await dispatch(setIsPremium(isPremiumEdition));
	};

export const storeIsPremiumEdition = (isPremiumEdition) =>
	async (dispatch, getState, api) => {
		await api.setIsPremiumEditionOption(isPremiumEdition);
		await dispatch(loadIsPremiumEdition());
	};

export const setIsPremium = (isPremiumEdition) => {
	return {
		isPremiumEdition,
		type: actionTypes.SET_IS_PREMIUM_EDITION,
	};
};

export const loadVersionName = () =>
	async (dispatch, getState, api) => {
		const versionName = await api.getVersionName();

		await dispatch(setVersionName(versionName));
	};

export const setVersionName = (versionName) => {
	return {
		type: actionTypes.SET_VERSION_NAME,
		versionName,
	};
};

export const loadVersionNumber = () =>
	async (dispatch, getState, api) => {
		const versionNumber = await api.getVersionNumber();

		await dispatch(setVersionNumber(versionNumber));
	};

export const setVersionNumber = (versionNumber) => {
	return {
		type: actionTypes.SET_VERSION_NUMBER,
		versionNumber,
	};
};

export const loadEditionType = () =>
	async (dispatch, getState, api) => {
		const editionType = await api.getEditionType();

		await dispatch(setEditionType(editionType));
	};

export const setEditionType = (editionType) => {
	return {
		editionType,
		type: actionTypes.SET_EDITION_TYPE,
	};
};

export const loadSystemType = () =>
	async (dispatch, getState, api) => {
		const systemType = await api.getSystemType();

		await dispatch(setSystemType(systemType));
	};

export const setSystemType = (systemType) => {
	return {
		systemType,
		type: actionTypes.SET_SYSTEM_TYPE,
	};
};

export const loadOsType = () =>
	async (dispatch, getState, api) => {
		const osType = await api.getOsType();

		await dispatch(setOsType(osType));
	};

export const setOsType = (osType) => {
	return {
		osType,
		type: actionTypes.SET_OS_TYPE,
	};
};
