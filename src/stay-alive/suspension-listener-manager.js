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
	logWarn,
} from "../shared/log";

export default class SuspensionListenerManager {
	constructor() {
		// NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
		this.preventSuspensionPortName = "talkie-prevents-suspension";

		this._onConnectHandlerBound = null;
		this.connectionCounter = 0;
		this.activeSuspendConnections = 0;
		this.suspendConnectionPorts = [];

		this._preventSuspendPromise = null;
		this._preventSuspendPromiseResolve = null;

		this._onConnectHandlerBound = (...args) => this._onConnectHandler(...args);
	}

	_onConnectHandler(port) {
		// NOTE: not only suspension managers connect here.
		this.connectionCounter++;

		const currentConnectionId = this.connectionCounter;

		logDebug("Start", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

		if (port.name !== this.preventSuspensionPortName) {
			// NOTE: ignore non-matching ports.
			logDebug("Non-matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

			return;
		}

		this.activeSuspendConnections++;

		logDebug("Matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

		const _onMessageHandler = (message) => {
			logDebug("_onMessageHandler", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, message);

			return this._preventSuspendPromise;
		};

		const _messageProducer = () => {
			this.suspendConnectionPorts[currentConnectionId].port.postMessage(`Ah, ha, ha, ha, stayin' alive, stayin' alive: ${currentConnectionId}, ${this.activeSuspendConnections}`);
		};

		// NOTE: this message producer is unnecessary.
		const preventSuspensionIntervalId = setInterval(_messageProducer, 1000);

		const _onDisconnectHandler = () => {
			logDebug("Start", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);

			clearInterval(preventSuspensionIntervalId);

			delete this.suspendConnectionPorts[currentConnectionId];

			this.activeSuspendConnections--;

			logDebug("Done", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);
		};

		// NOTE: the background connects once per suspension prevention.
		this.suspendConnectionPorts[currentConnectionId] = {
			_onDisconnectHandler,
			currentConnectionId,
			port,
			preventSuspensionIntervalId,
		};

		// NOTE: this disconnect listener is unnecessary.
		this.suspendConnectionPorts[currentConnectionId].port.onDisconnect.addListener(_onDisconnectHandler);

		// NOTE: this message listener is unnecessary.
		this.suspendConnectionPorts[currentConnectionId].port.onMessage.addListener(_onMessageHandler);

		logDebug("Done", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);
	}

	async _cleanUpConnections() {
		logDebug("Start", "_cleanUpConnections");

		// TODO: this isn't an array of promises, should it be?
		const portDisconnectPromises = this.suspendConnectionPorts
			.map((suspendConnectionPort) => {
				if (suspendConnectionPort) {
					if (suspendConnectionPort.port && typeof suspendConnectionPort.port.disconnect === "function") {
						suspendConnectionPort.port.disconnect();
					}

					if (typeof suspendConnectionPort._onDisconnectHandler === "function") {
						suspendConnectionPort._onDisconnectHandler();
					}
				}

				return undefined;
			});

		await Promise.all(portDisconnectPromises);

		logDebug("Done", "_cleanUpConnections");
	}

	async _createOnSuspendPromise() {
		logDebug("Start", "_createOnSuspendPromise");

		logDebug("Start", "_preventSuspendPromise", "creating");

		this._preventSuspendPromise = await new Promise(
			(resolve) => {
				// NOTE: should keep the channel alive until it disconnects.
				// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage
				// https://developer.chrome.com/extensions/runtime
				this._preventSuspendPromiseResolve = resolve;
			});

		logDebug("Done", "_preventSuspendPromise", "resolved");
	}

	async _finishOnSuspendPromise() {
		logDebug("Start", "_finishOnSuspendPromise");

		await this._preventSuspendPromiseResolve();
		await this._preventSuspendPromise;

		logDebug("Done", "_finishOnSuspendPromise");
	}

	async start() {
		logDebug("Start", "SuspensionListenerManager.start");

		if (browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: Already initialized.");
		}

		browser.runtime.onConnect.addListener(this._onConnectHandlerBound);

		await this._createOnSuspendPromise();

		logDebug("Done", "SuspensionListenerManager.start");
	}

	async stop() {
		logDebug("Start", "SuspensionListenerManager.stop");

		if (!browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: Not initialized.");
		}

		browser.runtime.onConnect.removeListener(this._onConnectHandlerBound);
		this._onConnectHandlerBound = null;

		await this._finishOnSuspendPromise();

		if (this.activeSuspendConnections !== 0) {
			logWarn(`this.activeSuspendConnections is not 0: ${this.activeSuspendConnections}. Attempting to disconnect.`);

			await this._cleanUpConnections();
		}

		logDebug("Done", "SuspensionListenerManager.stop");
	}
}
