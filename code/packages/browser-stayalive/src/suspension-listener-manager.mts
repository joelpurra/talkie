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
} from "@talkie/shared-application-helpers/log.mjs";
import {
	ReadonlyDeep,
} from "type-fest";
import type {
	Runtime,
} from "webextension-polyfill";

type SuspendConnectionPort = {
	_onDisconnectHandler: () => void;
	currentConnectionId: number;
	port: Runtime.Port;
	preventSuspensionIntervalId: NodeJS.Timeout;
};

export default class SuspensionListenerManager {
	// NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
	private get preventSuspensionPortName() {
		return "talkie-prevents-suspension";
	}

	private connectionCounter = 0;
	private activeSuspendConnections = 0;
	private suspendConnectionPorts: SuspendConnectionPort[] = [];

	private _preventSuspendPromise: Promise<void> | null = null;
	private _preventSuspendPromiseResolve: (() => void) | null = null;

	private _onConnectHandlerBound: ((port: ReadonlyDeep<Runtime.Port>) => void) | null = null;

	async start(): Promise<void> {
		void logDebug("Start", "SuspensionListenerManager.start");

		this._onConnectHandlerBound = (port: ReadonlyDeep<Runtime.Port>) => {
			this._onConnectHandler(port);
		};

		if (browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: onConnect listener was already registered");
		}

		browser.runtime.onConnect.addListener(this._onConnectHandlerBound);

		await this._createOnSuspendPromise();

		void logDebug("Done", "SuspensionListenerManager.start");
	}

	async stop(): Promise<void> {
		void logDebug("Start", "SuspensionListenerManager.stop");

		if (typeof this._onConnectHandlerBound !== "function") {
			throw new TypeError(`SuspensionListenerManager: Not initialized: ${typeof this._onConnectHandlerBound} ${JSON.stringify(this._onConnectHandlerBound)}`);
		}

		if (!browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: onConnect listener was not registered.");
		}

		browser.runtime.onConnect.removeListener(this._onConnectHandlerBound);
		this._onConnectHandlerBound = null;

		await this._finishOnSuspendPromise();

		if (this.activeSuspendConnections !== 0) {
			void logWarn(`this.activeSuspendConnections is not 0: ${this.activeSuspendConnections}. Attempting to disconnect.`);

			await this._cleanUpConnections();
		}

		void logDebug("Done", "SuspensionListenerManager.stop");
	}

	private _onConnectHandler(port: ReadonlyDeep<Runtime.Port>) {
		// NOTE: not only suspension managers connect here.
		this.connectionCounter++;

		const currentConnectionId = this.connectionCounter;

		void logDebug("Start", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

		if (port.name !== this.preventSuspensionPortName) {
			// NOTE: ignore non-matching ports.
			void logDebug("Non-matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

			return;
		}

		this.activeSuspendConnections++;

		void logDebug("Matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

		const _onMessageHandler = (message: unknown) => {
			void logDebug("_onMessageHandler", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, message);

			return this._preventSuspendPromise;
		};

		const _messageProducer = () => {
			const suspendConnectionPort = this.suspendConnectionPorts[currentConnectionId];

			if (!suspendConnectionPort) {
				throw new Error(`Could not find the port for the current connection: ${currentConnectionId} ${typeof suspendConnectionPort} ${JSON.stringify(suspendConnectionPort)}`);
			}

			const {
				port,
			} = suspendConnectionPort;

			if (!port) {
				throw new Error(`Could not find the port for the current connection: ${currentConnectionId} ${typeof suspendConnectionPort} ${JSON.stringify(suspendConnectionPort)}`);
			}

			suspendConnectionPort.port.postMessage(`Ah, ha, ha, ha, stayin' alive, stayin' alive: ${currentConnectionId}, ${this.activeSuspendConnections}`);
		};

		// NOTE: this message producer is unnecessary.
		const preventSuspensionIntervalId = setInterval(_messageProducer, 1000);

		const _onDisconnectHandler = () => {
			void logDebug("Start", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);

			clearInterval(preventSuspensionIntervalId);

			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete this.suspendConnectionPorts[currentConnectionId];

			this.activeSuspendConnections--;

			void logDebug("Done", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);
		};

		const suspendConnectionPort = {
			_onDisconnectHandler,
			currentConnectionId,
			port,
			preventSuspensionIntervalId,
		};

		// NOTE: this disconnect listener is unnecessary.
		suspendConnectionPort.port.onDisconnect.addListener(_onDisconnectHandler);

		// NOTE: this message listener is unnecessary.
		suspendConnectionPort.port.onMessage.addListener(_onMessageHandler);

		// NOTE: the background connects once per suspension prevention.
		this.suspendConnectionPorts[currentConnectionId] = suspendConnectionPort;

		void logDebug("Done", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);
	}

	private async _cleanUpConnections(): Promise<void> {
		void logDebug("Start", "_cleanUpConnections");

		// TODO: this isn't an array of promises, should it be?
		const portDisconnectPromises = this.suspendConnectionPorts
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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

		void logDebug("Done", "_cleanUpConnections");
	}

	private async _createOnSuspendPromise(): Promise<void> {
		void logDebug("Start", "_createOnSuspendPromise");

		void logDebug("Start", "_preventSuspendPromise", "creating");

		this._preventSuspendPromise = new Promise<void>(
			(resolve) => {
				// NOTE: should keep the channel alive until it disconnects.
				// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage
				// https://developer.chrome.com/extensions/runtime
				this._preventSuspendPromiseResolve = resolve;
			});

		void logDebug("Done", "_preventSuspendPromise", "resolved");
	}

	private async _finishOnSuspendPromise(): Promise<void> {
		void logDebug("Start", "_finishOnSuspendPromise");

		if (typeof this._preventSuspendPromiseResolve !== "function") {
			throw new TypeError(`Found no function to resolve promise: ${typeof this._preventSuspendPromiseResolve}`);
		}

		this._preventSuspendPromiseResolve();
		await this._preventSuspendPromise;

		void logDebug("Done", "_finishOnSuspendPromise");
	}
}
