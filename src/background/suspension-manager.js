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
} from "../shared/log";
import {
	promiseSleep,
} from "../shared/promise";

export default class SuspensionManager {
	constructor(suspensionConnectorManager) {
		// NOTE: the iframe takes care of the SuspensionListenerManager.
		this.suspensionConnectorManager = suspensionConnectorManager;

		this.stayAliveElementId = "stay-alive-iframe";
		this.stayAliveHtmlPath = "/src/stay-alive/stay-alive.html";
	}

	async _getExistingIframe() {
		const existingIframe = document.querySelector(`#${this.stayAliveElementId}`);

		return existingIframe;
	}

	async _isInitialized() {
		const existingIframe = await this._getExistingIframe();

		return existingIframe !== null;
	}

	async _ensureIsInitialized() {
		const isInitialized = await this._isInitialized();

		if (isInitialized === true) {
			return;
		}

		throw new Error("this.stayAliveElementId did not exist.");
	}

	async _ensureIsNotInitialized() {
		const isInitialized = await this._isInitialized();

		if (isInitialized === false) {
			return;
		}

		throw new Error("this.stayAliveElementId exists.");
	}

	async _injectBackgroundFrame() {
		await this._ensureIsNotInitialized();

		const iframe = document.createElement("iframe");
		iframe.id = this.stayAliveElementId;
		iframe.src = this.stayAliveHtmlPath;
		document.body.append(iframe);
	}

	async _removeBackgroundFrame() {
		await this._ensureIsInitialized();

		const existingIframe = await this._getExistingIframe();

		// NOTE: trigger onunload.
		// https://stackoverflow.com/questions/8677113/how-to-trigger-onunload-event-when-removing-iframe
		existingIframe.src = "about:blank";
		existingIframe.src = "the-id-does-not-matter-now";

		// NOTE: ensure the src change has time to take effect.
		return promiseSleep(() => {
			existingIframe.remove();
		}, 10);
	}

	async initialize() {
		logDebug("Start", "SuspensionManager.initialize");

		await this._injectBackgroundFrame();

		logDebug("Done", "SuspensionManager.initialize");
	}

	async uninitialize() {
		logDebug("Start", "SuspensionManager.uninitialize");

		await this._removeBackgroundFrame();

		logDebug("Done", "SuspensionManager.uninitialize");
	}

	async preventExtensionSuspend() {
		logInfo("SuspensionManager.preventExtensionSuspend");

		await this._ensureIsInitialized();
		await this.suspensionConnectorManager._connectToStayAlive();
	}

	async allowExtensionSuspend() {
		logInfo("SuspensionManager.allowExtensionSuspend");

		await this._ensureIsInitialized();
		await this.suspensionConnectorManager._disconnectToDie();
	}
}
