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
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";

import SuspensionConnectorManager from "./suspension-connector-manager.mjs";

export default class SuspensionManager {
	private get stayAliveElementId() {
		return "stayalive-iframe";
	}

	private get stayAliveHtmlPath() {
		// NOTE: relative to background.html, rooted in the browser extension package root.
		return "/packages/browser-stayalive/src/stayalive.html";
	}

	constructor(private readonly suspensionConnectorManager: SuspensionConnectorManager) {
		// NOTE: the iframe takes care of the SuspensionListenerManager.
	}

	async _getExistingIframeOrNull(): Promise<HTMLIFrameElement | null> {
		const existingIframe = document.querySelector<HTMLIFrameElement>(`#${this.stayAliveElementId}`);

		return existingIframe;
	}

	async _getExistingIframe(): Promise<HTMLIFrameElement> {
		const existingIframe = await this._getExistingIframeOrNull();

		if (!existingIframe) {
			throw new Error("The suspension manager iframe could not be found.");
		}

		return existingIframe;
	}

	async _isInitialized(): Promise<boolean> {
		const existingIframe = await this._getExistingIframeOrNull();

		return existingIframe !== null;
	}

	async _ensureIsInitialized(): Promise<void> {
		const isInitialized = await this._isInitialized();

		if (isInitialized) {
			return;
		}

		throw new Error("this.stayAliveElementId did not exist.");
	}

	async _ensureIsNotInitialized(): Promise<void> {
		const isInitialized = await this._isInitialized();

		if (!isInitialized) {
			return;
		}

		throw new Error("this.stayAliveElementId exists.");
	}

	async _injectBackgroundFrame(): Promise<void> {
		await this._ensureIsNotInitialized();

		const iframe = document.createElement("iframe");
		iframe.id = this.stayAliveElementId;
		iframe.src = this.stayAliveHtmlPath;
		document.body.append(iframe);
	}

	async _removeBackgroundFrame(): Promise<void> {
		await this._ensureIsInitialized();

		const existingIframe = await this._getExistingIframe();

		// NOTE: trigger onunload.
		// https://stackoverflow.com/questions/8677113/how-to-trigger-onunload-event-when-removing-iframe
		existingIframe.src = "about:blank";
		existingIframe.src = "the-id-does-not-matter-now";

		// NOTE: ensure the src change has time to take effect.
		await promiseDelay(10);

		existingIframe.remove();
	}

	async initialize(): Promise<void> {
		void logDebug("Start", "SuspensionManager.initialize");

		await this._injectBackgroundFrame();

		void logDebug("Done", "SuspensionManager.initialize");
	}

	async uninitialize(): Promise<void> {
		void logDebug("Start", "SuspensionManager.uninitialize");

		await this._removeBackgroundFrame();

		void logDebug("Done", "SuspensionManager.uninitialize");
	}

	async preventExtensionSuspend(): Promise<void> {
		void logInfo("SuspensionManager.preventExtensionSuspend");

		await this._ensureIsInitialized();
		await this.suspensionConnectorManager._connectToStayAlive();
	}

	async allowExtensionSuspend(): Promise<void> {
		void logInfo("SuspensionManager.allowExtensionSuspend");

		await this._ensureIsInitialized();
		await this.suspensionConnectorManager._disconnectToDie();
	}
}
