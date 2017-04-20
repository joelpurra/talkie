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
    log,
} from "../shared/log";

export default class ContextMenuManager {
    constructor(commandHandler) {
        this.commandHandler = commandHandler;

        this.contextMenuOptionsCollection = {
            selectionContextMenuStartStop: {
                id: "talkie-context-menu-start-stop",
                title: browser.i18n.getMessage("contextMenuStartStopText"),
                contexts: [
                    "selection",
                ],
            },
            buttonContextMenuStartStop: {
                id: "start-stop",
                title: browser.i18n.getMessage("commandStartStopDescription"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteMain: {
                id: "open-website-main",
                title: browser.i18n.getMessage("commandOpenWebsiteMainDescription"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteStoreFree: {
                id: "open-website-store-free",
                title: browser.i18n.getMessage("commandOpenWebsiteStoreDescription_Free"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteStorePremium: {
                id: "open-website-store-premium",
                title: browser.i18n.getMessage("commandOpenWebsiteStoreDescription_Premium"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteDonate: {
                id: "open-website-donate",
                title: browser.i18n.getMessage("commandOpenWebsiteDonateDescription"),
                contexts: [
                    "browser_action",
                ],
            },
        };
    }

    removeAll() {
        return promiseTry(
            () => {
                log("Start", "Removing all context menus");

                return browser.contextMenus.removeAll()
                    .then((result) => {
                        log("Done", "Removing all context menus");

                        return result;
                    });
            }
        );
    }

    createContextMenu(contextMenuOptions) {
        return new Promise(
            (resolve, reject) => {
                try {
                    log("Start", "Creating context menu", contextMenuOptions);

                    // NOTE: Can't directly use a promise chain here, as the id is returned instead.
                    // https://github.com/mozilla/webextension-polyfill/pull/26
                    const contextMenuId = browser.contextMenus.create(
                        contextMenuOptions,
                        () => {
                            if (browser.runtime.lastError) {
                                return reject(browser.runtime.lastError);
                            }

                            log("Done", "Creating context menu", contextMenuOptions);

                            return resolve(contextMenuId);
                        }
                    );
                } catch (error) {
                    return reject(error);
                }
            }
        );
    }

    contextMenuClickAction(info) {
        return promiseTry(
            () => {
                log("Start", "contextMenuClickAction", info);

                if (!info) {
                    throw new Error("Unknown context menu click action info object.");
                }

                return promiseTry(
                    () => {
                        const id = info.menuItemId;

                        if (id === this.contextMenuOptionsCollection.selectionContextMenuStartStop.id) {
                            const selection = info.selectionText || null;

                            if (!selection || typeof selection !== "string" || selection.length === 0) {
                                throw new Error("Unknown context menu click action selection was empty.");
                            }

                            return this.commandHandler.handle("start-text", selection);
                        }

                        // NOTE: context menu items default to being commands.
                        return this.commandHandler.handle(id);
                    }
                )
                    .then(() => {
                        log("Done", "contextMenuClickAction", info);

                        return undefined;
                    });
            }
        );
    }

    createContextMenus() {
        return promiseTry(
            () => {
                const contextMenuOptionsCollectionPromises = Object.keys(this.contextMenuOptionsCollection).map((contextMenuOptionsCollectionKey) => {
                    const contextMenuOption = this.contextMenuOptionsCollection[contextMenuOptionsCollectionKey];

                    return this.createContextMenu(contextMenuOption);
                });

                return Promise.all(contextMenuOptionsCollectionPromises);
            }
        );
    }
}
