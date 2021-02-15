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
} from "./log";

export default class StorageManager {
	constructor(storageProvider) {
		this.storageProvider = storageProvider;

		this.currentStorageFormatVersion = "v1.4.0";

		this.storageMetadataId = "_storage-metadata";

		this.allKnownStorageKeys = {};

		this.allKnownStorageKeys["v1.0.0"] = {
			"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
		};

		this.allKnownStorageKeys["v1.1.0"] = {
			"language-voice-overrides": "language-voice-overrides",
			"options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		};

		this.allKnownStorageKeys["v1.2.0"] = {
			"language-voice-overrides": "language-voice-overrides",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		};

		this.allKnownStorageKeys["v1.3.0"] = {
			"language-voice-overrides": "language-voice-overrides",
			"speak-long-texts": "speak-long-texts",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		};

		this.allKnownStorageKeys["v1.4.0"] = {
			"is-premium-edition": "is-premium-edition",
			"language-voice-overrides": "language-voice-overrides",
			"speak-long-texts": "speak-long-texts",
			"voice-pitch-overrides": "voice-pitch-overrides",
			"voice-rate-overrides": "voice-rate-overrides",
		};

		// TODO: sort by semantic version.
		this.allKnownStorageFormatVersions = Object.keys(this.allKnownStorageKeys);
		this.allKnownStorageFormatVersions.sort();

		this.allKnownUpgradePaths = {};
		this.allKnownUpgradePaths["v1.0.0"] = {};
		this.allKnownUpgradePaths["v1.0.0"]["v1.1.0"] = {
			upgradeKey: this._createIdentityUpgrader("v1.0.0", "v1.1.0"),
		};
		this.allKnownUpgradePaths["v1.0.0"]["v1.2.0"] = {
			upgradeKey: this._createIdentityUpgrader("v1.0.0", "v1.2.0"),
		};
		this.allKnownUpgradePaths["v1.1.0"] = {};
		this.allKnownUpgradePaths["v1.1.0"]["v1.2.0"] = {
			upgradeKey: this._createIdentityUpgrader("v1.1.0", "v1.2.0"),
		};
		this.allKnownUpgradePaths["v1.2.0"] = {};
		this.allKnownUpgradePaths["v1.2.0"]["v1.3.0"] = {
			upgradeKey: this._createIdentityUpgrader("v1.2.0", "v1.3.0"),
		};
		this.allKnownUpgradePaths["v1.3.0"] = {};
		this.allKnownUpgradePaths["v1.3.0"]["v1.4.0"] = {
			upgradeKey: this._createIdentityUpgrader("v1.3.0", "v1.4.0"),
		};
	}

	async _getStorageKey(storageFormatVersion, key) {
		if (!this.allKnownStorageKeys[storageFormatVersion]) {
			throw new Error(`Unknown storage format version: (${storageFormatVersion})`);
		}

		if (key !== this.storageMetadataId && !this.allKnownStorageKeys[storageFormatVersion][key]) {
			throw new Error(`Unknown storage key (${storageFormatVersion}): ${key}`);
		}

		return `${storageFormatVersion}_${key}`;
	}

	async _isStorageKeyValid(storageFormatVersion, key) {
		try {
			await this._getStorageKey(storageFormatVersion, key);

			return true;
		} catch {
			// TODO: check for the specific storageKey errors.
			return false;
		}
	}

	async _setStoredValue(storageFormatVersion, key, value) {
		logTrace("Start", "_setStoredValue", storageFormatVersion, key, typeof value, value);

		const storageKey = await this._getStorageKey(storageFormatVersion, key);

		await this.storageProvider.set(storageKey, value);

		logTrace("Done", "_setStoredValue", storageFormatVersion, key, typeof value, value);
	}

	async setStoredValue(key, value) {
		logDebug("Start", "setStoredValue", key, typeof value, value);

		await this._setStoredValue(this.currentStorageFormatVersion, key, value);

		logDebug("Done", "setStoredValue", key, typeof value, value);
	}

	async _getStoredValue(storageFormatVersion, key) {
		logTrace("Start", "_getStoredValue", storageFormatVersion, key);

		const storageKey = await this._getStorageKey(storageFormatVersion, key);

		const value = await this.storageProvider.get(storageKey);

		logTrace("Done", "_getStoredValue", storageFormatVersion, key, value);

		return value;
	}

	async getStoredValue(key) {
		logTrace("Start", "getStoredValue", key);

		const value = await this._getStoredValue(this.currentStorageFormatVersion, key);

		logTrace("Done", "getStoredValue", key, value);

		return value;
	}

	_createIdentityUpgrader(fromStorageFormatVersion, toStorageFormatVersion) {
		const identityUpgrader = async (key) => {
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

	_upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key) {
		return this.allKnownUpgradePaths[fromStorageFormatVersion][toStorageFormatVersion].upgradeKey(key);
	}

	async _upgrade(fromStorageFormatVersion, toStorageFormatVersion) {
		const storageKeysForVersion = Object.keys(this.allKnownStorageKeys[toStorageFormatVersion]);

		const upgradePromises = storageKeysForVersion.map((key) => this._upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key));

		return Promise.all(upgradePromises);
	}

	async _getStorageMetadata(storageFormatVersion) {
		return this._getStoredValue(storageFormatVersion, this.storageMetadataId);
	}

	async _isStorageFormatVersionInitialized(storageFormatVersion) {
		const storageMetadata = await this._getStorageMetadata(storageFormatVersion);

		if (storageMetadata !== null) {
			return true;
		}

		return false;
	}

	async _setStorageMetadataAsInitialized(storageFormatVersion, fromStorageFormatVersion) {
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion);

		if (storageFormatVersionIsInitialized) {
			throw new Error(`Already initialized: ${storageFormatVersion}`);
		}

		const storageMetadata = {
			"upgraded-at": Date.now(),
			"upgraded-from-version": fromStorageFormatVersion,
			version: storageFormatVersion,
		};

		return this._setStoredValue(storageFormatVersion, this.storageMetadataId, storageMetadata);
	}

	async _findUpgradePaths(toStorageFormatVersion) {
		return this.allKnownStorageFormatVersions
			.filter((knownStorageFormatVersion) => knownStorageFormatVersion !== toStorageFormatVersion)
			.reverse()
			.filter((knownStorageFormatVersion) => {
				if (!this.allKnownUpgradePaths[knownStorageFormatVersion]) {
					return false;
				}

				if (!this.allKnownUpgradePaths[knownStorageFormatVersion][toStorageFormatVersion]) {
					return false;
				}

				const upgradePath = this.allKnownUpgradePaths[knownStorageFormatVersion][toStorageFormatVersion];

				if (upgradePath) {
					return true;
				}

				return false;
			});
	}

	async _findUpgradePath(toStorageFormatVersion) {
		const upgradePaths = await this._findUpgradePaths(toStorageFormatVersion);

		if (!upgradePaths || !Array.isArray(upgradePaths) || upgradePaths.length === 0) {
			return null;
		}

		// TODO: switch to bluebird for async/promise mapping, also for the browser?
		const possiblyInitializedUpgradePathPromises = upgradePaths.map(
			(upgradePath) => (async () => {
				const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(upgradePath);

				if (storageFormatVersionIsInitialized) {
					return upgradePath;
				}

				return null;
			})(),
		);

		const possiblyInitializedUpgradePaths = await Promise.all(possiblyInitializedUpgradePathPromises);
		const initializedUpgradePaths = possiblyInitializedUpgradePaths
			.filter((possiblyInitializedUpgradePath) => Boolean(possiblyInitializedUpgradePath));

		if (initializedUpgradePaths.length === 0) {
			return null;
		}

		const firstInitializedUpgradePath = initializedUpgradePaths[0];

		return firstInitializedUpgradePath;
	}

	async _upgradeIfNecessary(storageFormatVersion) {
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

	async _upgradeV1x0x0IfNecessary() {
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

	async upgradeIfNecessary() {
		try {
			logDebug("Start", "upgradeIfNecessary");

			await this._upgradeV1x0x0IfNecessary();

			const result = await this._upgradeIfNecessary(this.currentStorageFormatVersion);

			logDebug("Done", "upgradeIfNecessary");

			return result;
		} catch (error) {
			logError("upgradeIfNecessary", error);

			throw error;
		}
	}
}
