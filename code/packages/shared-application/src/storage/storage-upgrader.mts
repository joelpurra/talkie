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

import type {
	JsonValue,
} from "type-fest";

import type StorageHelper from "./storage-helper.mjs";

import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";

import {
	allKnownStorageFormatVersions,
	allKnownStorageKeys,
	allKnownUpgradePaths,
	currentStorageFormatVersion,
	getStorageKey,
	type IStorageMetadata,
	type IStorageUpgrader,
	type StorageFormatVersion,
	type StorageKey,
	storageMetadataId,
} from "./storage-keys.mjs";

export default class StorageUpgrader {
	constructor(private readonly storageHelper: StorageHelper) {}

	async upgradeIfNecessary(): Promise<boolean> {
		try {
			void logDebug(this.constructor.name, "Start", "upgradeIfNecessary");

			await this._upgradeV1x0x0IfNecessary();

			const result = await this._upgradeIfNecessary(currentStorageFormatVersion);

			void logDebug(this.constructor.name, "Done", "upgradeIfNecessary");

			return result;
		} catch (error: unknown) {
			void logError(this.constructor.name, "upgradeIfNecessary", error);

			throw error;
		}
	}

	private async _createIdentityUpgrader(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion): Promise<IStorageUpgrader> {
		const identityUpgrader = async (key: StorageKey) => {
			const isStorageKeyValid = await this._isStorageKeyValid(fromStorageFormatVersion, key);

			if (!isStorageKeyValid) {
				return false;
			}

			const fromValue = await this.storageHelper.getStoredValue(fromStorageFormatVersion, key);

			if (fromValue === undefined || fromValue === null) {
				return false;
			}

			const toValue = fromValue;

			void logDebug(this.constructor.name, "_createIdentityUpgrader", "identityUpgrader", fromStorageFormatVersion, toStorageFormatVersion, key, fromValue, toValue);

			await this.storageHelper.setStoredValue(toStorageFormatVersion, key, toValue);

			return true;
		};

		return identityUpgrader;
	}

	private async _isStorageKeyValid(storageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<boolean> {
		try {
			await getStorageKey(storageFormatVersion, key);

			return true;
		} catch {
			// TODO: check for the specific storageKey errors.
			return false;
		}
	}

	private async _upgradeKey(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion, key: StorageKey): Promise<boolean> {
		const from = allKnownUpgradePaths[fromStorageFormatVersion];

		if (!from) {
			throw new RangeError(`Could not resolve "from" path for version: ${JSON.stringify(fromStorageFormatVersion)}`);
		}

		const to = from[toStorageFormatVersion];

		if (!to) {
			throw new RangeError(`Could not resolve "to" path for version: ${JSON.stringify(toStorageFormatVersion)}`);
		}

		const {
			upgradeType: upgradeKey,
		} = to;

		let upgrader: IStorageUpgrader;

		switch (upgradeKey) {
			case "identity": {
				upgrader = await this._createIdentityUpgrader(fromStorageFormatVersion, toStorageFormatVersion);

				break;
			}
		}

		return upgrader(key);
	}

	private async _upgrade(fromStorageFormatVersion: StorageFormatVersion, toStorageFormatVersion: StorageFormatVersion): Promise<boolean[]> {
		void logDebug(this.constructor.name, "_upgrade", fromStorageFormatVersion, toStorageFormatVersion);

		const storageKeysForVersion = Object.keys(allKnownStorageKeys[toStorageFormatVersion]);

		const upgradePromises = storageKeysForVersion.map(async (key) => this._upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key));

		const results = await Promise.all(upgradePromises);

		await this._setStorageMetadataAsInitialized(toStorageFormatVersion, fromStorageFormatVersion);

		return results;
	}

	private async _getStorageMetadata(storageFormatVersion: StorageFormatVersion): Promise<JsonValue> {
		return this.storageHelper.getStoredValue(storageFormatVersion, storageMetadataId);
	}

	private async _isStorageFormatVersionInitialized(storageFormatVersion: StorageFormatVersion): Promise<boolean> {
		const storageMetadata = await this._getStorageMetadata(storageFormatVersion);

		// TODO: verify metadata format.
		if (storageMetadata !== null) {
			return true;
		}

		return false;
	}

	private async _setStorageMetadataAsInitialized(storageFormatVersion: StorageFormatVersion, fromStorageFormatVersion: StorageFormatVersion | null): Promise<void> {
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion);

		if (storageFormatVersionIsInitialized) {
			throw new Error(`Already initialized: ${storageFormatVersion}`);
		}

		const storageMetadata: IStorageMetadata = {
			"upgraded-at": Date.now(),
			"upgraded-from-version": fromStorageFormatVersion,
			version: storageFormatVersion,
		};

		await this.storageHelper.setStoredValue(storageFormatVersion, storageMetadataId, storageMetadata);
	}

	private async _findUpgradeStep(toStorageFormatVersion: StorageFormatVersion): Promise<StorageFormatVersion | null> {
		return allKnownStorageFormatVersions
			.sort()
			.filter((knownStorageFormatVersion) => knownStorageFormatVersion !== toStorageFormatVersion)
			.reverse()
			.find((knownStorageFormatVersion) => {
				const known = allKnownUpgradePaths[knownStorageFormatVersion];

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
			}) ?? null;
	}

	private async _findUpgradeSteps(toStorageFormatVersion: StorageFormatVersion): Promise<Array<StorageFormatVersion | null>> {
		const upgradeSteps: Array<StorageFormatVersion | null> = [
			toStorageFormatVersion,
		];

		for (let countdown = 25; countdown > 0; countdown--) {
			const next = upgradeSteps.at(-1)!;

			// eslint-disable-next-line no-await-in-loop
			const upgradeStep: StorageFormatVersion | null = await this._findUpgradeStep(next);

			upgradeSteps.push(upgradeStep);

			if (!upgradeStep) {
				break;
			}
		}

		return upgradeSteps;
	}

	private async _findUpgradePath(toStorageFormatVersion: StorageFormatVersion): Promise<Array<StorageFormatVersion | null> | null> {
		const upgradeSteps: Array<StorageFormatVersion | null> = await this._findUpgradeSteps(toStorageFormatVersion);

		void logDebug(this.constructor.name, "_findUpgradePath", toStorageFormatVersion, upgradeSteps);

		if (upgradeSteps.length === 0) {
			return null;
		}

		const initializedVersionsLookups = await Promise.all(
			upgradeSteps
				.map(
					async (upgradeStep) => {
						if (!upgradeStep) {
							return null;
						}

						const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(upgradeStep);

						if (storageFormatVersionIsInitialized) {
							return upgradeStep;
						}

						return null;
					},
				),
		);

		const initializedVersions = initializedVersionsLookups
			.filter(Boolean);

		void logDebug(this.constructor.name, "_findUpgradePath", toStorageFormatVersion, upgradeSteps, initializedVersions);

		if (initializedVersions.length === 0) {
			return null;
		}

		const firstInitializedUpgradePath = initializedVersions[0];

		if (!firstInitializedUpgradePath) {
			return null;
		}

		const upgradePath = upgradeSteps
			.slice(0, upgradeSteps.indexOf(firstInitializedUpgradePath) + 1)
			.reverse();

		return upgradePath;
	}

	private async _upgradeIfNecessary(storageFormatVersion: StorageFormatVersion): Promise<boolean> {
		let result = false;
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion);

		if (!storageFormatVersionIsInitialized) {
			const firstInitializedUpgradePath = await this._findUpgradePath(storageFormatVersion);

			if (firstInitializedUpgradePath && firstInitializedUpgradePath.length >= 2) {
				let previous = firstInitializedUpgradePath[0] ?? null;

				for (const next of firstInitializedUpgradePath.slice(1)) {
					if (!previous) {
						throw new RangeError(`Unexpected empty element "previous": ${JSON.stringify(previous, null, 0)}.`);
					}

					if (!next) {
						throw new RangeError(`Unexpected empty element "next": ${JSON.stringify(next, null, 0)}.`);
					}

					// eslint-disable-next-line no-await-in-loop
					await this._upgrade(previous, next);

					previous = next;
				}

				result = true;
			}
		}

		return result;
	}

	private async _upgradeV1x0x0IfNecessary(): Promise<boolean> {
		const storageFormatVersion1x0x0 = "v1.0.0";
		const keyToCheck = "options-popup-donate-buttons-hide";

		// NOTE: return v1.0.0 as initialized if it had the single setting set,
		// as it didn't have initialization code yet.
		const storageFormatVersionIsInitialized = await this._isStorageFormatVersionInitialized(storageFormatVersion1x0x0);

		let result = false;

		if (!storageFormatVersionIsInitialized) {
			const storageValueToCheck = await this.storageHelper.getStoredValue(storageFormatVersion1x0x0, keyToCheck);

			if (storageValueToCheck !== null) {
				await this._setStorageMetadataAsInitialized(storageFormatVersion1x0x0, null);

				result = true;
			}
		}

		return result;
	}
}
