/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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

import DualLogger from "./dual-log";

const dualLogger = new DualLogger("shared-frontend.js");

const reflow = () => promiseTry(
    () => {
        document.body.style.marginBottom = "0";
    },
);

export const eventToPromise = (eventHandler, event) => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "eventToPromise", event && event.type, event);

        return Promise.resolve()
            .then(() => eventHandler(event))
            .then((result) => dualLogger.dualLogDebug("Done", "eventToPromise", event && event.type, event, result))
            .catch((error) => dualLogger.dualLogError("eventToPromise", event && event.type, event, error));
    },
);

const focusFirstLink = () => promiseTry(
    () => {
        const links = document.getElementsByTagName("a");

        if (links.length > 0) {
            const firstLinkElement = links[0];

            firstLinkElement.focus();
        }
    },
);

export const startReactFrontend = () => promiseTry(
    () => Promise.all([
        focusFirstLink(),
        reflow(),
    ]),
);

export const stopReactFrontend = () => promiseTry(
    () => {
        // TODO: unregister listeners.
    },
);
