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

import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import {
	type BrowserTabId,
} from "@talkie/shared-interfaces/webext.mjs";
import {
	openExternalUrlInNewTab,
	openInternalUrlInNewTab,
} from "@talkie/split-environment-webextension/browser-specific/urls-coating.mjs";
import {
	type ReadonlyDeep,
} from "type-fest";

export default class UiManager {
	constructor(private readonly configuration: ReadonlyDeep<IConfiguration>) {}

	async openExternalUrlFromConfigurationInNewTab(id: string): Promise<BrowserTabId> {
		const url = await this.configuration.get(`urls.external.${id}`);

		if (typeof url !== "string") {
			throw new TypeError("Bad url for id: " + id);
		}

		const urlObject = new URL(url);

		return openExternalUrlInNewTab(urlObject);
	}

	async openInternalUrlFromConfigurationInNewTab(id: string): Promise<BrowserTabId> {
		const url = await this.configuration.get(`urls.internal.${id}`);

		if (typeof url !== "string") {
			throw new TypeError("Bad url for id: " + id);
		}

		return openInternalUrlInNewTab(url);
	}
}
