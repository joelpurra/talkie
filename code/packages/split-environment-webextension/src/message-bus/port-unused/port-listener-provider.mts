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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import type {
	MessageBusNotification,
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	IStartStop,
} from "@talkie/split-environment-interfaces/istart-stop.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";
import type {
	Runtime,
} from "webextension-polyfill";

import PortProviderBase from "./port-provider-base.mjs";

export default class PortListenerProvider extends PortProviderBase implements IStartStop {
	protected readonly _weakPorts = new Set<WeakRef<Runtime.Port>>();
	private readonly _onConnectHandlerBound: typeof this._onConnectHandler = this._onConnectHandler.bind(this);

	constructor(
		portName: string,
		public readonly onMessage: MessageBusNotification,
	) {
		super(portName);
	}

	public async isConnected(): Promise<boolean> {
		return this._weakPorts.size > 0;
	}

	public async start(): Promise<void> {
		if (chrome.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: onConnect listener was already registered");
		}

		chrome.runtime.onConnect.addListener(this._onConnectHandlerBound);
	}

	public async stop(): Promise<void> {
		// NOTE: this asynchronous cleanup method may not be allowed execute to completion.
		if (!chrome.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
			throw new Error("SuspensionListenerManager: onConnect listener was not registered.");
		}

		chrome.runtime.onConnect.removeListener(this._onConnectHandlerBound);

		await this._cleanUpConnections();
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async postMessage(rawMessage: MessageBusRequest): Promise<void> {
		for (const weakPort of this._weakPorts) {
			const storedPort = weakPort.deref();

			if (storedPort === undefined) {
				this._weakPorts.delete(weakPort);
			} else {
				// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
				const messageClone = rawMessage === undefined ? undefined : jsonClone(rawMessage);

				storedPort.postMessage(messageClone);
			}
		}
	}

	private async _cleanUpConnections(): Promise<void> {
		for (const weakPort of this._weakPorts) {
			const storedPort = weakPort.deref();

			if (storedPort !== undefined) {
				storedPort.disconnect();
			}

			this._weakPorts.delete(weakPort);
		}
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	private async _onMessageHandler(rawMessage: Readonly<JsonValue>): Promise<void> {
		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		const messageClone = jsonClone(rawMessage);

		// NOTE: no response; to respond, send a separate message.
		this.onMessage(messageClone);
	}

	private async _onDisconnectHandler(port: ReadonlyDeep<Runtime.Port>) {
		if (port.name !== this.portName) {
			throw new Error(`Port did not match by name: expected ${JSON.stringify(this.portName, null, 0)}, received ${JSON.stringify(port.name, null, 0)}.`);
		}

		const {
			sender: portSender,
		} = port;

		if (!portSender) {
			throw new Error(`Sender not defined for port with name: ${JSON.stringify(port.name, null, 0)}.`);
		}

		for (const weakPort of this._weakPorts) {
			const storedPort = weakPort.deref();

			if (storedPort === undefined) {
				this._weakPorts.delete(weakPort);
			} else {
				const portMatchesStoredPort = (storedPort.sender === portSender)
					|| (typeof storedPort.sender?.tab?.id === "number" && storedPort.sender?.tab?.id === portSender.tab?.id);

				if (portMatchesStoredPort) {
					this._weakPorts.delete(weakPort);
				}
			}
		}
	}

	private _onConnectHandler(port: ReadonlyDeep<Runtime.Port>) {
		if (port.name !== this.portName) {
			throw new Error(`Port did not match by name: expected ${JSON.stringify(this.portName, null, 0)}, received ${JSON.stringify(port.name, null, 0)}.`);
		}

		// NOTE: disconnect behavior differs between implementations.
		// - chrome: onDisconnect fires when all listeners are disconnected or gone (page/frame unloaded etcetera).
		// - firefox: onDisconnect fires when *any* listener disconnects.
		// NOTE: Firefox bug (from 2018-05-30, still open 2024-08-10): the disconnect handler may be called when there are still listeners in additional extension pages/frames, effectively disconnecting everyone. There is no way of checking this from the extension.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1465514
		// TODO: in firefox, reconnect automatically for each message sent?
		port.onDisconnect.addListener(this._onDisconnectHandler);
		port.onMessage.addListener(this._onMessageHandler);
		this._weakPorts.add(new WeakRef(port));
	}
}
