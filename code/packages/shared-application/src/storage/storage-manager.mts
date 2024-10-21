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
	logDebug,
	logTrace,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	JsonValue,
} from "type-fest";

import type StorageHelper from "./storage-helper.mjs";
import type {
	StorageFormatVersion,
	StorageKey,
} from "./storage-keys.mjs";

export default class StorageManager {
	constructor(private readonly storageHelper: StorageHelper, public readonly storageFormatVersion: StorageFormatVersion) {}

	async setStoredValue<T extends JsonValue>(key: StorageKey, value: T): Promise<void> {
		void logDebug(this.constructor.name, "Start", "setStoredValue", key, typeof value, value);

		await this.storageHelper.setStoredValue<T>(this.storageFormatVersion, key, value);

		void logDebug(this.constructor.name, "Done", "setStoredValue", key, typeof value, value);
	}

	async getStoredValue<T extends JsonValue>(key: StorageKey): Promise<T | null> {
		void logTrace(this.constructor.name, "Start", "getStoredValue", key);

		const value = await this.storageHelper.getStoredValue<T>(this.storageFormatVersion, key);

		void logTrace(this.constructor.name, "Done", "getStoredValue", key, value);

		return value;
	}
}
