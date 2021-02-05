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
	promiseTry,
} from "../shared/promise";

export default class SuspensionManager {
	constructor(suspensionConnectorManager) {
		// NOTE: the iframe takes care of the SuspensionListenerManager.
		this.suspensionConnectorManager = suspensionConnectorManager;

		this.stayAliveElementId = "stay-alive-iframe";
		this.stayAliveHtmlPath = "/src/stay-alive/stay-alive.html";
	}

	_getExistingIframe() {
		return promiseTry(
			() => {
				const existingIframe = document.querySelector(`#${this.stayAliveElementId}`);

				return existingIframe;
			},
		);
	}

	_isInitialized() {
		return this._getExistingIframe()
			.then((existingIframe) => existingIframe !== null);
	}

	_ensureIsInitialized() {
		return this._isInitialized()
			.then((isInitialized) => {
				if (isInitialized === true) {
					return undefined;
				}

				throw new Error("this.stayAliveElementId did not exist.");
			});
	}

	_ensureIsNotInitialized() {
		return this._isInitialized()
			.then((isInitialized) => {
				if (isInitialized === false) {
					return undefined;
				}

				throw new Error("this.stayAliveElementId exists.");
			});
	}

	_injectBackgroundFrame() {
		return this._ensureIsNotInitialized()
			.then(() => {
				const iframe = document.createElement("iframe");
				iframe.id = this.stayAliveElementId;
				iframe.src = this.stayAliveHtmlPath;
				document.body.append(iframe);

				return undefined;
			});
	}

	_removeBackgroundFrame() {
		return this._ensureIsInitialized()
			.then(() => this._getExistingIframe())
			.then((existingIframe) => {
				// NOTE: trigger onunload.
				// https://stackoverflow.com/questions/8677113/how-to-trigger-onunload-event-when-removing-iframe
				existingIframe.src = "about:blank";
				existingIframe.src = "the-id-does-not-matter-now";

				// NOTE: ensure the src change has time to take effect.
				return promiseSleep(() => {
					existingIframe.remove();
				}, 10);
			});
	}

	initialize() {
		return promiseTry(
			() => {
				logDebug("Start", "SuspensionManager.initialize");

				return this._injectBackgroundFrame()
					.then(() => {
						logDebug("Done", "SuspensionManager.initialize");

						return undefined;
					});
			},
		);
	}

	unintialize() {
		return promiseTry(
			() => {
				logDebug("Start", "SuspensionManager.unintialize");

				return this._removeBackgroundFrame()
					.then(() => {
						logDebug("Done", "SuspensionManager.unintialize");

						return undefined;
					});
			},
		);
	}

	preventExtensionSuspend() {
		return promiseTry(
			() => {
				logInfo("SuspensionManager.preventExtensionSuspend");

				return this._ensureIsInitialized()
					.then(() => this.suspensionConnectorManager._connectToStayAlive());
			},
		);
	}

	allowExtensionSuspend() {
		return promiseTry(
			() => {
				logInfo("SuspensionManager.allowExtensionSuspend");

				return this._ensureIsInitialized()
					.then(() => this.suspensionConnectorManager._disconnectToDie());
			},
		);
	}
}
