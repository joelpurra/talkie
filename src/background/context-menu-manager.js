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
                title: chrome.i18n.getMessage("contextMenuStartStopText"),
                contexts: [
                    "selection",
                ],
            },
            buttonContextMenuStartStopDescription: {
                id: "start-stop",
                title: chrome.i18n.getMessage("commandStartStopDescription"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteMainDescription: {
                id: "open-website-main",
                title: chrome.i18n.getMessage("commandOpenWebsiteMainDescription"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteChromeWebStoreDescription: {
                id: "open-website-chromewebstore",
                title: chrome.i18n.getMessage("commandOpenWebsiteChromeWebStoreDescription"),
                contexts: [
                    "browser_action",
                ],
            },
            buttonContextMenuOpenWebsiteDonateDescription: {
                id: "open-website-donate",
                title: chrome.i18n.getMessage("commandOpenWebsiteDonateDescription"),
                contexts: [
                    "browser_action",
                ],
            },
        };
    }

    createContextMenu(contextMenuOptions) {
        return new Promise(
            (resolve, reject) => {
                try {
                    log("Start", "Creating context menu", contextMenuOptions);

                    chrome.contextMenus.create(
                        contextMenuOptions,
                        () => {
                            if (chrome.runtime.lastError) {
                                return reject(chrome.runtime.lastError);
                            }

                            log("Done", "Creating context menu", contextMenuOptions);

                            resolve();
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
