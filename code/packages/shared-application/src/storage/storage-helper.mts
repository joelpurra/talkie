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
	JsonValue,
} from "type-fest";

import {
	logTrace,
} from "@talkie/shared-application-helpers/log.mjs";

import {
	getStorageKey,
	type StorageFormatVersion,
	type StorageKey,
} from "./storage-keys.mjs";

export default class StorageHelper {
	constructor(private readonly storageProvider: IStorageProvider) {}

	async setStoredValue<T extends JsonValue>(storageFormatVersion: StorageFormatVersion, key: StorageKey, value: T): Promise<void> {
		void logTrace(this.constructor.name, "Start", "_setStoredValue", storageFormatVersion, key, typeof value, value);

		const storageKey = await getStorageKey(storageFormatVersion, key);

		// TODO: assert type at runtime.
		await this.storageProvider.set<T>(storageKey, value);

		void logTrace(this.constructor.name, "Done", "_setStoredValue", storageFormatVersion, key, typeof value, value);
	}

	async getStoredValue<T extends JsonValue>(storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<T | null> {
		void logTrace(this.constructor.name, "Start", "_getStoredValue", storageFormatVersion, key);

		const storageKey = await getStorageKey(storageFormatVersion, key);

		// TODO: assert type at runtime.
		const value = await this.storageProvider.get<T>(storageKey);

		void logTrace(this.constructor.name, "Done", "_getStoredValue", storageFormatVersion, key, value);

		return value;
	}
}
