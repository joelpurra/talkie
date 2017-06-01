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

export default class OnInstalledManager {
    constructor(storageManager, metadataManager, contextMenuManager, onInstallListenerEventQueue) {
        this.storageManager = storageManager;
        this.metadataManager = metadataManager;
        this.contextMenuManager = contextMenuManager;
        this.onInstallListenerEventQueue = onInstallListenerEventQueue;
    }

    initializeOptionsDefaults() {
        // TODO: more generic default option value system?
        const hideDonationsOptionId = "options-popup-donate-buttons-hide";

        return Promise.all([
            this.storageManager.getStoredValue(hideDonationsOptionId),
            this.metadataManager.isPremiumVersion(),
        ])
            .then(([hideDonations, isPremiumVersion]) => {
                if (typeof hideDonations !== "boolean") {
                    // NOTE: don't bother premium users, unless they want to be bothered.
                    if (isPremiumVersion) {
                        return this.storageManager.setStoredValue(hideDonationsOptionId, true);
                    }

                    return this.storageManager.setStoredValue(hideDonationsOptionId, false);
                }

                return undefined;
            });
    }

    onExtensionInstalledHandler() {
        return promiseTry(
            () => Promise.resolve()
                .then(() => this.storageManager.upgradeIfNecessary())
                .then(() => this.initializeOptionsDefaults())
                // NOTE: removing all context menus in case the menus have changed since the last install/update.
                .then(() => this.contextMenuManager.removeAll())
                .then(() => this.contextMenuManager.createContextMenus())
                .catch((error) => logError("onExtensionInstalledHandler", error))
        );
    }

    onInstallListenerEventQueueHandler() {
        return promiseTry(
            () => {
                if (this.onInstallListenerEventQueue.length > 0) {
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
