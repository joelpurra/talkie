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
    logDebug,
    logInfo,
} from "../shared/log";

import {
    promiseTry,
    promiseTimeout,
} from "../shared/promise";

export default class Execute {
    constructor(configuration) {
        this.configuration = configuration;
    }

    scriptInTopFrame(code) {
        return promiseTry(
            () => {
                logDebug("Start", "scriptInTopFrame", code.length, code);

                return browser.tabs.executeScript(
                    {
                        allFrames: false,
                        code: code,
                    }
                )
                    .then((result) => {
                        logDebug("Done", "scriptInTopFrame", code.length);

                        return result;
                    })
                    .catch((error) => {
                        logInfo("scriptInTopFrame", code.length, "Error", error);

                        throw error;
                    });
            }
        );
    }

    scriptInAllFrames(code) {
        return promiseTry(
            () => {
                logDebug("Start", "scriptInAllFrames", code.length, code);

                return browser.tabs.executeScript(
                    {
                        allFrames: true,
                        code: code,
                    }
                )
                    .then((result) => {
                        logDebug("Done", "scriptInAllFrames", code.length);

                        return result;
                    })
                    .catch((error) => {
                        logInfo("scriptInAllFrames", code.length, "Error", error);

                        throw error;
                    });
            }
        );
    }

    scriptInTopFrameWithTimeout(code, timeout) {
        return promiseTry(
            () => {
                logDebug("Start", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

                return promiseTimeout(
                    this.scriptInTopFrame(code),
                    timeout
                )
                    .then((result) => {
                        logDebug("Done", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

                        return result;
                    })
                    .catch((error) => {
                        if (error && typeof error.name === "PromiseTimeout") {
                            // NOTE: this is how to check for a timeout.
                        }

                        throw error;
                    });
            }
        );
    }

    scriptInAllFramesWithTimeout(code, timeout) {
        return promiseTry(
            () => {
                logDebug("Start", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

                return promiseTimeout(
                    this.scriptInAllFrames(code),
                    timeout
                )
                    .then((result) => {
                        logDebug("Done", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

                        return result;
                    })
                    .catch((error) => {
                        if (error && typeof error.name === "PromiseTimeout") {
                        // NOTE: this is how to check for a timeout.
                        }

                        throw error;
                    });
            }
        );
    }
}
