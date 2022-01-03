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
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

import {
	getTalkieServices,
} from "./tabs.mjs";

export const openExternalUrlInNewTab = async (url: ReadonlyDeep<URL>): Promise<Tabs.Tab> => {
	if (!(url instanceof URL)) {
		throw new TypeError(`Bad url: ${typeof url}`);
	}

	// NOTE: only https urls.
	if (url.protocol !== "https:") {
		throw new Error(`Bad url, only https:// allowed: ${JSON.stringify(url)}`);
	}

	const href = url.toString();

	return browser.tabs.create({
		active: true,
		url: href,
	});
};

export const openInternalUrlInNewTab = async (url: string): Promise<Tabs.Tab> => {
	if (typeof url !== "string") {
		throw new TypeError(`Bad url: ${typeof url}`);
	}

	// NOTE: only root-relative internal urls.
	// NOTE: double-slash is protocol relative, checking just in case.
	if (!url.startsWith("/") || url[1] === "/") {
		throw new Error(`Bad url, only internally rooted allowed: ${JSON.stringify(url)}`);
	}

	return browser.tabs.create({
		active: true,
		url,
	});
};

export const openExternalUrlFromConfigurationInNewTab = async (id: string): Promise<Tabs.Tab> => {
	const background = await getTalkieServices();
	const url = await background.getConfigurationValue(`urls.external.${id}`);

	if (typeof url !== "string") {
		throw new TypeError("Bad url for id: " + id);
	}

	const urlObject = new URL(url);

	return openExternalUrlInNewTab(urlObject);
};

export const openInternalUrlFromConfigurationInNewTab = async (id: string): Promise<Tabs.Tab> => {
	const talkieServices = await getTalkieServices();
	const url = await talkieServices.getConfigurationValue(`urls.internal.${id}`);

	if (typeof url !== "string") {
		throw new TypeError("Bad url for id: " + id);
	}

	return openInternalUrlInNewTab(url);
};

export const openShortKeysConfiguration = async (): Promise<Tabs.Tab> => {
	const url = "chrome://extensions/configureCommands";

	return browser.tabs.create({
		active: true,
		url,
	});
};

export const openOptionsPage = async (): Promise<void> => browser.runtime.openOptionsPage();
