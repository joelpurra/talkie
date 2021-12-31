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

import PermissionsManager from "./permissions-manager.mjs";

export default class ClipboardManager {
	constructor(private readonly permissionsManager: PermissionsManager) {}

	private get copyPasteTargetElementId() {
		return "copy-paste-textarea";
	}

	async _getExistingTextareaOrNull(): Promise<Element | null> {
		const existingTextarea = document.querySelector(`#${this.copyPasteTargetElementId}`);

		return existingTextarea;
	}

	async _getExistingTextarea(): Promise<HTMLTextAreaElement> {
		await this._ensureIsInitialized();

		const existingTextarea = await this._getExistingTextareaOrNull() as HTMLTextAreaElement;

		return existingTextarea;
	}

	async _isInitialized(): Promise<boolean> {
		const existingTextarea = await this._getExistingTextareaOrNull();

		return existingTextarea !== null;
	}

	async _ensureIsInitialized(): Promise<void> {
		const isInitialized = await this._isInitialized();

		if (!isInitialized) {
			throw new Error("this.copyPasteTargetElementId did not exist.");
		}
	}

	async _ensureIsNotInitialized(): Promise<void> {
		const isInitialized = await this._isInitialized();

		if (isInitialized) {
			throw new Error("this.copyPasteTargetElementId exists.");
		}
	}

	async _injectBackgroundTextarea(): Promise<void> {
		await this._ensureIsNotInitialized();

		const textarea = document.createElement("textarea");
		textarea.id = this.copyPasteTargetElementId;
		document.body.append(textarea);
	}

	async _initializeIfNecessary(): Promise<void> {
		const isInitialized = await this._isInitialized();

		if (!isInitialized) {
			return this.initialize();
		}
	}

	async _removeBackgroundTextarea(): Promise<void> {
		const existingTextarea = await this._getExistingTextarea();

		existingTextarea.remove();
	}

	async initialize(): Promise<void> {
		void logDebug("Start", "ClipboardManager.initialize");

		await this._injectBackgroundTextarea();

		void logDebug("Done", "ClipboardManager.initialize");
	}

	async uninitialize(): Promise<void> {
		void logDebug("Start", "ClipboardManager.uninitialize");

		await this._removeBackgroundTextarea();

		void logDebug("Done", "ClipboardManager.uninitialize");
	}

	async _getTextFromClipboard(): Promise<string | null> {
		const textarea = await this._getExistingTextarea();

		textarea.value = "";
		textarea.focus();

		const success = document.execCommand("Paste");

		if (!success) {
			return null;
		}

		return textarea.value;
	}

	async getClipboardText(): Promise<string | null> {
		void logDebug("Start", "getClipboardText");

		await this._initializeIfNecessary();

		const text = await this.permissionsManager.useOptionalPermissions(
			[
				"clipboardRead",
			],
			[],
			(granted) => granted ? this._getTextFromClipboard() : null,
		);

		void logDebug("Done", "getClipboardText", text);

		return text;
	}
}
