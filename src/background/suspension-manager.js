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
    promiseTry,
} from "../shared/promise";

import {
    log,
    logError,
} from "../shared/log";

import Execute from "../shared/execute";

export default class SuspensionManager {
    constructor() {
        this.preventSuspensionProducingPort = null;
        this.preventSuspensionIntervalId = null;

        // NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
        this.preventSuspensionPortName = "talkie-prevents-suspension";
        this.preventSuspensionConnectOptions = {
            name: this.preventSuspensionPortName,
        };

        this.executeConnectFromContentCode = `
            (function(){
                try {
                    var talkiePreventSuspensionPort = (window.chrome || browser || chrome || null).runtime.connect(${JSON.stringify(this.preventSuspensionConnectOptions)});
                    var preventExtensionSuspendConnectFromContentResult = { name: talkiePreventSuspensionPort.name };

                    return preventExtensionSuspendConnectFromContentResult;
                } catch(error) {
                    return null;
                }
            }());
            `
            .replace(/\n/g, "")
            .replace(/\s{2,}/g, " ");
    }

    executeConnectFromContent() {
        return Execute.scriptInTopFrameWithTimeout(this.executeConnectFromContentCode, 1000)
            .then((preventExtensionSuspendConnectFromContentResult) => {
                log("Variable", "preventExtensionSuspendConnectFromContentResult", preventExtensionSuspendConnectFromContentResult);

                if (!preventExtensionSuspendConnectFromContentResult || !Array.isArray(preventExtensionSuspendConnectFromContentResult) || preventExtensionSuspendConnectFromContentResult.length !== 1 || !preventExtensionSuspendConnectFromContentResult[0]) {
                    throw new Error("preventExtensionSuspendConnectFromContentResult");
                }

                return preventExtensionSuspendConnectFromContentResult;
            });
    }

    preventExtensionSuspend() {
        return promiseTry(
            () => {
                log("Start", "preventExtensionSuspend");

                const onMessageProducingHandler = (msg) => {
                    log("preventExtensionSuspend", "onMessageProducingHandler", msg);
                };

                const messageProducer = () => {
                    this.preventSuspensionProducingPort.postMessage("Ah, ha, ha, ha, stayin' alive, stayin' alive");
                };

                const onConnectProducingHandler = (port) => {
                    log("preventExtensionSuspend", "onConnectProducingHandler", port);

                    if (port.name !== this.preventSuspensionPortName) {
                        return;
                    }

                    // NOTE: the browser.runtime.onConnect event is triggered once per frame on the page.
                    // Save the first port, ignore the rest.
                    if (this.preventSuspensionProducingPort !== null) {
                        return;
                    }

                    this.preventSuspensionProducingPort = port;

                    this.preventSuspensionProducingPort.onMessage.addListener(onMessageProducingHandler);

                    this.preventSuspensionIntervalId = setInterval(messageProducer, 1000);
                };

                browser.runtime.onConnect.addListener(onConnectProducingHandler);

                log("Done", "preventExtensionSuspend");

                return this.executeConnectFromContent()
                    .catch((error) => {
                        logError("Error", "preventExtensionSuspend", "Error swallowed", error);

                        return undefined;
                    });
            }
        );
    }

    allowExtensionSuspend() {
        return promiseTry(
            () => {
                log("Start", "allowExtensionSuspend");

                if (this.preventSuspensionProducingPort !== null) {
                    try {
                        // https://developer.browser.com/extensions/runtime#type-Port
                        // NOTE: should work irregardless if the port was connected or not.
                        this.preventSuspensionProducingPort.disconnect();
                    } catch (error) {
                        logError("Error", "allowExtensionSuspend", error);
                    }

                    this.preventSuspensionProducingPort = null;
                }

                clearInterval(this.preventSuspensionIntervalId);
                this.preventSuspensionIntervalId = null;

                log("Done", "allowExtensionSuspend");
            }
        );
    }
}
