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
    logError,
} from "../shared/log";

import {
    promiseTry,
} from "../shared/promise";

export default class ContentLogger {
    constructor(execute, configuration) {
        this.execute = execute;
        this.configuration = configuration;

        this.executeLogToPageCode = "(function(){ console.log(%a); }());";
        this.executeLogToPageWithColorCode = "(function(){ console.log(%a); }());";
    }

    _variableToSafeString(v) {
        if (v === undefined) {
            return "undefined";
        }

        if (v === null) {
            return "null";
        }

        return v.toString();
    }

    logToPage(...args) {
        return promiseTry(
            () => {
                const now = new Date().toISOString();

                const logValues = [
                    now,
                    this.configuration.extensionShortName,
                    ...args.map((arg) => this._variableToSafeString(arg)),
                ]
                    .map((arg) => arg.replace(/\\/g, "\\\\"))
                    .map((arg) => arg.replace(/"/g, "\\\""))
                    .map((arg) => arg.replace(/\n/g, "\\\\n"))
                    .map((arg) => `"${arg}"`)
                    .join(", ");

                const code = this.executeLogToPageCode.replace("%a", logValues);

                return this.execute.scriptInTopFrame(code)
                    .catch((error) => {
                        logError("Error", "this.execute.logToPage", ...args);

                        throw error;
                    });
            }
        );
    }

    logToPageWithColor(...args) {
        return promiseTry(
            () => {
                const now = new Date().toISOString();

                const logValues = "\"" + [
                    now,
                    this.configuration.extensionShortName,
                    "%c",
                    ...args,
                    " ",
                ]
                    .map((arg) => this._variableToSafeString(arg))
                    .map((arg) => arg.replace(/\\/g, "\\\\"))
                    .map((arg) => arg.replace(/"/g, "\\\""))
                    .map((arg) => arg.replace(/\n/g, "\\\\n"))
                    .map((arg) => `${arg}`)
                    .join(" ") + "\", \"background: #007F41; color: #FFFFFF; padding: 0.3em;\"";

                const code = this.executeLogToPageWithColorCode.replace("%a", logValues);

                return this.execute.scriptInTopFrame(code)
                    .catch((error) => {
                        logError("Error", "this.execute.logToPageWithColor", ...args);

                        throw error;
                    });
            }
        );
    }
}
