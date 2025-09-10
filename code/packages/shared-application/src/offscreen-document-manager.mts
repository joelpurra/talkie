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

import type IOffscreenDocumentProvider from "@talkie/split-environment-interfaces/ioffscreen-document-provider.mjs";

export default class OffscreenDocumentManager {
	public static get internalHtmlPath(): string {
		// TODO: move to configuration, perhaps split between chrome/webextension if useful?
		return "/packages/browser-offscreen/src/offscreen.html";
	}

	public static get identifier(): string {
		// TODO: move to configuration, perhaps split between chrome/webextension if useful?
		return "offscreen";
	}

	constructor(private readonly offscreenDocumentProvider: IOffscreenDocumentProvider) {
		// NOTE: the offscreen document is a singleton.
		// https://developer.chrome.com/docs/extensions/reference/api/offscreen
		// > Though an extension package can contain multiple offscreen documents, an installed extension can only have one open at a time.
		// > If the extension is running in split mode with an active incognito profile, the normal and incognito profiles can each have one offscreen document.
	}

	async ensureOpen(): Promise<void> {
		const isOpen = await this.offscreenDocumentProvider.isOpen();

		if (isOpen) {
			return;
		}

		return this.offscreenDocumentProvider.open();
	}

	async ensureClosed(): Promise<void> {
		const isOpen = await this.offscreenDocumentProvider.isOpen();

		if (!isOpen) {
			return;
		}

		return this.offscreenDocumentProvider.close();
	}
}
