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

export default class WebExtensionEnvironmentStorageProvider implements IStorageProvider {
	async clear(): Promise<void> {
		await chrome.storage.local.clear();
	}

	async count(): Promise<number> {
		const all = await this.getAll();
		const keys = Object.keys(all);
		const count = keys.length;

		return count;
	}

	async get<T extends JsonValue>(key: string): Promise<T | null> {
		// NOTE: chrome.storage.local internally uses (automatically stringified) JSON storage.
		const record = await chrome.storage.local.get(key);
		const value: unknown = record[key];

		// NOTE: talkie conflates "no such key" and "value is null" (for various meanings of null).
		if (value === undefined) {
			return null;
		}

		// TODO: validate and assert, or warn, remove generic type, or something.
		return value as T;
	}

	async getAll<T extends JsonObject>(): Promise<T> {
		const object = await chrome.storage.local.get() as JsonObject;

		return object as T;
	}

	async has(key: string): Promise<boolean> {
		const item = await this.get(key);

		// NOTE: talkie conflates "no such key" and "value is null" (for various meanings of null).
		return item !== null;
	}

	async isEmpty(): Promise<boolean> {
		const count = await this.count();

		return count === 0;
	}

	async remove(key: string): Promise<void> {
		await chrome.storage.local.remove(key);
	}

	async set<T extends JsonValue>(key: string, value: T): Promise<void> {
		// NOTE: chrome.storage.local internally uses (automatically stringified) JSON storage.
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local
		const record = {
			[key]: value,
		};

		await chrome.storage.local.set(record);
	}

	async setAll<T extends JsonObject>(object: T): Promise<void> {
		await chrome.storage.local.set(object);
	}
}
