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
	type JsonValue,
} from "type-fest";
import type {
	Runtime,
} from "webextension-polyfill";

import PortProviderBase from "./port-provider-base.mjs";

export default class PortConnectorProvider extends PortProviderBase {
	protected _port: Runtime.Port | null = null;
	protected _isConnectingPromise: Promise<Runtime.Port> | null = null;
	protected _isDisconnectingPromise: Promise<void> | null = null;

	public async isConnected(): Promise<boolean> {
		await Promise.all([
			// NOTE: null values do not matter; they are resolved as-is.
			this._isConnectingPromise,
			this._isDisconnectingPromise,
		]);

		return (this._port !== null);
	}

	public async connect(): Promise<void> {
		await this.assertIsNotConnected();

		try {
			this._isConnectingPromise = this._connectPort();
			this._port = await this._isConnectingPromise;
		} finally {
			this._isConnectingPromise = null;
		}
	}

	public async disconnect(): Promise<void> {
		await this.assertIsConnected();

		try {
			this._isDisconnectingPromise = this._disconnectPort();
			await this._isDisconnectingPromise;

			// NOTE: verify that the disconnect handler has been executed properly.
			await this.assertIsNotConnected();
		} finally {
			this._isDisconnectingPromise = null;
		}
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async postMessage(message: JsonValue): Promise<void> {
		await this.assertIsConnected();

		this._port?.postMessage(message);
	}

	private async _connectPort(): Promise<Runtime.Port> {
		// NOTE: this method is a roundabout way to promisify the synchronous connect().
		const extensionId = undefined;
		const portConnectOptions = {
			name: this.portName,
		};

		const port = chrome.runtime.connect(extensionId, portConnectOptions);

		if (!port) {
			throw new Error(`Could not connect to ${this.portName}.`);
		}

		const onDisconnectHandler = () => {
			this._port = null;
		};

		// NOTE: disconnect behavior differs between implementations.
		// - chrome: onDisconnect fires when all listeners are disconnected or gone (page/frame unloaded etcetera).
		// - firefox: onDisconnect fires when *any* listener disconnects.
		// NOTE: Firefox bug (from 2018-05-30, still open 2024-08-10): the disconnect handler may be called when there are still listeners in additional extension pages/frames, effectively disconnecting everyone. There is no way of checking this from the extension.
		// https://bugzilla.mozilla.org/show_bug.cgi?id=1465514
		// TODO: in firefox, reconnect automatically for each message sent?
		port.onDisconnect.addListener(onDisconnectHandler);

		return port;
	}

	private async _disconnectPort(): Promise<void> {
		// NOTE: this method is a roundabout way to promisify the synchronous disconnect().
		const {
			_port,
		} = this;

		// https://developer.chrome.com/extensions/runtime#type-Port
		// NOTE: should work irregardless of if the port was connected or not.
		_port!.disconnect();
	}
}
