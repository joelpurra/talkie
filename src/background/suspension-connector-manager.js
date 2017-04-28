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
    logDebug,
} from "../shared/log";

export default class SuspensionConnectorManager {
    constructor() {
        // NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
        this.preventSuspensionPortName = "talkie-prevents-suspension";

        this.talkiePreventSuspensionPort = null;
    }

    _connectToStayAlive() {
        return promiseTry(
            () => {
                logDebug("Start", "_connectToStayAlive");

                const preventSuspensionConnectOptions = {
                    name: this.preventSuspensionPortName,
                };

                this.talkiePreventSuspensionPort = browser.runtime.connect(preventSuspensionConnectOptions);

                if (this.talkiePreventSuspensionPort === null) {
                    throw new Error(`Could not connect to ${this.preventSuspensionPortName}.`);
                }

                const onDisconnectHandler = () => {
                    logDebug("onDisconnect", "_connectToStayAlive");

                    this.talkiePreventSuspensionPort = null;
                };

                this.talkiePreventSuspensionPort.onDisconnect.addListener(onDisconnectHandler);

                const _onMessageHandler = (msg) => {
                    logDebug("_onMessageHandler", "_connectToStayAlive", msg); ;
                };

                // NOTE: this message listener is unneccessary.
                this.talkiePreventSuspensionPort.onMessage.addListener(_onMessageHandler);

                this.talkiePreventSuspensionPort.postMessage("Hello from the SuspensionConnectorManager.");

                logDebug("Done", "_connectToStayAlive");
            }
        );
    }

    _disconnectToDie() {
        return promiseTry(
            () => {
                logDebug("Start", "_disconnectToDie");

                if (this.talkiePreventSuspensionPort === null) {
                    // TODO: investigate if this should happen during normal operation, or not.
                    // throw new Error("this.talkiePreventSuspensionPort is null");
                    logDebug("Done", "_disconnectToDie", "already null");

                    return;
                }

                this.talkiePreventSuspensionPort.postMessage("Goodbye from the SuspensionConnectorManager.");

                // https://developer.browser.com/extensions/runtime#type-Port
                // NOTE: should work irregardless if the port was connected or not.
                this.talkiePreventSuspensionPort.disconnect();

                this.talkiePreventSuspensionPort = null;

                logDebug("Done", "_disconnectToDie");
            }
        );
    }
}
