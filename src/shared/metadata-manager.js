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

export default class MetadataManager {
    constructor(manifestProvider) {
        this.manifestProvider = manifestProvider;

        this._versionTypePremium = "premium";
        this._versionTypeFree = "free";
        this._systemTypeChrome = "chrome";
        this._systemTypeWebExtension = "webextension";
    }

    getExtensionId() {
        return promiseTry(
            () => browser.runtime.id
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
            () => this.getManifestSync()
            /* eslint-enable no-sync */
        );
    }

    getVersionNumber() {
        return promiseTry(
            () => this.getManifest()
                .then((manifest) => {
                    return manifest.version || null;
                })
        );
    }

    getVersionName() {
        return promiseTry(
            () => this.getManifest()
                .then((manifest) => {
                    return manifest.version_name || null;
                })
        );
    }

    getVersionNameSync() {
        /* eslint-disable no-sync */
        const manifest = this.getManifestSync();
        /* eslint-enable no-sync */

        return manifest.version_name || null;
    }

    isPremiumVersion() {
        return promiseTry(
            () => this.getVersionName()
                .then((versionName) => {
                    if (versionName.includes(" Premium ")) {
                        return true;
                    }

                    return false;
                })
        );
    }

    isPremiumVersionSync() {
        /* eslint-disable no-sync */
        const versionName = this.getVersionNameSync();
        /* eslint-enable no-sync */

        if (versionName.includes(" Premium ")) {
            return true;
        }

        return false;
    }

    isFreeVersion() {
        return promiseTry(
            () => this.isPremiumVersion()
                .then((isPremiumVersion) => {
                    return !isPremiumVersion;
                })
        );
    }

    isFreeVersionSync() {
        /* eslint-disable no-sync */
        const isPremiumVersion = this.isPremiumVersionSync();
        /* eslint-enable no-sync */

        return !isPremiumVersion;
    }

    getVersionType() {
        return promiseTry(
            () => this.isPremiumVersion()
                .then((isPremiumVersion) => {
                    if (isPremiumVersion) {
                        return this._versionTypePremium;
                    }

                    return this._versionTypeFree;
                })
        );
    }

    getVersionTypeSync() {
        /* eslint-disable no-sync */
        const isPremiumVersion = this.isPremiumVersionSync();
        /* eslint-enable no-sync */

        if (isPremiumVersion) {
            return this._versionTypePremium;
        }

        return this._versionTypeFree;
    }

    isChromeVersion() {
        return promiseTry(
                () => this.getVersionName()
                    .then((versionName) => {
                        if (versionName.includes(" Chrome Extension ")) {
                            return true;
                        }

                        return false;
                    })
            );
    }

    isChromeVersionSync() {
        /* eslint-disable no-sync */
        const versionName = this.getVersionNameSync();
        /* eslint-enable no-sync */

        if (versionName.includes(" Chrome Extension ")) {
            return true;
        }

        return false;
    }

    isWebExtensionVersion() {
        return promiseTry(
                    () => this.getVersionName()
                        .then((versionName) => {
                            if (versionName.includes(" WebExtension ")) {
                                return true;
                            }

                            return false;
                        })
                );
    }

    isWebExtensionVersionSync() {
        /* eslint-disable no-sync */
        const versionName = this.getVersionNameSync();
        /* eslint-enable no-sync */

        if (versionName.includes(" WebExtension ")) {
            return true;
        }

        return false;
    }

    getSystemType() {
        return promiseTry(
            () => this.isChromeVersion()
                .then((isChrome) => {
                    if (isChrome) {
                        return this._systemTypeChrome;
                    }

                    return this._systemTypeWebExtension;
                })
        );
    }

    getSystemTypeSync() {
        /* eslint-disable no-sync */
        const isChrome = this.isChromeVersionSync();
        /* eslint-enable no-sync */

        if (isChrome) {
            return this._systemTypeChrome;
        }

        return this._systemTypeWebExtension;
    }

    getOsType() {
        return promiseTry(
            () => browser.runtime.getPlatformInfo()
                .then((platformInfo) => {
                    if (platformInfo && typeof platformInfo.os === "string") {
                        return platformInfo.os;
                    }

                    return null;
                })
        );
    }
}
