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

import {
	LocationHash,
	TabId,
} from "./nav-container-types.mjs";

export const isTabId = (tabId: string | null): tabId is TabId => typeof tabId === "string"
		&& tabId.length > 0
		&& tabId.split("#").length === 1;

export const isLocationHash = (locationHash: string | null): locationHash is LocationHash => typeof locationHash === "string"
		&& locationHash.length > 1
		&& locationHash.startsWith("#")
		&& locationHash.split("#").length === 2;

export const getTabIdFromLocationHash = (locationHash: LocationHash): TabId => {
	if (!isLocationHash(locationHash)) {
		// TODO: assertions.
		throw new TypeError("locationHash");
	}

	const tabId = locationHash.replace(/^#/, "");

	if (!isTabId(tabId)) {
		// TODO: assertions.
		throw new TypeError("tabId");
	}

	return tabId;
};

export const getLocationHashFromTabId = (tabId: TabId): LocationHash => {
	if (!isTabId(tabId)) {
		// TODO: assertions.
		throw new TypeError("tabId");
	}

	const locationHash = `#${tabId}`;

	if (!isLocationHash(locationHash)) {
		// TODO: assertions.
		throw new TypeError("locationHash");
	}

	return locationHash;
};
