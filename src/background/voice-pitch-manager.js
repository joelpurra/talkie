/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

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
    pitchRange,
} from "../shared/voices";

export default class VoicePitchManager {
    constructor(storageManager, metadataManager) {
        this.storageManager = storageManager;
        this.metadataManager = metadataManager;

        this.voicePitchPitchOverridesStorageKey = "voice-pitch-overrides";
    }

    getVoicePitchDefault(/* eslint-disable no-unused-vars */voiceName/* eslint-enable no-unused-vars */) {
        return promiseTry(
            // TODO: initialize a "real" synthesizer voice, then read out the pitch value.
            () => pitchRange.default
        );
    }

    hasVoicePitchDefault(voiceName) {
        return promiseTry(
            () => this.getVoicePitchDefault(voiceName)
                .then((voicePitchDefault) => {
                    if (voicePitchDefault) {
                        return true;
                    }

                    return false;
                })
        );
    }

    _getVoicePitchOverrides() {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.getStoredValue(this.voicePitchPitchOverridesStorageKey)
                            .then((voicePitchPitchOverrides) => {
                                if (voicePitchPitchOverrides !== null && typeof voicePitchPitchOverrides === "object") {
                                    return voicePitchPitchOverrides;
                                }

                                return {};
                            });
                    }

                    return {};
                })
        );
    }

    _setVoicePitchOverrides(voicePitchPitchOverrides) {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.setStoredValue(this.voicePitchPitchOverridesStorageKey, voicePitchPitchOverrides);
                    }

                    return undefined;
                })
            );
    }

    getVoicePitchOverride(voiceName) {
        return promiseTry(
            () => this._getVoicePitchOverrides()
                .then((voicePitchPitchOverrides) => {
                    return voicePitchPitchOverrides[voiceName] || null;
                })
        );
    }

    setVoicePitchOverride(voiceName, pitch) {
        return promiseTry(
            () => this._getVoicePitchOverrides()
                .then((voicePitchPitchOverrides) => {
                    voicePitchPitchOverrides[voiceName] = pitch;

                    return this._setVoicePitchOverrides(voicePitchPitchOverrides);
                })
        );
    }

    removeVoicePitchOverride(voiceName) {
        return promiseTry(
            () => this._getVoicePitchOverrides()
                .then((voicePitchPitchOverrides) => {
                    delete voicePitchPitchOverrides[voiceName];

                    return this._setVoicePitchOverrides(voicePitchPitchOverrides);
                })
        );
    }

    hasVoicePitchOverride(voiceName) {
        return promiseTry(
                () => this.getVoicePitchOverride(voiceName)
                    .then((voicePitchOverride) => {
                        if (voicePitchOverride) {
                            return true;
                        }

                        return false;
                    })
            );
    }

    isVoicePitchOverride(voiceName, pitch) {
        return promiseTry(
                () => this.getVoicePitchOverride(voiceName)
                    .then((voicePitchOverride) => {
                        if (voicePitchOverride) {
                            return voicePitchOverride === pitch;
                        }

                        return false;
                    })
            );
    }

    getEffectivePitchForVoice(voiceName) {
        return promiseTry(
            () => this.hasVoicePitchOverride(voiceName)
                .then((hasVoicePitchOverride) => {
                    if (hasVoicePitchOverride) {
                        return this.getVoicePitchOverride(voiceName);
                    }

                    return this.getVoicePitchDefault(voiceName);
                })
        );
    }
}
