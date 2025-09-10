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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";

export default class NodeEnvironmentStorageProvider implements IStorageProvider {
	private readonly _inMemoryStorage = new Map<string, JsonValue>();

	async clear(): Promise<void> {
		this._inMemoryStorage.clear();
	}

	async count(): Promise<number> {
		return this._inMemoryStorage.size;
	}

	async get<T extends JsonValue>(key: string): Promise<T | null> {
		if (!this._inMemoryStorage.has(key)) {
			return null;
		}

		const valueJson = this._inMemoryStorage.get(key);

		if (valueJson === undefined) {
			return null;
		}

		// NOTE: storing/retrieving cloned values instead of references.
		const value = jsonClone(valueJson);

		// TODO: validate and assert, or warn, remove generic type, or something.
		return value as unknown as T;
	}

	async getAll<T extends JsonObject>(): Promise<T> {
		// NOTE: storing/retrieving cloned values instead of references.
		const object = Object.fromEntries(this._inMemoryStorage.entries());
		const values = jsonClone(object);

		return values as T;
	}

	async has(key: string): Promise<boolean> {
		return this._inMemoryStorage.has(key);
	}

	async isEmpty(): Promise<boolean> {
		const count = await this.count();

		return count === 0;
	}

	async remove(key: string): Promise<void> {
		this._inMemoryStorage.delete(key);
	}

	async set<T extends JsonValue>(key: string, value: T): Promise<void> {
		// NOTE: storing/retrieving cloned values instead of references.
		const valueJson = jsonClone(value);

		this._inMemoryStorage.set(key, valueJson);
	}

	async setAll<T extends JsonObject>(object: T): Promise<void> {
		for (const [
			key,
			value,
		] of Object.entries(object)) {
			// eslint-disable-next-line no-await-in-loop
			await this.set(key, value);
		}
	}
}
