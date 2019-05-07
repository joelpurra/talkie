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
    promiseTry,
} from "../shared/promise";

import {
    resolveVoiceAsMappedVoice,
} from "../shared/voices";

export default class VoiceLanguageManager {
    constructor(storageManager, metadataManager) {
        this.storageManager = storageManager;
        this.metadataManager = metadataManager;

        this.languageLanguageVoiceOverrideNamesStorageKey = "language-voice-overrides";
    }

    getLanguageVoiceDefault(languageName) {
        return promiseTry(
            () => {
                const mappedVoice = {
                    name: null,
                    lang: languageName,
                };

                return resolveVoiceAsMappedVoice(mappedVoice);
            }
        );
    }

    hasLanguageVoiceDefault(languageName) {
        return promiseTry(
            () => this.getLanguageVoiceDefault(languageName)
                .then((languageVoiceDefault) => {
                    if (languageVoiceDefault) {
                        return true;
                    }

                    return false;
                })
        );
    }

    _getLanguageLanguageVoiceOverrideNames() {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.getStoredValue(this.languageLanguageVoiceOverrideNamesStorageKey)
                            .then((languageLanguageVoiceOverrideNames) => {
                                if (languageLanguageVoiceOverrideNames !== null && typeof languageLanguageVoiceOverrideNames === "object") {
                                    return languageLanguageVoiceOverrideNames;
                                }

                                return {};
                            });
                    }

                    return {};
                })
        );
    }

    _setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames) {
        return promiseTry(
            () => this.metadataManager.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this.storageManager.setStoredValue(this.languageLanguageVoiceOverrideNamesStorageKey, languageLanguageVoiceOverrideNames);
                    }

                    return undefined;
                })
        );
    }

    getLanguageVoiceOverrideName(languageName) {
        return promiseTry(
            () => this._getLanguageLanguageVoiceOverrideNames()
                .then((languageLanguageVoiceOverrideNames) => {
                    return languageLanguageVoiceOverrideNames[languageName] || null;
                })
        );
    }

    setLanguageVoiceOverrideName(languageName, voiceName) {
        return promiseTry(
            () => this._getLanguageLanguageVoiceOverrideNames()
                .then((languageLanguageVoiceOverrideNames) => {
                    languageLanguageVoiceOverrideNames[languageName] = voiceName;

                    return this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
                })
        );
    }

    removeLanguageVoiceOverrideName(languageName) {
        return promiseTry(
            () => this._getLanguageLanguageVoiceOverrideNames()
                .then((languageLanguageVoiceOverrideNames) => {
                    delete languageLanguageVoiceOverrideNames[languageName];

                    return this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
                })
        );
    }

    hasLanguageVoiceOverrideName(languageName) {
        return promiseTry(
            () => this.getLanguageVoiceOverrideName(languageName)
                .then((languageVoiceOverride) => {
                    if (languageVoiceOverride) {
                        return true;
                    }

                    return false;
                })
        );
    }

    isLanguageVoiceOverrideName(languageName, voiceName) {
        return promiseTry(
            () => this.getLanguageVoiceOverrideName(languageName)
                .then((languageVoiceOverride) => {
                    if (languageVoiceOverride) {
                        return languageVoiceOverride === voiceName;
                    }

                    return false;
                })
        );
    }

    toggleLanguageVoiceOverrideName(languageName, voiceName) {
        return promiseTry(
            () => this.isLanguageVoiceOverrideName(languageName, voiceName)
                .then((isLanguageVoiceOverrideName) => {
                    if (isLanguageVoiceOverrideName) {
                        return this.removeLanguageVoiceOverrideName(languageName);
                    }

                    return this.setLanguageVoiceOverrideName(languageName, voiceName);
                })
        );
    }

    getEffectiveVoiceForLanguage(languageName) {
        return promiseTry(
            () => this.hasLanguageVoiceOverrideName(languageName)
                .then((hasLanguageVoiceOverrideName) => {
                    if (hasLanguageVoiceOverrideName) {
                        return this.getLanguageVoiceOverrideName(languageName)
                            .then((languageOverrideName) => {
                                const voice = {
                                    name: languageOverrideName,
                                    lang: null,
                                };

                                return voice;
                            });
                    }

                    return this.getLanguageVoiceDefault(languageName);
                })
        );
    }
}
