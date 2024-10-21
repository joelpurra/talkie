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

import {
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import type IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider.mjs";
import type IOffscreenDocumentProvider from "@talkie/split-environment-interfaces/ioffscreen-document-provider.mjs";
import type {
	Offscreen,
	Runtime,
} from "webextension-polyfill";

export default class ChromeOffscreenDocumentProvider implements IOffscreenDocumentProvider {
	private get _internalExtensionUrl(): string {
		// eslint-disable-next-line no-sync
		return this.internalUrlProvider.getSync(this.offscreenInternalHtmlPath);
	}

	// NOTE: hardcoded offscreen setup details due to the singleton nature of the offscreen document.
	// https://developer.chrome.com/docs/extensions/reference/api/offscreen
	// > Though an extension package can contain multiple offscreen documents, an installed extension can only have one open at a time.
	// > If the extension is running in split mode with an active incognito profile, the normal and incognito profiles can each have one offscreen document.
	private static get _justification(): string {
		return "Use the text-to-speech synthesizer, read text from clipboard, migrate localStorage.";
	}

	private static get _reasons(): Offscreen.Reasons[] {
		return [
			"AUDIO_PLAYBACK",
			"CLIPBOARD",
			"LOCAL_STORAGE",
		];
	}

	// NOTE: race conditions probably still exist, both between open/close actions and isOpen checks.
	// TODO: a closing promise?
	private _isOpeningPromise: Promise<void> | null = null;

	constructor(
		private readonly internalUrlProvider: IInternalUrlProvider,
		private readonly offscreenInternalHtmlPath: string,
	) {
		if (!this.offscreenInternalHtmlPath.startsWith("/")) {
			throw new Error("Must provide an absolute, internal URL.");
		}
	}

	public async isOpen(): Promise<boolean> {
		const matchingContexts: Runtime.ExtensionContext[] = await chrome.runtime.getContexts({
			contextTypes: [
				// HACK: mozilla firefox maintains the scheme files used to generate @types/webextension-polyfill typings and doesn't "know" about google chrome's offscreen documents.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				"OFFSCREEN_DOCUMENT" as any,
			],
			documentUrls: [
				this._internalExtensionUrl,
			],
		});

		// NOTE: only a single offscreen document is allowed at a time; match count should be either 0 or 1.
		if (!(matchingContexts.length === 0 || matchingContexts.length === 1)) {
			// TODO: throw error instead, since multiple offscreen documents is an unexpected use-case?
			void logWarn("Unexpected number of offscreen document matches; ignoring potential side-effects.", matchingContexts.length);
		}

		// NOTE: lenient check for the assumed singleton match.
		const isOpen = (matchingContexts.length > 0);

		return isOpen;
	}

	public async open(): Promise<void> {
		if (this._isOpeningPromise) {
			return this._isOpeningPromise;
		}

		try {
			this._isOpeningPromise = chrome.offscreen.createDocument({
				justification: ChromeOffscreenDocumentProvider._justification,
				reasons: ChromeOffscreenDocumentProvider._reasons,
				url: this._internalExtensionUrl,
			});

			await this._isOpeningPromise;
		} finally {
			this._isOpeningPromise = null;
		}
	}

	public async close(): Promise<void> {
		// NOTE: extra checks to avoid something else (rapidly) opening the offscreen document while (a)waiting the opening to finish.
		while (this._isOpeningPromise) {
			// TODO: closing right after opening might unexpectedly fail expected outcomes for other callers; implement timeouts (and thus error handling) for all offscreen calls?
			// eslint-disable-next-line no-await-in-loop
			await this._isOpeningPromise;
		}

		// NOTE: the offscreen document may (should?) "window.close()" when done, if there are no long-running tasks, and thus not need to be (force-)closed.
		// NOTE: only a single offscreen document is allowed, thus there is no path/url matching argument.
		await chrome.offscreen.closeDocument();
	}
}
