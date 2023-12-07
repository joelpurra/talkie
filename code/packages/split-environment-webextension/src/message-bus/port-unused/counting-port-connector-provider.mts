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

import PortConnectorProvider from "./port-connector-provider.mjs";

export default class CountingPortConnectorProvider extends PortConnectorProvider {
	protected _connectionCounter = 0;

	public override async isConnected(): Promise<boolean> {
		// NOTE: not trusting the counter.
		const isConnected = await super.isConnected();

		const isConnectedMatchesCounter = (isConnected && this._connectionCounter >= 1)
			|| (!isConnected && this._connectionCounter === 0);

		if (!isConnectedMatchesCounter) {
			throw new RangeError(`Underlying connection status and counter mismatch: ${isConnected} <> ${this._connectionCounter}.`);
		}

		return isConnected;
	}

	public override async connect(): Promise<void> {
		if (this._connectionCounter === 0) {
			await super.connect();

			this._connectionCounterIncrement();
		} else if (this._isConnectingPromise) {
			await this._isConnectingPromise;
		}
	}

	public override async disconnect(): Promise<void> {
		if (this._connectionCounter === 1) {
			await super.disconnect();

			this._connectionCounterDecrement();
		} else if (this._isDisconnectingPromise) {
			await this._isDisconnectingPromise;
		}
	}

	private _connectionCounterIncrement() {
		if (this._connectionCounter < 0) {
			throw new Error(`The connection counter should not go below zero: ${this._connectionCounter}`);
		}

		this._connectionCounter++;
	}

	private _connectionCounterDecrement() {
		if (this._connectionCounter <= 0) {
			throw new Error(`The connection counter should not go below zero: ${this._connectionCounter}`);
		}

		this._connectionCounter--;
	}
}
