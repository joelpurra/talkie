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

const shouldPassClickOnLoad = () => {
    const containsBlockerString = document.location
        && typeof document.location.search === "string"
        && document.location.search.length > 0
        && document.location.search.includes("passclick=false");

    return !containsBlockerString;
};

const passClickToBackgroundOnLoad = () => promiseTry(
        () => {
            // NOTE: provide a way to link to the popup without triggering the "click".
            if (!shouldPassClickOnLoad()) {
                dualLogger.dualLogDebug("Skipped", "passClickToBackgroundOnLoad");

                return;
            }

            return passClickToBackground();
        }
);

const registerStartStopButtonClickHandlers = () => promiseTry(
    () => {
        const startStopButtons = Array.from(document.querySelectorAll(":scope .start-stop-button"));

        startStopButtons.forEach((optionsLink) => {
            optionsLink.onclick = (event) => {
                event.preventDefault();

                getBackgroundPage()
                        .then((background) => background.iconClick())
                        .catch((error) => {
                            dualLogger.dualLogError("registerStartStopButtonClickHandlers", "onclick", error);
                        });

                return false;
            };
        });

        return undefined;
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

const killSwitches = [];

const executeKillSwitches = () => {
    // NOTE: expected to have only synchronous methods for the relevant parts.
    killSwitches.forEach((killSwitch) => {
        try {
            killSwitch();
        } catch (error) {
            try {
                dualLogger.dualLogError("executeKillSwitches", error);
            } catch (ignored) {
                // NOTE: ignoring error logging errors.
            }
        }
    });
};

const registerBroadcastListeners = () => promiseTry(
    () => {
        return getBackgroundPage()
            .then((background) => background.broadcaster().registerListeningAction(knownEvents.updateProgress, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => updateProgress(actionData)))
            .then((killSwitch) => killSwitches.push(killSwitch));
    }
);

const start = () => promiseTry(
    () => Promise.resolve()
        .then(() => startFrontend(killSwitches))
        .then(() => registerBroadcastListeners())
        .then(() => registerStartStopButtonClickHandlers())
        .then(() => passClickToBackgroundOnLoad())
);

const stop = () => promiseTry(
    // NOTE: probably won't be correctly executed as unload doesn't allow asynchronous calls.
    () => stopFrontend()
);

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));

// NOTE: probably won't be correctly executed as unload doesn't allow asynchronous calls.
window.addEventListener("unload", eventToPromise.bind(null, stop));

// NOTE: synchronous version.
window.addEventListener("unload", () => {
    executeKillSwitches();
});
