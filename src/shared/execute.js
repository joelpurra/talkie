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

export const executeScriptInTopFrame = (code) => new Promise(
    (resolve, reject) => {
        try {
            log("About to execute code in page context", code);

            chrome.tabs.executeScript(
                {
                    allFrames: false,
                    matchAboutBlank: false,
                    code: code,
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    return resolve(result);
                }
            );
        } catch (error) {
            return reject(error);
        }
    }
);

export const executeScriptInAllFrames = (code) => new Promise(
    (resolve, reject) => {
        try {
            log("About to execute code in page context", code);

            chrome.tabs.executeScript(
                {
                    allFrames: true,
                    matchAboutBlank: true,
                    code: code,
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    return resolve(result);
                }
            );
        } catch (error) {
            return reject(error);
        }
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

export const executeLogToPage = (...args) => promiseTry(
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

        return executeScriptInTopFrame(code);
    }
);

const executeLogToPageWithColorCode = "console.log(%a);";

export const executeLogToPageWithColor = (...args) => promiseTry(
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

        return executeScriptInTopFrame(code);
    }
);
