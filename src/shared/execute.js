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
                log("Start", "scriptInTopFrame", code.length, code);

                return browser.tabs.executeScript(
                    {
                        allFrames: false,
                        code: code,
                    }
                )
                    .then((result) => {
                        log("Done", "scriptInTopFrame", code.length);

                        return result;
                    })
                    .catch((error) => {
                        logError("Error", "scriptInTopFrame", code.length, error);

                        throw error;
                    });
            }
        );
    }

    scriptInAllFrames(code) {
        return promiseTry(
            () => {
                log("Start", "scriptInAllFrames", code.length, code);

                return browser.tabs.executeScript(
                    {
                        allFrames: true,
                        code: code,
                    }
                )
                    .then((result) => {
                        log("Done", "scriptInAllFrames", code.length);

                        return result;
                    })
                    .catch((error) => {
                        logError("Error", "scriptInAllFrames", code.length, error);

                        throw error;
                    });
            }
        );
    }

    scriptInTopFrameWithTimeout(code, timeout) {
        return promiseTry(
            () => {
                log("Start", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

                return promiseTimeout(
                    this.scriptInTopFrame(code),
                    timeout
                )
                    .then((result) => {
                        log("Done", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

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
                log("Start", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

                return promiseTimeout(
                    this.scriptInAllFrames(code),
                    timeout
                )
                    .then((result) => {
                        log("Done", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

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
