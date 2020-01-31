/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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
} from "../shared/log";

import {
    promiseTry,
} from "../shared/promise";

import {
    getBackgroundPage,
} from "../shared/tabs";

export default class StorageManager {
    constructor() {
        this.currentStorageFormatVersion = "v1.3.0";

        this.storageMetadataId = "_storage-metadata";

        this.allKnownStorageKeys = {};

        this.allKnownStorageKeys["v1.0.0"] = {
            "options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
        };

        this.allKnownStorageKeys["v1.1.0"] = {
            "options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
            "language-voice-overrides": "language-voice-overrides",
            "voice-rate-overrides": "voice-rate-overrides",
            "voice-pitch-overrides": "voice-pitch-overrides",
        };

        this.allKnownStorageKeys["v1.2.0"] = {
            "language-voice-overrides": "language-voice-overrides",
            "voice-rate-overrides": "voice-rate-overrides",
            "voice-pitch-overrides": "voice-pitch-overrides",
        };

        this.allKnownStorageKeys["v1.3.0"] = {
            "language-voice-overrides": "language-voice-overrides",
            "voice-rate-overrides": "voice-rate-overrides",
            "voice-pitch-overrides": "voice-pitch-overrides",
            "speak-long-texts": "speak-long-texts",
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
    }

    _getStorageKey(storageFormatVersion, key) {
        return promiseTry(
            () => {
                if (!this.allKnownStorageKeys[storageFormatVersion]) {
                    throw new Error(`Unknown storage format version: (${storageFormatVersion})`);
                }

                if (key !== this.storageMetadataId && !this.allKnownStorageKeys[storageFormatVersion][key]) {
                    throw new Error(`Unknown storage key (${storageFormatVersion}): ${key}`);
                }

                return `${storageFormatVersion}_${key}`;
            },
        );
    }

    _isStorageKeyValid(storageFormatVersion, key) {
        return promiseTry(
            () => {
                return this._getStorageKey(storageFormatVersion, key)
                    .then(() => {
                        return true;
                    })
                    .catch(() => {
                        // TODO: check for the specific storageKey errors.
                        return false;
                    });
            },
        );
    }

    _setStoredValue(storageFormatVersion, key, value) {
        return promiseTry(
            () => {
                logDebug("Start", "_setStoredValue", storageFormatVersion, key, typeof value, value);

                return this._getStorageKey(storageFormatVersion, key)
                    .then((storageKey) => {
                        const valueJson = JSON.stringify(value);

                        return getBackgroundPage()
                            .then((background) => {
                                background.localStorage.setItem(storageKey, valueJson);

                                logDebug("Done", "_setStoredValue", storageFormatVersion, key, typeof value, value);

                                return undefined;
                            });
                    });
            },
        );
    }

    setStoredValue(key, value) {
        return promiseTry(
            () => {
                logDebug("Start", "setStoredValue", key, typeof value, value);

                return this._setStoredValue(this.currentStorageFormatVersion, key, value)
                    .then(() => {
                        logDebug("Done", "setStoredValue", key, typeof value, value);

                        return undefined;
                    });
            },
        );
    }

    _getStoredValue(storageFormatVersion, key) {
        return promiseTry(
            () => {
                logDebug("Start", "_getStoredValue", storageFormatVersion, key);

                return this._getStorageKey(storageFormatVersion, key)
                    .then((storageKey) => {
                        return getBackgroundPage()
                            .then((background) => {
                                const valueJson = background.localStorage.getItem(storageKey);

                                if (valueJson === null) {
                                    logDebug("Done", "_getStoredValue", storageFormatVersion, key, null);

                                    return null;
                                }

                                const value = JSON.parse(valueJson);

                                logDebug("Done", "_getStoredValue", storageFormatVersion, key, value);

                                return value;
                            });
                    });
            },
        );
    }

    getStoredValue(key) {
        return promiseTry(
            () => {
                logDebug("Start", "getStoredValue", key);

                return this._getStoredValue(this.currentStorageFormatVersion, key)
                    .then((value) => {
                        logDebug("Done", "getStoredValue", key, value);

                        return value;
                    });
            },
        );
    }

    _createIdentityUpgrader(fromStorageFormatVersion, toStorageFormatVersion) {
        const identityUpgrader = (key) => promiseTry(
            () => {
                return this._isStorageKeyValid(fromStorageFormatVersion, key)
                    .then((isStorageKeyValid) => {
                        if (!isStorageKeyValid) {
                            return false;
                        }

                        return this._getStoredValue(fromStorageFormatVersion, key)
                            .then((fromValue) => {
                                if (fromValue === undefined || fromValue === null) {
                                    return false;
                                }

                                const toValue = fromValue;

                                return this._setStoredValue(toStorageFormatVersion, key, toValue)
                                    .then(() => true);
                            });
                    });
            },
        );

        return identityUpgrader;
    }

    _upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key) {
        return this.allKnownUpgradePaths[fromStorageFormatVersion][toStorageFormatVersion].upgradeKey(key);
    }

    _upgrade(fromStorageFormatVersion, toStorageFormatVersion) {
        return promiseTry(
            () => {
                const storageKeysForVersion = Object.keys(this.allKnownStorageKeys[toStorageFormatVersion]);

                const upgradePromises = storageKeysForVersion.map((key) => this._upgradeKey(fromStorageFormatVersion, toStorageFormatVersion, key));

                return Promise.all(upgradePromises);
            },
        );
    }

    _getStorageMetadata(storageFormatVersion) {
        return promiseTry(
            () => {
                return this._getStoredValue(storageFormatVersion, this.storageMetadataId);
            },
        );
    }

    _isStorageFormatVersionInitialized(storageFormatVersion) {
        return promiseTry(
            () => {
                return this._getStorageMetadata(storageFormatVersion)
                    .then((storageMetadata) => {
                        if (storageMetadata !== null) {
                            return true;
                        }

                        return false;
                    });
            },
        );
    }

    _setStorageMetadataAsInitialized(storageFormatVersion, fromStorageFormatVersion) {
        return promiseTry(
            () => {
                return this._isStorageFormatVersionInitialized(storageFormatVersion)
                    .then((storageFormatVersionIsInitialized) => {
                        if (storageFormatVersionIsInitialized) {
                            throw new Error(`Already initialized: ${storageFormatVersion}`);
                        }

                        return undefined;
                    })
                    .then(() => {
                        const storageMetadata = {
                            version: storageFormatVersion,
                            "upgraded-from-version": fromStorageFormatVersion,
                            "upgraded-at": Date.now(),
                        };

                        return this._setStoredValue(storageFormatVersion, this.storageMetadataId, storageMetadata);
                    });
            },
        );
    }

    _findUpgradePaths(toStorageFormatVersion) {
        return promiseTry(
            () => {
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
            },
        );
    }

    _findUpgradePath(toStorageFormatVersion) {
        return promiseTry(
            () => {
                return this._findUpgradePaths(toStorageFormatVersion)
                    .then((upgradePaths) => {
                        if (!upgradePaths || !Array.isArray(upgradePaths) || upgradePaths.length === 0) {
                            return null;
                        }

                        const possiblyInitializedUpgradePathPromises = upgradePaths.map((upgradePath) => {
                            return this._isStorageFormatVersionInitialized(upgradePath)
                                .then((storageFormatVersionIsInitialized) => {
                                    if (storageFormatVersionIsInitialized) {
                                        return upgradePath;
                                    }

                                    return null;
                                });
                        });

                        return Promise.all(possiblyInitializedUpgradePathPromises)
                            .then((possiblyInitializedUpgradePaths) => {
                                return possiblyInitializedUpgradePaths
                                    .filter((possiblyInitializedUpgradePath) => !!possiblyInitializedUpgradePath);
                            })
                            .then((initializedUpgradePaths) => {
                                if (initializedUpgradePaths.length === 0) {
                                    return null;
                                }

                                const firstInitializedUpgradePath = initializedUpgradePaths[0];

                                return firstInitializedUpgradePath;
                            });
                    });
            },
        );
    }

    _upgradeIfNecessary(storageFormatVersion) {
        return promiseTry(
            () => {
                return this._isStorageFormatVersionInitialized(storageFormatVersion)
                    .then((storageFormatVersionIsInitialized) => {
                        if (!storageFormatVersionIsInitialized) {
                            return this._findUpgradePath(storageFormatVersion)
                                .then((firstInitializedUpgradePath) => {
                                    return promiseTry(
                                        () => {
                                            if (!firstInitializedUpgradePath) {
                                                return false;
                                            }

                                            return this._upgrade(firstInitializedUpgradePath, storageFormatVersion)
                                                .then(() => true);
                                        })
                                        .then((result) => {
                                            this._setStorageMetadataAsInitialized(storageFormatVersion, firstInitializedUpgradePath);

                                            return result;
                                        });
                                });
                        }

                        return false;
                    });
            },
        );
    }

    _upgradeV1x0x0IfNecessary() {
        return promiseTry(
            () => {
                const storageFormatVersion1x0x0 = "v1.0.0";
                const keyToCheck = "options-popup-donate-buttons-hide";

                // NOTE: return v1.0.0 as initialized if it had the single setting set,
                // as it didn't have initialization code yet.
                return this._isStorageFormatVersionInitialized(storageFormatVersion1x0x0)
                    .then((storageFormatVersionIsInitialized) => {
                        if (!storageFormatVersionIsInitialized) {
                            return this._getStoredValue(storageFormatVersion1x0x0, keyToCheck)
                                .then((storageValueToCheck) => {
                                    if (storageValueToCheck !== null) {
                                        return this._setStorageMetadataAsInitialized(storageFormatVersion1x0x0, null)
                                            .then(() => true);
                                    }

                                    return false;
                                });
                        }

                        return false;
                    });
            },
        );
    }

    upgradeIfNecessary() {
        return promiseTry(
            () => {
                logDebug("Start", "upgradeIfNecessary");

                return this._upgradeV1x0x0IfNecessary()
                    .then(() => this._upgradeIfNecessary(this.currentStorageFormatVersion))
                    .then((result) => {
                        logDebug("Done", "upgradeIfNecessary");

                        return result;
                    })
                    .catch((error) => {
                        logError("upgradeIfNecessary", error);

                        throw error;
                    });
            },
        );
    }
}
