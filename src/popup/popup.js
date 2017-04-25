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
    registerUnhandledRejectionHandler,
} from "../shared/error-handling";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    knownEvents,
} from "../shared/events";

import {
    eventToPromise,
    startFrontend,
    stopFrontend,
} from "../frontend/shared-frontend";

import DualLogger from "../frontend/dual-log";

const dualLogger = new DualLogger("popup.js");

const loadOptionsAndApply = () => promiseTry(
    () => {
        const hideDonationsOptionId = "options-popup-donate-buttons-hide";

        return getBackgroundPage()
            .then((background) => background.getStoredValue(hideDonationsOptionId))
            .then((hideDonations) => {
                if (hideDonations) {
                    const elementsToHide = []
                        .concat(Array.from(document.getElementsByTagName("footer")))
                        .concat(Array.from(document.getElementsByTagName("hr")));

                    elementsToHide.forEach((element) => {
                        element.style.display = "none";
                    });
                }

                return undefined;
            });
    }
);

const passClickToBackground = () => promiseTry(
        () => {
            dualLogger.dualLogDebug("Start", "passClickToBackground");

            return getBackgroundPage()
                .then((background) => background.iconClick())
                .then(() => {
                    dualLogger.dualLogDebug("Done", "passClickToBackground");

                    return undefined;
                })
                .catch((error) => {
                    dualLogger.dualLogError("passClickToBackground", error);

                    throw error;
                });
        }
);

const updateProgress = (data) => promiseTry(
    () => {
        const progressBar = document.getElementById("progress");
        progressBar.max = data.max - data.min;
        progressBar.value = data.current;

        return undefined;
    }
);

const registerBroadcastListeners = () => promiseTry(
    () => {
        return getBackgroundPage()
            .then((background) => background.broadcaster.registerListeningAction(knownEvents.updateProgress, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => updateProgress(actionData)));
    }
);

const start = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => loadOptionsAndApply())
            .then(() => registerBroadcastListeners())
            .then(() => passClickToBackground());
    }
);

const stop = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => stopFrontend());
    }
);

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("unload", eventToPromise.bind(null, stop));
