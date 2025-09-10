/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type IStorageProvider from "@talkie/split-environment-interfaces/istorage-provider.mjs";
import type {
	JsonObject,
	JsonValue,
} from "type-fest";

import {
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";

/**
 * @deprecated Intended only for window.localStorage outward migration.
 */
export default class WindowLocalStorageProvider implements IStorageProvider {
	async clear(): Promise<void> {
		globalThis.localStorage.clear();
	}

	async count(): Promise<number> {
		return globalThis.localStorage.length;
	}

	async get<T extends JsonValue>(key: string): Promise<T | null> {
		const valueJson = globalThis.localStorage.getItem(key);

		if (valueJson === null) {
			return null;
		}

		// NOTE: window.localStorage only stores stringified values.
		const value = JSON.parse(valueJson) as JsonValue;

		// TODO: validate and assert, or warn, remove generic type, or something.
		return value as unknown as T;
	}

	async getAll<T extends JsonObject>(): Promise<T> {
		const object: JsonObject = {};

		for (let index = 0; index < globalThis.localStorage.length; index++) {
			const key = globalThis.localStorage.key(index);

			if (!key) {
				throw new RangeError(`Index ${index} returned an empty key ${JSON.stringify(key, null, 0)}.`);
			}

			const valueJson = globalThis.localStorage.getItem(key);

			if (valueJson === null) {
				throw new Error(`The key ${JSON.stringify(key, null, 0)} is indicated to be empty ${JSON.stringify(valueJson, null, 0)}.`);
			}

			// NOTE: window.localStorage only stores stringified values.
			const value = JSON.parse(valueJson) as JsonValue;

			if (object[key] !== undefined) {
				if (object[key] !== value) {
					throw new Error(`The key ${JSON.stringify(key, null, 0)} was already initiated with value ${JSON.stringify(object[key], null, 0)}; new value ${JSON.stringify(value, null, 0)}.`);
				}

				void logWarn(
					this.constructor.name,
					`The key ${
						JSON.stringify(key, null, 0)
					} was already initiated with value ${
						JSON.stringify(object[key], null, 0)
					}; the new value ${
						JSON.stringify(value, null, 0)
					} is the same, so ignoring the issue.`,
				);

				continue;
			}

			object[key] = value;
		}

		return object as T;
	}

	async has(key: string): Promise<boolean> {
		const item = await this.get(key);

		return item !== null;
	}

	async isEmpty(): Promise<boolean> {
		const count = await this.count();

		return count === 0;
	}

	async remove(key: string): Promise<void> {
		globalThis.localStorage.removeItem(key);
	}

	async set<T extends JsonValue>(key: string, value: T): Promise<void> {
		// NOTE: window.localStorage only stores stringified values.
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
		const valueJson = JSON.stringify(value);

		globalThis.localStorage.setItem(key, valueJson);
	}

	async setAll<T extends JsonObject>(object: T): Promise<void> {
		for (const [
			key,
			value,
		] of Object.entries(object)) {
			// TODO: use Promise.all(), or Bluebird.map()?
			// eslint-disable-next-line no-await-in-loop
			await this.set(key, value);
		}
	}
}
