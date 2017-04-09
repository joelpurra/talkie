/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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
    promiseTry,
} from "../shared/promise";

import {
    rateRange,
} from "../shared/voices";

export default class VoiceRateManager {
    constructor(storageManager, metadataManager) {
        this.storageManager = storageManager;
        this.metadataManager = metadataManager;

        this.voiceRateRateOverridesStorageKey = "voice-rate-overrides";
    }

    getVoiceRateDefault(/* eslint-disable no-unused-vars */voiceName/* eslint-enable no-unused-vars */) {
        return promiseTry(
            // TODO: initialize a "real" synthesizer voice, then read out the rate value.
            () => rateRange.default
        );
    }

    hasVoiceRateDefault(voiceName) {
        return promiseTry(
            () => this.getVoiceRateDefault(voiceName)
                .then((voiceRateDefault) => {
                    if (voiceRateDefault) {
                        return true;
                    }

                    return false;
                })
        );
    }

    _getVoiceRateOverrides() {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.getStoredValue(this.voiceRateRateOverridesStorageKey)
                            .then((voiceRateRateOverrides) => {
                                if (voiceRateRateOverrides !== null && typeof voiceRateRateOverrides === "object") {
                                    return voiceRateRateOverrides;
                                }

                                return {};
                            });
                    }

                    return {};
                })
        );
    }

    _setVoiceRateOverrides(voiceRateRateOverrides) {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.setStoredValue(this.voiceRateRateOverridesStorageKey, voiceRateRateOverrides);
                    }

                    return undefined;
                })
            );
    }

    getVoiceRateOverride(voiceName) {
        return promiseTry(
            () => this._getVoiceRateOverrides()
                .then((voiceRateRateOverrides) => {
                    return voiceRateRateOverrides[voiceName] || null;
                })
        );
    }

    setVoiceRateOverride(voiceName, rate) {
        return promiseTry(
            () => this._getVoiceRateOverrides()
                .then((voiceRateRateOverrides) => {
                    voiceRateRateOverrides[voiceName] = rate;

                    return this._setVoiceRateOverrides(voiceRateRateOverrides);
                })
        );
    }

    removeVoiceRateOverride(voiceName) {
        return promiseTry(
            () => this._getVoiceRateOverrides()
                .then((voiceRateRateOverrides) => {
                    delete voiceRateRateOverrides[voiceName];

                    return this._setVoiceRateOverrides(voiceRateRateOverrides);
                })
        );
    }

    hasVoiceRateOverride(voiceName) {
        return promiseTry(
                () => this.getVoiceRateOverride(voiceName)
                    .then((voiceRateOverride) => {
                        if (voiceRateOverride) {
                            return true;
                        }

                        return false;
                    })
            );
    }

    isVoiceRateOverride(voiceName, rate) {
        return promiseTry(
                () => this.getVoiceRateOverride(voiceName)
                    .then((voiceRateOverride) => {
                        if (voiceRateOverride) {
                            return voiceRateOverride === rate;
                        }

                        return false;
                    })
            );
    }

    getEffectiveRateForVoice(voiceName) {
        return promiseTry(
            () => this.hasVoiceRateOverride(voiceName)
                .then((hasVoiceRateOverride) => {
                    if (hasVoiceRateOverride) {
                        return this.getVoiceRateOverride(voiceName);
                    }

                    return this.getVoiceRateDefault(voiceName);
                })
        );
    }
}
