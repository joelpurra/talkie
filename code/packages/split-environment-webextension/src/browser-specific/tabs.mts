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

import type IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";

// NOTE: whitelisting schemes.
// TODO: can the list be extended?
const whitelistedUrlShemes = [
	"http://",
	"https://",
	"ftp://",
	"file:",
];

// NOTE: blacklisting known (per-browser store) urls.
// TODO: should the list be extended?
// TODO: move to configuration.
const blacklistedBaseUrls = [
	"https://chrome.google.com/",
	"https://addons.mozilla.org/",
];

export const getCurrentActiveBrowserTab = async (): Promise<Tabs.Tab | null> => {
	const queryOptions = {
		active: true,
		currentWindow: true,
	};

	// https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
	const tabs = await chrome.tabs.query(queryOptions);

	if (!tabs) {
		return null;
	}

	const singleTabResult = tabs.length === 1;

	const tab = tabs[0] ?? null;

	void logDebug("getCurrentActiveTab", tabs, tab, singleTabResult);

	if (singleTabResult) {
		return tab;
	}

	return null;
};

export const getCurrentActiveBrowserTabId = async (): Promise<number | null> => {
	const activeBrowserTab = await getCurrentActiveBrowserTab();

	if (typeof activeBrowserTab?.id === "number") {
		return activeBrowserTab.id;
	}

	// NOTE: some tabs can't be retrieved.
	return null;
};

export const isUrlInternalToTalkie = async (internalUrlProvider: ReadonlyDeep<IInternalUrlProvider>, url: string): Promise<boolean> => {
	const internalPackagesUrl = await internalUrlProvider.get("/packages/");
	const isInternal = url.startsWith(internalPackagesUrl);

	return isInternal;
};

export const isCurrentPageInternalToTalkie = async (internalUrlProvider: ReadonlyDeep<IInternalUrlProvider>): Promise<boolean> => {
	const activeBrowserTab = await getCurrentActiveBrowserTab();

	if (activeBrowserTab) {
		const {
			url,
		} = activeBrowserTab;

		if (typeof url === "string") {
			return isUrlInternalToTalkie(internalUrlProvider, url);
		}
	}

	return false;
};

const getCurrentActiveNormalLoadedTab = async (): Promise<Tabs.Tab | null> => {
	const queryOptions: Tabs.QueryQueryInfoType = {
		active: true,
		currentWindow: true,
		status: "complete",
		windowType: "normal",
	};

	// https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
	const tabs = await chrome.tabs.query(queryOptions);

	const singleTabResult = tabs.length === 1;

	const tab = tabs[0] ?? null;

	void logDebug("getCurrentActiveNormalLoadedTab", tabs, tab, singleTabResult);

	if (singleTabResult) {
		return tab;
	}

	return null;
};

export const canTalkieRunInTab = async (): Promise<boolean> => {
	const tab = await getCurrentActiveNormalLoadedTab();

	if (tab) {
		const {
			url,
		} = tab;

		if (typeof url === "string") {
			const canRunInUrl
				= whitelistedUrlShemes.some((scheme) => url.startsWith(scheme))
					&& !blacklistedBaseUrls.some((baseUrl) => url.startsWith(baseUrl));

			if (canRunInUrl) {
				return true;
			}

			return false;
		}

		return false;
	}

	return false;
};
