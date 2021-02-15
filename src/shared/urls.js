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
	getBackgroundPage,
} from "./tabs";

export const openUrlInNewTab = async (url) => {
	if (typeof url !== "string") {
		throw new TypeError(`Bad url: ${typeof url}`);
	}

	// NOTE: only https urls.
	if (!url.startsWith("https://")) {
		throw new Error(`Bad url, only https:// allowed: ${JSON.stringify(url)}`);
	}

	return browser.tabs.create({
		active: true,
		url,
	});
};

export const openInternalUrlInNewTab = async (url) => {
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

export const openUrlFromConfigurationInNewTab = async (id) => {
	const background = await getBackgroundPage();
	const url = await background.getConfigurationValue(`urls.${id}`);

	if (typeof url !== "string") {
		throw new TypeError("Bad url for id: " + id);
	}

	return openUrlInNewTab(url);
};

export const openInternalUrlFromConfigurationInNewTab = async (id) => {
	const background = await getBackgroundPage();
	const url = await background.getConfigurationValue(`urls.${id}`);

	if (typeof url !== "string") {
		throw new TypeError("Bad url for id: " + id);
	}

	return openInternalUrlInNewTab(url);
};

export const openShortKeysConfiguration = async () => {
	const url = "chrome://extensions/configureCommands";

	return browser.tabs.create({
		active: true,
		url,
	});
};

export const openOptionsPage = async () => browser.runtime.openOptionsPage();
