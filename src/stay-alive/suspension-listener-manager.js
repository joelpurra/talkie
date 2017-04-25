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
    logDebug,
} from "../shared/log";

export default class SuspensionListenerManager {
    constructor() {
        // NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
        this.preventSuspensionPortName = "talkie-prevents-suspension";

        this._onConnectHandlerBound = null;
        this.connectionCounter = 0;
        this.activeSuspendConnections = 0;
        this.suspendConnectionPorts = [];

        // TODO: avoid accidentally starting more than once.
        this._onConnectHandlerBound = (...args) => this._onConnectHandler(...args);
    }

    _onConnectHandler(port) {
        // NOTE: not only suspension managers connect here.
        this.connectionCounter++;

        const currentConnectionId = this.connectionCounter;

        logDebug("Start", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

        if (port.name !== this.preventSuspensionPortName) {
            // NOTE: ignore non-matching ports.
            logDebug("Non-matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

            return;
        }

        this.activeSuspendConnections++;

        logDebug("Matching port", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);

        // NOTE: the background connects once per suspension prevention.
        this.suspendConnectionPorts[currentConnectionId] = port;

        const _onMessageHandler = (msg) => {
            logDebug("_onMessageHandler", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, msg);
        };

        const _messageProducer = () => {
            this.suspendConnectionPorts[currentConnectionId].postMessage(`Ah, ha, ha, ha, stayin' alive, stayin' alive: ${currentConnectionId}, ${this.activeSuspendConnections}`);
        };

        // NOTE: this message producer is unneccessary.
        const preventSuspensionIntervalId = setInterval(_messageProducer, 1000);

        const _onDisconnectHandler = () => {
            logDebug("Start", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);

            clearInterval(preventSuspensionIntervalId);

            delete this.suspendConnectionPorts[currentConnectionId];

            this.activeSuspendConnections--;

            logDebug("Done", "_onDisconnectHandler", currentConnectionId, this.activeSuspendConnections, port);
        };

        // NOTE: this disconnect listener is unneccessary.
        this.suspendConnectionPorts[currentConnectionId].onDisconnect.addListener(_onDisconnectHandler);

        // NOTE: this message listener is unneccessary.
        this.suspendConnectionPorts[currentConnectionId].onMessage.addListener(_onMessageHandler);

        logDebug("Done", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);
    };

    start() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionListenerManager.start");

                if (browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
                    throw new Error("Already initialized.");
                }

                browser.runtime.onConnect.addListener(this._onConnectHandlerBound);

                logDebug("Done", "SuspensionListenerManager.start");
            }
        );
    }

    stop() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionListenerManager.stop");

                if (this.activeSuspendConnections !== 0) {
                    throw new Error(`this.activeSuspendConnections is not 0: ${this.activeSuspendConnections}`);
                }

                if (!browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
                    throw new Error("Not initialized.");
                }

                browser.runtime.onConnect.removeListener(this._onConnectHandlerBound);
                this._onConnectHandlerBound = null;

                logDebug("Done", "SuspensionListenerManager.stop");
            }
        );
    }
}
