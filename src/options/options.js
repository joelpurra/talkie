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
    eventToPromise,
    startReactFrontend,
    stopReactFrontend,
} from "../frontend/shared-frontend";

import loadRoot from "./load-root.jsx";

import DualLogger from "../frontend/dual-log";

const dualLogger = new DualLogger("options.js");

const start = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "start");

        return Promise.resolve()
            .then(() => startReactFrontend())
            .then(() => loadRoot())
            .then(() => {
                dualLogger.dualLogDebug("Done", "start");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Start", error);
            });
    }
);

const stop = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "stop");

        return Promise.resolve()
            .then(() => stopReactFrontend())
            .then(() => {
                dualLogger.dualLogDebug("Done", "stop");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Stop", "Stop", error);
            });
    }
);

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("unload", eventToPromise.bind(null, stop));
