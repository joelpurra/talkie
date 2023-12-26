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
	logDebug,
	logError,
	logTrace,
} from "@talkie/shared-application-helpers/log.mjs";
import type IStorageProvider from "@talkie/split-environment-interfaces/istorage-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

export type StorageKey = string;
export type Upgrader = (key: StorageKey) => Promise<boolean>;
export type StorageFormatVersion =
| "v1.0.0"
| "v1.1.0"
| "v1.2.0"
| "v1.3.0"
| "v1.4.0"
| "v1.5.0"
| "v1.6.0"
| "v1.7.0";

export default class StorageManager {
	currentStorageFormatVersion: StorageFormatVersion = "v1.7.0";
	storageMetadataId = "_storage-metadata";
	allKnownStorageKeys: Record<StorageFormatVersion, Record<string, string>> = {
		"v1.0.0": {
			"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
		},
		"v1.1.0": {
			"language-voice-overrides": "language-voice-overrides",
			"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.2.0": {
			"language-voice-overrides": "language-voice-overrides",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.3.0": {
			"language-voice-overrides": "language-voice-overrides",
			"speak-long-texts": "speak-long-texts",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.4.0": {
			"is-premium-edition": "is-premium-edition",
			"language-voice-overrides": "language-voice-overrides",
			"speak-long-texts": "speak-long-texts",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.5.0": {
			"is-premium-edition": "is-premium-edition",
			"language-voice-overrides": "language-voice-overrides",
			"show-additional-details": "show-additional-details",
			"speak-long-texts": "speak-long-texts",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.6.0": {
			"is-premium-edition": "is-premium-edition",
			"language-voice-overrides": "language-voice-overrides",
			"show-additional-details": "show-additional-details",
			"speak-long-texts": "speak-long-texts",
			"speaking-history": "speaking-history",
			"speaking-history-limit": "speaking-history-limit",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
		"v1.7.0": {
			"is-premium-edition": "is-premium-edition",
			"language-voice-overrides": "language-voice-overrides",
			"show-additional-details": "show-additional-details",
			"speak-long-texts": "speak-long-texts",
			"speaking-history": "speaking-history",
			"speaking-history-limit": "speaking-history-limit",
			"stop-on-tab-removed": "stop-on-tab-removed",
			"stop-on-tab-updated-url": "stop-on-tab-updated-url",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		},
	};

	allKnownStorageFormatVersions: StorageFormatVersion[];
	allKnownUpgradePaths: Partial<Record<StorageFormatVersion, Partial<Record<StorageFormatVersion, {
		upgradeKey: Upgrader;
	}>>>>;

	constructor(private readonly storageProvider: IStorageProvider) {
		this.allKnownStorageFormatVersions = Object.keys(this.allKnownStorageKeys) as StorageFormatVersion[];
		this.allKnownStorageFormatVersions.sort();

		// TODO: sort by semantic version.
		const versionPartOutOfSortableRange = this.allKnownStorageFormatVersions.some((knownStorageFormatVersion) => knownStorageFormatVersion.split(".").some((versionPart) => Number.parseInt(versionPart, 10) >= 10));

		if (versionPartOutOfSortableRange) {
			throw new RangeError(`A storage version part was out of sortable range. Fix by implementing semantic version sorting. ${JSON.stringify(this.allKnownStorageFormatVersions)}`);
		}

		this.allKnownUpgradePaths = {
			"v1.0.0": {
				"v1.1.0": {
					upgradeKey: this._createIdentityUpgrader("v1.0.0", "v1.1.0"),
				},
				"v1.2.0": {
					upgradeKey: this._createIdentityUpgrader("v1.0.0", "v1.2.0"),
				},
			},
			"v1.1.0": {
				"v1.2.0": {
					upgradeKey: this._createIdentityUpgrader("v1.1.0", "v1.2.0"),
				},
			},
			"v1.2.0": {
				"v1.3.0": {
					upgradeKey: this._createIdentityUpgrader("v1.2.0", "v1.3.0"),
				},
			},
			"v1.3.0": {
				"v1.4.0": {
					upgradeKey: this._createIdentityUpgrader("v1.3.0", "v1.4.0"),
				},
			},
			"v1.4.0": {
				"v1.5.0": {
					upgradeKey: this._createIdentityUpgrader("v1.4.0", "v1.5.0"),
				},
			},
			"v1.5.0": {
				"v1.6.0": {
					upgradeKey: this._createIdentityUpgrader("v1.5.0", "v1.6.0"),
				},
			},
		};
	}

	async _getStorageKey(storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<string> {
		if (!this.allKnownStorageKeys[storageFormatVersion]) {
			throw new Error(`Unknown storage format version: (${storageFormatVersion})`);
		}

		if (key !== this.storageMetadataId && !this.allKnownStorageKeys[storageFormatVersion][key]) {
			throw new Error(`Unknown storage key (${storageFormatVersion}): ${key}`);
		}

		return `${storageFormatVersion}_${key}`;
	}

	async _isStorageKeyValid(storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<boolean> {
		try {
			await this._getStorageKey(storageFormatVersion, key);

			return true;
		} catch {
			// TODO: check for the specific storageKey errors.
			return false;
		}
	}

	async _setStoredValue<T extends JsonValue>(storageFormatVersion: StorageFormatVersion, key: StorageKey, value: T): Promise<void> {
		void logTrace("Start", "_setStoredValue", storageFormatVersion, key, typeof value, value);

		const storageKey = await this._getStorageKey(storageFormatVersion, key);

		// TODO: assert type at runtime.
		await this.storageProvider.set<T>(storageKey, value);

		void logTrace("Done", "_setStoredValue", storageFormatVersion, key, typeof value, value);
	}

	async setStoredValue<T extends JsonValue>(key: StorageKey, value: T): Promise<void> {
		void logDebug("Start", "setStoredValue", key, typeof value, value);

		await this._setStoredValue<T>(this.currentStorageFormatVersion, key, value);

		void logDebug("Done", "setStoredValue", key, typeof value, value);
	}

	async _getStoredValue<T extends JsonValue>(storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<T | null> {
		void logTrace("Start", "_getStoredValue", storageFormatVersion, key);

		const storageKey = await this._getStorageKey(storageFormatVersion, key);

		// TODO: assert type at runtime.
		const value = await this.storageProvider.get<T>(storageKey);

		void logTrace("Done", "_getStoredValue", storageFormatVersion, key, value);

		return value;
	}

	async getStoredValue<T extends JsonValue>(key: StorageKey): Promise<T | null> {
		void logTrace("Start", "getStoredValue", key);

		const value = await this._getStoredValue<T>(this.currentStorageFormatVersion, key);

		void logTrace("Done", "getStoredValue", key, value);

		return value;
	}

	async _upgradeKey(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<boolean> {
		const from = this.allKnownUpgradePaths[fromStorageFormatVersion];

		if (!from) {
			throw new RangeError(`Could not resolve "from" path for version: ${JSON.stringify(fromStorageFormatVersion)}`);
		}

		const to = from[toStorageFormatVersion];

		if (!to) {
			throw new RangeError(`Could not resolve "to" path for version: ${JSON.stringify(toStorageFormatVersion)}`);
		}

		return to.upgradeKey(key);
	}

	async _upgrade(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion): Promise<boolean[]> {
		const storageKeysForVersion = Object.keys(this.allKnownStorageKeys[toStorageFormatVersion]);

		const upgradePromises = storageKeysForVersion.map(async (key) => this._upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key));

		return Promise.all(upgradePromises);
	}

	async _getStorageMetadata(storageFormatVersion: StorageFormatVersion): Promise<JsonValue> {
		return this._getStoredValue(storageFormatVersion, this.storageMetadataId);
	}

	async _isStorageFormatVersionInitialized(storageFormatVersion: StorageFormatVersion): Promise<boolean> {
		const storageMetadata = await this._getStorageMetadata(storageFormatVersion);

		if (storageMetadata !== null) {
			return true;
		}

		return false;
	}

	async _setStorageMetadataAsInitialized(storageFormatVersion: StorageFormatVersion, fromStorageFormatVersion: StorageFormatVersion | null): Promise<void> {
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion);

		if (storageFormatVersionIsInitialized) {
			throw new Error(`Already initialized: ${storageFormatVersion}`);
		}

		const storageMetadata = {
			"upgraded-at": Date.now(),
			"upgraded-from-version": fromStorageFormatVersion,
			version: storageFormatVersion,
		};

		await this._setStoredValue(storageFormatVersion, this.storageMetadataId, storageMetadata);
	}

	async _findUpgradePaths(toStorageFormatVersion: StorageFormatVersion): Promise<StorageFormatVersion[]> {
		return this.allKnownStorageFormatVersions
			.filter((knownStorageFormatVersion) => knownStorageFormatVersion !== toStorageFormatVersion)
			.reverse()
			.filter((knownStorageFormatVersion) => {
				const known = this.allKnownUpgradePaths[knownStorageFormatVersion];

				if (!known) {
					return false;
				}

				if (!known[toStorageFormatVersion]) {
					return false;
				}

				const upgradePath = known[toStorageFormatVersion];

				if (upgradePath) {
					return true;
				}

				return false;
			});
	}

	async _findUpgradePath(toStorageFormatVersion: StorageFormatVersion): Promise<StorageFormatVersion | null> {
		const upgradePaths = await this._findUpgradePaths(toStorageFormatVersion);

		if (!upgradePaths || !Array.isArray(upgradePaths) || upgradePaths.length === 0) {
			return null;
		}

		const possiblyInitializedUpgradePaths = await Promise.all(
			upgradePaths.map(
				async (upgradePath) => {
					const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(upgradePath);

					if (storageFormatVersionIsInitialized) {
						return upgradePath;
					}

					return null;
				},
			),
		);

		const initializedUpgradePaths = possiblyInitializedUpgradePaths
			.filter(Boolean);

		if (initializedUpgradePaths.length === 0) {
			return null;
		}

		const firstInitializedUpgradePath = initializedUpgradePaths[0];

		if (!firstInitializedUpgradePath) {
			return null;
		}

		return firstInitializedUpgradePath;
	}

	async _upgradeIfNecessary(storageFormatVersion: StorageFormatVersion): Promise<boolean> {
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion);

		if (!storageFormatVersionIsInitialized) {
			const firstInitializedUpgradePath = await this._findUpgradePath(storageFormatVersion);

			let result = null;

			if (firstInitializedUpgradePath) {
				await this._upgrade(firstInitializedUpgradePath, storageFormatVersion);

				result = true;
			} else {
				result = false;
			}

			await this._setStorageMetadataAsInitialized(storageFormatVersion, firstInitializedUpgradePath);

			return result;
		}

		return false;
	}

	async _upgradeV1x0x0IfNecessary(): Promise<boolean> {
		const storageFormatVersion1x0x0 = "v1.0.0";
		const keyToCheck = "options-popup-donate-buttons-hide";

		// NOTE: return v1.0.0 as initialized if it had the single setting set,
		// as it didn't have initialization code yet.
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion1x0x0);

		let result = false;

		if (!storageFormatVersionIsInitialized) {
			const storageValueToCheck = await this._getStoredValue(storageFormatVersion1x0x0, keyToCheck);

			if (storageValueToCheck !== null) {
				await this._setStorageMetadataAsInitialized(storageFormatVersion1x0x0, null);

				result = true;
			}
		}

		return result;
	}

	async upgradeIfNecessary(): Promise<boolean> {
		try {
			void logDebug("Start", "upgradeIfNecessary");

			await this._upgradeV1x0x0IfNecessary();

			const result = await this._upgradeIfNecessary(this.currentStorageFormatVersion);

			void logDebug("Done", "upgradeIfNecessary");

			return result;
		} catch (error: unknown) {
			void logError("upgradeIfNecessary", error);

			throw error;
		}
	}

	private _createIdentityUpgrader(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion): Upgrader {
		const identityUpgrader = async (key: StorageKey) => {
			const isStorageKeyValid = await this._isStorageKeyValid(fromStorageFormatVersion, key);

			if (!isStorageKeyValid) {
				return false;
			}

			const fromValue = await this._getStoredValue(fromStorageFormatVersion, key);

			if (fromValue === undefined || fromValue === null) {
				return false;
			}

			const toValue = fromValue;

			await this._setStoredValue(toStorageFormatVersion, key, toValue);

			return true;
		};

		return identityUpgrader;
	}
}
