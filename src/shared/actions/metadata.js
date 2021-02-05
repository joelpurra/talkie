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
	(dispatch, getState, api) => api.isPremiumEdition()
		.then((isPremiumEdition) => dispatch(setIsPremium(isPremiumEdition)));

export const storeIsPremiumEdition = (isPremiumEdition) =>
	(dispatch, getState, api) => api.setIsPremiumEditionOption(isPremiumEdition)
		.then(() => dispatch(loadIsPremiumEdition()));

export const setIsPremium = (isPremiumEdition) => {
	return {
		type: actionTypes.SET_IS_PREMIUM_EDITION,
		isPremiumEdition,
	};
};

export const loadVersionName = () =>
	(dispatch, getState, api) => api.getVersionName()
		.then((versionName) => dispatch(setVersionName(versionName)));

export const setVersionName = (versionName) => {
	return {
		type: actionTypes.SET_VERSION_NAME,
		versionName,
	};
};

export const loadVersionNumber = () =>
	(dispatch, getState, api) => api.getVersionNumber()
		.then((versionNumber) => dispatch(setVersionNumber(versionNumber)));

export const setVersionNumber = (versionNumber) => {
	return {
		type: actionTypes.SET_VERSION_NUMBER,
		versionNumber,
	};
};

export const loadEditionType = () =>
	(dispatch, getState, api) => api.getEditionType()
		.then((editionType) => dispatch(setEditionType(editionType)));

export const setEditionType = (editionType) => {
	return {
		type: actionTypes.SET_EDITION_TYPE,
		editionType,
	};
};

export const loadSystemType = () =>
	(dispatch, getState, api) => api.getSystemType()
		.then((systemType) => dispatch(setSystemType(systemType)));

export const setSystemType = (systemType) => {
	return {
		type: actionTypes.SET_SYSTEM_TYPE,
		systemType,
	};
};

export const loadOsType = () =>
	(dispatch, getState, api) => api.getOsType()
		.then((osType) => dispatch(setOsType(osType)));

export const setOsType = (osType) => {
	return {
		type: actionTypes.SET_OS_TYPE,
		osType,
	};
};
