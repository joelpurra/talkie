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
} from "../shared/log";

import {
    promiseTry,
} from "../shared/promise";

import {
    extensionShortName,
} from "./configuration";

export default class Execute {}

Execute.scriptInTopFrame = (code) => promiseTry(
    () => {
        log("About to execute code in page context", code);

        return browser.tabs.executeScript(
            {
                allFrames: false,
                matchAboutBlank: false,
                code: code,
            }
        );
    }
);

Execute.scriptInAllFrames = (code) => promiseTry(
    () => {
        log("About to execute code in page context", code);

        return browser.tabs.executeScript(
            {
                allFrames: true,
                matchAboutBlank: true,
                code: code,
            }
        );
    }
);

const variableToSafeString = (v) => {
    if (v === undefined) {
        return "undefined";
    }

    if (v === null) {
        return "null";
    }

    return v.toString();
};

const executeLogToPageCode = "console.log(%a);";

Execute.logToPage = (...args) => promiseTry(
    () => {
        const now = new Date().toISOString();

        const logValues = [
            now,
            extensionShortName,
            ...args.map((arg) => variableToSafeString(arg)),
        ]
            .map((arg) => arg.replace(/\\/g, "\\\\"))
            .map((arg) => arg.replace(/"/g, "\\\""))
            .map((arg) => arg.replace(/\n/g, "\\\\n"))
            .map((arg) => `"${arg}"`)
            .join(", ");

        const code = executeLogToPageCode.replace("%a", logValues);

        return Execute.scriptInTopFrame(code);
    }
);

const executeLogToPageWithColorCode = "console.log(%a);";

Execute.logToPageWithColor = (...args) => promiseTry(
    () => {
        const now = new Date().toISOString();

        const logValues = "\"" + [
            now,
            extensionShortName,
            "%c",
            ...args,
            " ",
        ]
            .map((arg) => variableToSafeString(arg))
            .map((arg) => arg.replace(/\\/g, "\\\\"))
            .map((arg) => arg.replace(/"/g, "\\\""))
            .map((arg) => arg.replace(/\n/g, "\\\\n"))
            .map((arg) => `${arg}`)
            .join(" ") + "\", \"background: #007F41; color: #FFFFFF; padding: 0.3em;\"";

        const code = executeLogToPageWithColorCode.replace("%a", logValues);

        return Execute.scriptInTopFrame(code);
    }
);
