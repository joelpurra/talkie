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
} from "../shared/log";

export default class ClipboardManager {
	constructor(talkieBackground, permissionsManager) {
		this.talkieBackground = talkieBackground;
		this.permissionsManager = permissionsManager;

		this.copyPasteTargetElementId = "copy-paste-textarea";
	}

	async _getExistingTextarea() {
		const existingTextarea = document.querySelector(`#${this.copyPasteTargetElementId}`);

		return existingTextarea;
	}

	async _isInitialized() {
		const existingTextarea = await this._getExistingTextarea();

		return existingTextarea !== null;
	}

	async _ensureIsInitialized() {
		const isInitialized = await this._isInitialized();

		if (!isInitialized) {
			throw new Error("this.copyPasteTargetElementId did not exist.");
		}
	}

	async _ensureIsNotInitialized() {
		const isInitialized = await this._isInitialized();

		if (isInitialized) {
			throw new Error("this.copyPasteTargetElementId exists.");
		}
	}

	async _injectBackgroundTextarea() {
		await this._ensureIsNotInitialized();

		const textarea = document.createElement("textarea");
		textarea.id = this.copyPasteTargetElementId;
		document.body.append(textarea);
	}

	async _initializeIfNecessary() {
		const isInitialized = await this._isInitialized();

		if (isInitialized !== true) {
			return this.initialize();
		}
	}

	async _removeBackgroundTextarea() {
		await this._ensureIsInitialized();

		const existingTextarea = await this._getExistingTextarea();

		existingTextarea.remove();
	}

	async initialize() {
		logDebug("Start", "ClipboardManager.initialize");

		await this._injectBackgroundTextarea();

		logDebug("Done", "ClipboardManager.initialize");
	}

	async uninitialize() {
		logDebug("Start", "ClipboardManager.uninitialize");

		await this._removeBackgroundTextarea();

		logDebug("Done", "ClipboardManager.uninitialize");
	}

	async _getTextFromClipboard() {
		const textarea = await this._getExistingTextarea();

		textarea.value = "";
		textarea.focus();

		const success = document.execCommand("Paste");

		if (!success) {
			return null;
		}

		return textarea.value;
	}

	async getClipboardText() {
		logDebug("Start", "getClipboardText");

		await this._initializeIfNecessary();

		const text = await this.permissionsManager.useOptionalPermissions(
			[
				"clipboardRead",
			],
			[],
			(granted) => granted ? this._getTextFromClipboard(granted) : null,
		);

		logDebug("Done", "getClipboardText", text);

		return text;
	}
}
