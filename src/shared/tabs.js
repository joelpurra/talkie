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
    logDebug,
} from "./log";

import {
    promiseTry,
} from "./promise";

export const getBackgroundPage = () => promiseTry(
    // https://developer.browser.com/extensions/runtime.html#method-getBackgroundPage
    () => browser.runtime.getBackgroundPage()
        .then((backgroundPage) => {
            if (backgroundPage) {
                return backgroundPage;
            }

            return null;
        })
);

export const getCurrentActiveTab = () => promiseTry(
    () => {
        const queryOptions = {
            "active": true,
            "currentWindow": true,
        };

        // https://developer.browser.com/extensions/tabs#method-query
        return browser.tabs.query(queryOptions)
            .then((tabs) => {
                if (!tabs) {
                    return null;
                }

                const singleTabResult = tabs.length === 1;

                const tab = tabs[0] || null;

                logDebug("getCurrentActiveTab", tabs, tab, singleTabResult);

                if (singleTabResult) {
                    return tab;
                }

                return null;
            });
    }
);

export const getCurrentActiveTabId = () => getCurrentActiveTab()
    .then((activeTab) => {
        if (activeTab) {
            return activeTab.id;
        }

        // NOTE: some tabs can't be retreived.
        return null;
    });

export const isCurrentPageInternalToTalkie = (internalUrlProvider) => promiseTry(
    () => getCurrentActiveTab()
        .then((tab) => {
            if (tab) {
                const url = tab.url;

                if (
                    typeof url === "string"
                    && (
                        /* eslint-disable no-sync */
                        url.startsWith(internalUrlProvider.getSync("/src/"))
                        || url.startsWith(internalUrlProvider.getSync("/dist/"))
                        /* eslint-enable no-sync */
                    )
                ) {
                    return true;
                }

                return false;
            }

            return false;
        })
);

const getCurrentActiveNormalLoadedTab = () => promiseTry(
    () => {
        const queryOptions = {
            "active": true,
            "currentWindow": true,
            "windowType": "normal",
            "status": "complete",
        };

        // https://developer.browser.com/extensions/tabs#method-query
        return browser.tabs.query(queryOptions)
            .then((tabs) => {
                const singleTabResult = tabs.length === 1;

                const tab = tabs[0] || null;

                logDebug("getCurrentActiveNormalLoadedTab", tabs, tab, singleTabResult);

                if (singleTabResult) {
                    return tab;
                }

                return null;
            });
    }
);

export const canTalkieRunInTab = () => promiseTry(
    () => getCurrentActiveNormalLoadedTab()
        .then((tab) => {
            if (tab) {
                const url = tab.url;

                if (typeof url === "string") {
                    if (
                        (
                            // NOTE: whitelisting schemes.
                            // TODO: can the list be extended?
                            url.startsWith("http://")
                            || url.startsWith("https://")
                            || url.startsWith("ftp://")
                            || url.startsWith("file:")
                        )
                        && !(
                            // NOTE: blacklisting known (per-browser store) urls.
                            // TODO: should the list be extended?
                            // TODO: move to configuration.
                            url.startsWith("https://chrome.google.com/")
                            || url.startsWith("https://addons.mozilla.org/")
                        )
                    ) {
                        return true;
                    }

                    return false;
                }

                return false;
            }

            return false;
        })
);

// NOTE: used to check if a DOM element cross-page (background, popup, options, ...) reference was used after it was supposed to be unreachable (memory leak).
// https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Errors/Dead_object
export const isDeadWrapper = (domElementReference) => {
    try {
        String(domElementReference);

        return false;
    }
    catch (e) {
        return true;
    }
};
