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
    logDebug,
    logError,
} from "../shared/log";

// NOTE: https://developer.chrome.com/extensions/runtime#type-OnInstalledReason
const REASON_INSTALL = "install";

export default class OnInstalledManager {
    constructor(storageManager, metadataManager, contextMenuManager, welcomeManager, onInstallListenerEventQueue) {
        // TODO: use broadcast listeners instead.
        this.storageManager = storageManager;
        this.metadataManager = metadataManager;
        this.contextMenuManager = contextMenuManager;
        this.welcomeManager = welcomeManager;
        this.onInstallListenerEventQueue = onInstallListenerEventQueue;
    }

    _setStorageManagerDefaults() {
        // TODO: move this function elsewhere?
        return promiseTry(
            () => {
                logDebug("Start", "_setStorageManagerDefaults");

                return this.metadataManager.isWebExtensionVersion()
                    .then((isWebExtensionVersion) => {
                    // TODO: shared place for stored value constants.
                        const speakLongTextsStorageKey = "speak-long-texts";

                        // TODO: shared place for default/fallback values for booleans etcetera.
                        // NOTE: enabling speaking long texts by default on in WebExtensions (Firefox).
                        const speakLongTexts = isWebExtensionVersion;

                        return this.storageManager.setStoredValue(speakLongTextsStorageKey, speakLongTexts);
                    })
                    .then((result) => {
                        logDebug("Done", "_setStorageManagerDefaults");

                        return result;
                    })
                    .catch((error) => {
                        logError("_setStorageManagerDefaults", error);

                        throw error;
                    });
            }
        );
    }

    onExtensionInstalledHandler(event) {
        return promiseTry(
            () => Promise.resolve()
                .then(() => this.storageManager.upgradeIfNecessary())
                // NOTE: removing all context menus in case the menus have changed since the last install/update.
                .then(() => this.contextMenuManager.removeAll())
                .then(() => this.contextMenuManager.createContextMenus())
                .then(() => {
                    if (event.reason === REASON_INSTALL) {
                        return this._setStorageManagerDefaults()
                            .then(() => this.welcomeManager.openWelcomePage());
                    }

                    return undefined;
                })
                .catch((error) => logError("onExtensionInstalledHandler", error))
        );
    }

    onInstallListenerEventQueueHandler() {
        return promiseTry(
            () => {
                while (this.onInstallListenerEventQueue.length > 0) {
                    const onInstallListenerEvent = this.onInstallListenerEventQueue.shift();

                    logDebug("onInstallListenerEventQueueHandler", "Start", onInstallListenerEvent);

                    return this.onExtensionInstalledHandler(onInstallListenerEvent.event)
                        .then(() => {
                            logDebug("onInstallListenerEventQueueHandler", "Done", onInstallListenerEvent);

                            return undefined;
                        });
                }
            }
        );
    }
}
