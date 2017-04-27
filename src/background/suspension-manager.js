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
    logInfo,
} from "../shared/log";

export default class SuspensionManager {
    constructor(suspensionConnectorManager) {
        // NOTE: the iframe takes care of the SuspensionListenerManager.
        this.suspensionConnectorManager = suspensionConnectorManager;

        this.stayAliveElementId = "stay-alive-iframe";
        this.stayAliveHtmlPath = "/src/stay-alive/stay-alive.html";

        this._initialized = false;
    }

    _injectBackgroundFrame() {
        return promiseTry(
            () => {
                const existingIframe = document.getElementById(this.stayAliveElementId);

                if (existingIframe !== null) {
                    throw new Error("this.stayAliveElementId exists.");
                }

                const iframe = document.createElement("iframe");
                iframe.id = this.stayAliveElementId;
                iframe.src = browser.runtime.getURL(this.stayAliveHtmlPath);
                document.body.appendChild(iframe);
            }
        );
    }

    _removeBackgroundFrame() {
        return promiseTry(
            () => {
                const existingIframe = document.getElementById(this.stayAliveElementId);

                if (existingIframe === null) {
                    throw new Error("this.stayAliveElementId did not exist.");
                }

                // NOTE: trigger onunload.
                // https://stackoverflow.com/questions/8677113/how-to-trigger-onunload-event-when-removing-iframe
                existingIframe.src = "about:blank";
                existingIframe.parenNode.removeChild(existingIframe);
            }
        );
    }

    initialize() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionManager.initialize");

                if (this._initialized === true) {
                    throw new Error("Already initialized.");
                }

                return this._injectBackgroundFrame()
                    .then(() => {
                        logDebug("Done", "SuspensionManager.initialize");

                        this._initialized = true;

                        return undefined;
                    });
            }
        );
    }

    unintialize() {
        return promiseTry(
            () => {
                logDebug("Start", "SuspensionManager.unintialize");

                if (this._initialized === false) {
                    throw new Error("Not initialized.");
                }

                return this._removeBackgroundFrame()
                    .then(() => {
                        logDebug("Done", "SuspensionManager.unintialize");

                        this._initialized = false;

                        return undefined;
                    });
            }
        );
    }

    preventExtensionSuspend() {
        return promiseTry(
            () => {
                logInfo("SuspensionManager.preventExtensionSuspend");

                if (this._initialized === false) {
                    throw new Error("Not initialized.");
                }

                return this.suspensionConnectorManager._connectToStayAlive();
            }
        );
    }

    allowExtensionSuspend() {
        return promiseTry(
            () => {
                logInfo("SuspensionManager.allowExtensionSuspend");

                if (this._initialized === false) {
                    throw new Error("Not initialized.");
                }

                return this.suspensionConnectorManager._disconnectToDie();
            }
        );
    }
}
