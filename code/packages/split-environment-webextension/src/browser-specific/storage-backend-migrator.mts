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
	logInfo,
	logTrace,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	JsonValue,
} from "type-fest";

export default class StorageBackendMigrator {
	async _getWindowLocalStorageValue(key: string): Promise<JsonValue> {
		const valueJson = globalThis.localStorage.getItem(key);

		if (valueJson === null) {
			return null;
		}

		const value = JSON.parse(valueJson) as JsonValue;

		return value;
	}

	async _getAllWindowLocalStorage(): Promise<Record<string, JsonValue>> {
		const values: Record<string, JsonValue> = {};

		const initialLength = globalThis.localStorage.length;

		for (let i = 0; i < initialLength; i++) {
			const key = globalThis.localStorage.key(i);

			if (typeof key !== "string") {
				throw new RangeError(`Seem to have iterated out of the local storage key range: index ${i}, initial length ${initialLength}, current length ${globalThis.localStorage.length}.`);
			}

			// TODO: move await outside the loop using Bluebird.props()?
			// eslint-disable-next-line no-await-in-loop
			const value = await this._getWindowLocalStorageValue(key);

			values[key] = value;
		}

		return values;
	}

	async _clearWindowLocalStorage(): Promise<void> {
		globalThis.localStorage.clear();
	}

	async _getWindowLocalStorageCount(): Promise<number> {
		const keyCount = globalThis.localStorage.length;

		return keyCount;
	}

	async _isWindowLocalStorageEmpty(): Promise<boolean> {
		const windowLocalStorageCount = await this._getWindowLocalStorageCount();
		const isEmpty = windowLocalStorageCount === 0;

		return isEmpty;
	}

	async _getChromeStorageLocalCount(): Promise<number> {
		const allChromeStorageLocal = await chrome.storage.local.get(null);
		const allKeys = Object.keys(allChromeStorageLocal);
		const keyCount = allKeys.length;

		return keyCount;
	}

	async _isChromeStorageLocalEmpty(): Promise<boolean> {
		const chromeStorageLocalCount = await this._getChromeStorageLocalCount();
		const isEmpty = chromeStorageLocalCount === 0;

		return isEmpty;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async _setChromeStorageLocalValues(values: Readonly<Record<string, JsonValue>>): Promise<void> {
		await chrome.storage.local.set(values);
	}

	async _migrate(): Promise<void> {
		const chromeStorageLocalCountBefore = await this._getChromeStorageLocalCount();
		const windowLocalStorageCountBefore = await this._getWindowLocalStorageCount();

		const allWindowLocalStorage = await this._getAllWindowLocalStorage();

		await this._setChromeStorageLocalValues(allWindowLocalStorage);
		await this._clearWindowLocalStorage();

		const chromeStorageLocalCountAfter = await this._getChromeStorageLocalCount();
		const windowLocalStorageCountAfter = await this._getWindowLocalStorageCount();

		const storageKeyCounts = {
			chromeStorageLocal: {
				after: chromeStorageLocalCountAfter,
				before: chromeStorageLocalCountBefore,
			},
			windowLocalStorage: {
				after: windowLocalStorageCountAfter,
				windowLocalStorageCountBefore,
			},
		};

		void logInfo("StorageBackendUpgrader._migrate()", "Upgraded storage backend from window.localStorage to chrome.storage.local.", "Storage key counts", storageKeyCounts);
	}

	async migrateIfNecessary(): Promise<void> {
		if (!chrome.storage.local) {
			void logWarn("StorageBackendUpgrader.migrateIfNecessary()", "chrome.storage.local: not found.");
		}

		if (!globalThis.localStorage) {
			void logWarn("StorageBackendUpgrader.migrateIfNecessary()", "window.localStorage: not found.");
		}

		if (!chrome.storage.local || !globalThis.localStorage) {
			return;
		}

		const chromeStorageLocalCount = await this._getChromeStorageLocalCount();
		void logTrace("StorageBackendUpgrader.migrateIfNecessary()", `chrome.storage.local: ${chromeStorageLocalCount} keys.`);

		const windowLocalStorageCount = await this._getWindowLocalStorageCount();
		void logTrace("StorageBackendUpgrader.migrateIfNecessary()", `window.localStorage: ${windowLocalStorageCount} keys.`);

		const isWindowLocalStorageEmpty = await this._isWindowLocalStorageEmpty();

		if (isWindowLocalStorageEmpty) {
			void logDebug("StorageBackendUpgrader.migrateIfNecessary()", "The window.localStorage data is empty. Skipping window.localStorage data migration.");

			return;
		}

		const isChromeStorageLocalEmpty = await this._isChromeStorageLocalEmpty();

		if (!isChromeStorageLocalEmpty) {
			void logWarn("StorageBackendUpgrader.migrateIfNecessary()", `The chrome.storage.local contains data (${chromeStorageLocalCount} keys). Aborting window.localStorage data migration (${windowLocalStorageCount} keys).`);

			return;
		}

		await this._migrate();
	}
}
