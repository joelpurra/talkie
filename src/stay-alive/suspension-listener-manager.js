/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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
    logWarn,
} from "../shared/log";

export default class SuspensionListenerManager {
    constructor() {
        // NOTE: could be made configurable, in case there are multiple reasons to manage suspension.
        this.preventSuspensionPortName = "talkie-prevents-suspension";

        this._onConnectHandlerBound = null;
        this.connectionCounter = 0;
        this.activeSuspendConnections = 0;
        this.suspendConnectionPorts = [];

        this._preventSuspendPromise = null;
        this._preventSuspendPromiseResolve = null;

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

        const _onMessageHandler = (msg) => {
            logDebug("_onMessageHandler", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, msg);

            return this._preventSuspendPromise;
        };

        const _messageProducer = () => {
            this.suspendConnectionPorts[currentConnectionId].port.postMessage(`Ah, ha, ha, ha, stayin' alive, stayin' alive: ${currentConnectionId}, ${this.activeSuspendConnections}`);
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

        // NOTE: the background connects once per suspension prevention.
        this.suspendConnectionPorts[currentConnectionId] = {
            currentConnectionId: currentConnectionId,
            port: port,
            preventSuspensionIntervalId: preventSuspensionIntervalId,
            _onDisconnectHandler: _onDisconnectHandler,
        };

        // NOTE: this disconnect listener is unneccessary.
        this.suspendConnectionPorts[currentConnectionId].port.onDisconnect.addListener(_onDisconnectHandler);

        // NOTE: this message listener is unneccessary.
        this.suspendConnectionPorts[currentConnectionId].port.onMessage.addListener(_onMessageHandler);

        logDebug("Done", "_onConnectHandler", currentConnectionId, this.activeSuspendConnections, port);
    };

    _cleanUpConnections() {
        return promiseTry(
            () => {
                logDebug("Start", "_cleanUpConnections");

                const portDisconnectPromises = this.suspendConnectionPorts
                    .map((suspendConnectionPort) => {
                        if (suspendConnectionPort) {
                            if (suspendConnectionPort.port && typeof suspendConnectionPort.port.disconnect === "function") {
                                suspendConnectionPort.port.disconnect();
                            }

                            if (typeof suspendConnectionPort._onDisconnectHandler === "function") {
                                suspendConnectionPort._onDisconnectHandler();
                            }
                        }

                        return undefined;
                    });

                return Promise.all(portDisconnectPromises)
                    .then(() => {
                        logDebug("Done", "_cleanUpConnections");

                        return undefined;
                    });
            },
        );
    }

    _createOnSuspendPromise() {
        return promiseTry(
            () => {
                logDebug("Start", "_createOnSuspendPromise");

                this._preventSuspendPromise = Promise.resolve()
                    .then(() => {
                        logDebug("Start", "_preventSuspendPromise", "creating");

                        return undefined;
                    })
                    .then(() => new Promise(
                        (resolve) => {
                            // NOTE: should keep the channel alive until it disconnects.
                            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onMessage
                            // https://developer.chrome.com/extensions/runtime
                            this._preventSuspendPromiseResolve = resolve;
                        }),
                    )
                    .then(() => {
                        logDebug("Done", "_preventSuspendPromise", "resolved");

                        return undefined;
                    });
            },
        );
    }

    _finishOnSuspendPromise() {
        return promiseTry(
            () => {
                logDebug("Start", "_finishOnSuspendPromise");

                return Promise.resolve()
                    .then(() => this._preventSuspendPromiseResolve())
                    .then(() => this._preventSuspendPromise)
                    .then(() => {
                        logDebug("Done", "_finishOnSuspendPromise");

                        return undefined;
                    });
            },
        );
    }

    start() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionListenerManager.start");

                if (browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
                    throw new Error("SuspensionListenerManager: Already initialized.");
                }

                browser.runtime.onConnect.addListener(this._onConnectHandlerBound);

                return this._createOnSuspendPromise()
                    .then(() => {
                        logDebug("Done", "SuspensionListenerManager.start");

                        return undefined;
                    });
            },
        );
    }

    stop() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionListenerManager.stop");

                if (!browser.runtime.onConnect.hasListener(this._onConnectHandlerBound)) {
                    throw new Error("SuspensionListenerManager: Not initialized.");
                }

                browser.runtime.onConnect.removeListener(this._onConnectHandlerBound);
                this._onConnectHandlerBound = null;

                return this._finishOnSuspendPromise()
                    .then(() => {
                        if (this.activeSuspendConnections !== 0) {
                            logWarn(`this.activeSuspendConnections is not 0: ${this.activeSuspendConnections}. Attempting to disconnect.`);

                            return this._cleanUpConnections();
                        }

                        return undefined;
                    })
                    .then(() => {
                        logDebug("Done", "SuspensionListenerManager.stop");

                        return undefined;
                    });
            },
        );
    }
}
