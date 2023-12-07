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

import {
	type IPortProviderBase,
} from "./iport-provider-base.mjs";

export default abstract class PortProviderBase implements IPortProviderBase {
	constructor(public readonly portName: string) {}

	public async assertIsConnected(): Promise<void> {
		const isConnected = await this.isConnected();

		if (!isConnected) {
			throw new Error("Port not connected.");
		}
	}

	public async assertIsNotConnected(): Promise<void> {
		const isConnected = await this.isConnected();

		if (isConnected) {
			throw new Error("Port is already connected.");
		}
	}

	public abstract isConnected(): Promise<boolean>;

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public abstract postMessage(message: JsonValue): Promise<void>;
}
