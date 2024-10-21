/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
	bespeak,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type IStorageProvider from "@talkie/split-environment-interfaces/istorage-provider.mjs";
import type {
	JsonObject,
	JsonValue,
} from "type-fest";

/**
 * @deprecated Intended only for window.localStorage outward migration.
 */
export default class MessageBusWindowLocalStorageProvider implements IStorageProvider {
	constructor(private readonly messageBusProviderGetter: IMessageBusProviderGetter) {}

	async clear(): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async count(): Promise<number> {
		const count = await bespeak(this.messageBusProviderGetter, "offscreen:storage:window:localStorage:count");

		if (typeof count === "number") {
			return count;
		}

		return 0;
	}

	async get<T extends JsonValue>(_key: string): Promise<T | null> {
		throw new Error("Method not implemented.");
	}

	async getAll<T extends JsonObject>(): Promise<T> {
		const data = await bespeak(this.messageBusProviderGetter, "offscreen:storage:window:localStorage:getAll");

		if (typeof data === "object" && data !== null) {
			return data as T;
		}

		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		const emptyData: T = {} as T;

		return emptyData;
	}

	async has(_key: string): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	async isEmpty(): Promise<boolean> {
		const isEmpty = await bespeak(this.messageBusProviderGetter, "offscreen:storage:window:localStorage:isEmpty");

		return isEmpty === true;
	}

	async remove(_key: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async set<T extends JsonValue>(_key: string, _value: T): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async setAll<T extends JsonObject>(_object: T): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
