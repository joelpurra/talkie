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

import type IApiCoatingBrowser from "@talkie/split-environment-interfaces/iapi/iapi-coating-browser.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	type BrowserTabId,
} from "@talkie/shared-interfaces/webext.mjs";

import {
	openExternalUrlInNewTab,
	openOptionsPage,
	openShortKeysConfiguration,
} from "../urls-coating.mjs";

export default class BrowserCoatingBrowser implements IApiCoatingBrowser {
	async openExternalUrlInNewTab(url: ReadonlyDeep<URL>): Promise<BrowserTabId> {
		return openExternalUrlInNewTab(url);
	}

	async openShortKeysConfiguration(): Promise<BrowserTabId> {
		return openShortKeysConfiguration();
	}

	async openOptionsPage(): Promise<void> {
		return openOptionsPage();
	}
}
