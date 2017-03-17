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
    openUrlInNewTab,
} from "../shared/urls";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    urls,
} from "../shared/configuration";

import DualLogger from "./dual-log";

const dualLogger = new DualLogger("shared-frontend.js");

const translateWindow = () => promiseTry(
    () => {
        dualLogger.dualLog("Start", "translate");

        const translateAttributeName = "data-translate";
        const translatableElements = document.querySelectorAll(`[${translateAttributeName}]`);

        dualLogger.dualLog("translate", "Translatable elements", translatableElements);

        translatableElements.forEach((element) => {
            const translationId = element.getAttribute(translateAttributeName);

            if (typeof translationId === "string" && translationId.length > 0) {
                const translated = browser.i18n.getMessage(translationId);

                if (typeof translated === "string") {
                    element.textContent = translated;
                } else {
                    dualLogger.dualLogError("Could not translate element", "Translated message not found", element, translationId, translated);
                }
            } else {
                dualLogger.dualLogError("Could not translate element", "Invalid translation id", element, translationId);
            }
        });

        dualLogger.dualLog("Done", "translate");
    }
);

const addLinkClickHandlers = () => promiseTry(
    () => {
        // https://stackoverflow.com/questions/8915845/chrome-extension-open-a-link-from-popup-html-in-a-new-tab
        // http://stackoverflow.com/a/17732667
        const links = Array.from(document.getElementsByTagName("a"));

        links.forEach((link) => {
            const location = link.href;

            // NOTE: skipping non-https urls -- presumably empty hrefs for special links.
            if (typeof location !== "string" || !location.startsWith("https://")) {
                dualLogger.dualLog("addLinkClickHandlers", "Skipping non-https URL", link, location);

                return;
            }

            link.onclick = (event) => {
                event.preventDefault();

                openUrlInNewTab(location);

                return false;
            };
        });
    }
);

const addOptionsLinkClickHandlers = () => promiseTry(
    () => {
        // https://developer.browser.com/extensions/optionsV2#linking
        const optionsLinks = Array.from(document.querySelectorAll("[href='" + urls.options + "']"));

        optionsLinks.forEach((optionsLink) => {
            optionsLink.onclick = (event) => {
                event.preventDefault();

                browser.runtime.openOptionsPage();

                return false;
            };
        });
    }
);

const reflow = () => promiseTry(
    () => {
        const bodyElement = document.getElementsByTagName("body")[0];

        bodyElement.style.marginBottom = "0";
    }
);

export const eventToPromise = (eventHandler, event) => promiseTry(
    () => {
        try {
            dualLogger.dualLog("Start", "eventToPromise", event);

            Promise.resolve()
                .then(() => eventHandler(event))
                .then((result) => dualLogger.dualLog("Done", "eventToPromise", event, result))
                .catch((error) => dualLogger.dualLogError("Error", "eventToPromise", event, error));
        } catch (error) {
            dualLogger.dualLogError("Error", "eventToPromise", event, error);

            throw error;
        }
    }
);

export const startFrontend = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then(() => translateWindow())
            .then(() => addLinkClickHandlers())
            .then(() => addOptionsLinkClickHandlers())
            .then(() => reflow());
    }
);

export const stopFrontend = () => promiseTry(
    () => {
        // TODO: unregister listeners.
    }
);
