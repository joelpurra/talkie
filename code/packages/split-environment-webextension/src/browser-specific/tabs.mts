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
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import type IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

import {
	type ITalkieServices,
} from "./italkie-services.mjs";

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

export const getTalkieServices = async (): Promise<ITalkieServices> => {
	const backgroundPage = await browser.runtime.getBackgroundPage();

	// https://developer.chrome.com/extensions/runtime.html#method-getBackgroundPage
	if (backgroundPage) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const talkieServices = (backgroundPage as any).talkieServices as ITalkieServices;

		return talkieServices;
	}

	throw new Error("Could not retrieve the background page.");
};

export const getCurrentActiveTab = async (): Promise<Tabs.Tab | null> => {
	const queryOptions = {
		active: true,
		currentWindow: true,
	};

	// https://developer.chrome.com/extensions/tabs#method-query
	const tabs = await browser.tabs.query(queryOptions);

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

export const getCurrentActiveTabId = async (): Promise<number | null> => {
	const activeTab = await getCurrentActiveTab();

	if (activeTab?.id) {
		return activeTab.id;
	}

	// NOTE: some tabs can't be retrieved.
	return null;
};

export const isCurrentPageInternalToTalkie = async (internalUrlProvider: ReadonlyDeep<IInternalUrlProvider>): Promise<boolean> => {
	const tab = await getCurrentActiveTab();

	if (tab) {
		const {
			url,
		} = tab;

		if (
			typeof url === "string"
					&& (
						// eslint-disable-next-line no-sync
						url.startsWith(internalUrlProvider.getSync("/packages/"))
					)
		) {
			return true;
		}

		return false;
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

	// https://developer.chrome.com/extensions/tabs#method-query
	const tabs = await browser.tabs.query(queryOptions);

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
