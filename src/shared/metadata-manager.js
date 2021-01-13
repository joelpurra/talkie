/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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
} from "./promise";

export default class MetadataManager {
    constructor(manifestProvider, settingsManager) {
        this.manifestProvider = manifestProvider;
        this.settingsManager = settingsManager;

        this._editionTypePremium = "premium";
        this._editionTypeFree = "free";
        this._systemTypeChrome = "chrome";
        this._systemTypeWebExtension = "webextension";
    }

    isPremiumEdition() {
        return promiseTry(
            () => this.settingsManager.getIsPremiumEdition(),
        );
    }

    getExtensionId() {
        return promiseTry(
            () => browser.runtime.id,
        );
    }

    getManifestSync() {
        /* eslint-disable no-sync */
        return this.manifestProvider.getSync();
        /* eslint-enable no-sync */
    }

    getManifest() {
        return promiseTry(
            /* eslint-disable no-sync */
            () => this.getManifestSync(),
            /* eslint-enable no-sync */
        );
    }

    getVersionNumber() {
        return promiseTry(
            () => this.getManifest()
                .then((manifest) => {
                    return manifest.version || null;
                }),
        );
    }

    getVersionName() {
        return promiseTry(
            () => this.getManifest()
                .then((manifest) => {
                    return manifest.version_name || null;
                }),
        );
    }

    getEditionType() {
        return promiseTry(
            () => this.isPremiumEdition()
                .then((isPremiumEdition) => {
                    if (isPremiumEdition) {
                        return this._editionTypePremium;
                    }

                    return this._editionTypeFree;
                }),
        );
    }

    isChromeVersion() {
        return promiseTry(
            () => this.getVersionName()
                .then((versionName) => {
                    if (versionName.includes(" Chrome Extension ")) {
                        return true;
                    }

                    return false;
                }),
        );
    }

    isWebExtensionVersion() {
        return promiseTry(
            () => this.getVersionName()
                .then((versionName) => {
                    if (versionName.includes(" WebExtension ")) {
                        return true;
                    }

                    return false;
                }),
        );
    }

    getSystemType() {
        return promiseTry(
            () => this.isChromeVersion()
                .then((isChrome) => {
                    if (isChrome) {
                        return this._systemTypeChrome;
                    }

                    return this._systemTypeWebExtension;
                }),
        );
    }

    getOsType() {
        return promiseTry(
            () => browser.runtime.getPlatformInfo()
                .then((platformInfo) => {
                    if (platformInfo && typeof platformInfo.os === "string") {
                        // https://developer.chrome.com/extensions/runtime#type-PlatformOs
                        return platformInfo.os;
                    }

                    return null;
                }),
        );
    }
}
