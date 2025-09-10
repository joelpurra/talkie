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

import {
	logDebug,
	logError,
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";

interface MigrationCounts {
	chromeStorageLocal: {
		after: number | null;
		before: number;
	};
	windowLocalStorage: {
		after: number | null;
		before: number;
	};
}

export default class StorageBackendMigrator {
	constructor(private readonly fromStorageProvider: IStorageProvider, private readonly toStorageProvider: IStorageProvider) {}

	async _migrate(): Promise<void> {
		const storageKeyCounts: MigrationCounts = {
			chromeStorageLocal: {
				after: null,
				before: await this.toStorageProvider.count(),
			},
			windowLocalStorage: {
				after: null,
				before: await this.fromStorageProvider.count(),
			},
		};

		try {
			const allWindowLocalStorage = await this.fromStorageProvider.getAll();

			await this.toStorageProvider.setAll(allWindowLocalStorage);

			// NOTE: skipping clearing window.localStorage for now; it doesn't matter if the data sticks around.
			//await this.fromStorageProvider.clear();
		} catch (error: unknown) {
			void logError(this.constructor.name, "_migrate", "Error during migration.", error);
		}

		storageKeyCounts.chromeStorageLocal.after = await this.toStorageProvider.count();
		storageKeyCounts.windowLocalStorage.after = await this.fromStorageProvider.count();

		void logInfo(this.constructor.name, "_migrate()", "Upgraded storage backend from window.localStorage to chrome.storage.local.", "Storage key counts", storageKeyCounts);
	}

	async migrateIfNecessary(): Promise<void> {
		const isChromeStorageLocalEmpty = await this.toStorageProvider.isEmpty();

		if (!isChromeStorageLocalEmpty) {
			const chromeStorageLocalCount = await this.toStorageProvider.count();
			const windowLocalStorageCount = await this.fromStorageProvider.count();

			void logDebug(
				this.constructor.name,
				"migrateIfNecessary()",
				`The chrome.storage.local contains data (${chromeStorageLocalCount} keys). Aborting window.localStorage data migration (${windowLocalStorageCount} keys).`,
			);

			return;
		}

		const isWindowLocalStorageEmpty = await this.fromStorageProvider.isEmpty();

		if (isWindowLocalStorageEmpty) {
			void logDebug(this.constructor.name, "migrateIfNecessary()", "The window.localStorage data is empty. Skipping window.localStorage data migration.");

			return;
		}

		await this._migrate();
	}
}
