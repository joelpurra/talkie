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
    logTrace,
    logDebug,
    logInfo,
    logWarn,
    logError,
} from "../shared/log";

import {
    getBackgroundPage,
} from "../shared/tabs";

export default class DualLogger {
    constructor(localScriptName) {
        this.localScriptName = localScriptName;

        this.dualLogTrace = this._generateLogger(logTrace, "logTrace");
        this.dualLogDebug = this._generateLogger(logDebug, "logDebug");
        this.dualLogInfo = this._generateLogger(logInfo, "logInfo");
        this.dualLogWarn = this._generateLogger(logWarn, "logWarn");
        this.dualLogError = this._generateLogger(logError, "logError");
    }

    _generateLogger(localLoggerFunctionName, backgroundLoggerFunctionName) {
        const logger = (...args) => Promise.all([
            localLoggerFunctionName(this.localScriptName, ...args),

            getBackgroundPage()
                .then((background) => {
                    background[backgroundLoggerFunctionName](this.localScriptName, ...args);

                    return undefined;
                })
                .catch((error) => {
                    logError(this.localScriptName, "backgroundLoggerFunctionName", "Error logging to background page", "Swallowing error", error, "arguments", ...args);

                    return undefined;
                }),
        ]);

        return logger;
    }
}
