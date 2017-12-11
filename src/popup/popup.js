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
    eventToPromise,
    startReactFrontend,
    stopReactFrontend,
} from "../frontend/shared-frontend";

import loadRoot from "./load-root.jsx";

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

const start = () => promiseTry(
    () => Promise.resolve()
        .then(() => startReactFrontend())
        .then(() => passClickToBackgroundOnLoad())
        .then(() => loadRoot())
        .then(() => undefined)
);

const stop = () => promiseTry(
    // NOTE: probably won't be correctly executed as before/unload doesn't guarantee asynchronous calls.
    () => stopReactFrontend()
        .then(() => undefined)
);

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("beforeunload", eventToPromise.bind(null, stop));
