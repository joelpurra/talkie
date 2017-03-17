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
    log,
    logError,
    logDebug,
} from "../shared/log";

import {
    getBackgroundPage,
} from "../shared/tabs";

export default class DualLogger {
    constructor(localScriptName) {
        this.localScriptName = localScriptName;

        this.background = null;
    }

    dualLog(...args) {
        return Promise.all([
            log(this.localScriptName, ...args),

            getBackgroundPage()
                .then((background) => {
                    background.log(this.localScriptName, ...args);

                    return undefined;
                }),
        ]);
    }

    dualLogError(...args) {
        return Promise.all([
            logError(this.localScriptName, ...args),

            getBackgroundPage()
                .then((background) => {
                    background.logError(this.localScriptName, ...args);

                    return undefined;
                }),
        ]);
    }

    dualLogDebug(...args) {
        return Promise.all([
            logDebug(this.localScriptName, ...args),

            getBackgroundPage()
                .then((background) => {
                    background.logDebug(this.localScriptName, ...args);

                    return undefined;
                }),
        ]);
    }
}
