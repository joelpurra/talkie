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
} from "../shared/log";

export default class ClipboardManager {
    constructor(talkieBackground, permissionsManager) {
        this.talkieBackground = talkieBackground;
        this.permissionsManager = permissionsManager;

        this.copyPasteTargetElementId = "copy-paste-textarea";
    }

    _getExistingTextarea() {
        return promiseTry(
            () => {
                const existingTextarea = document.getElementById(this.copyPasteTargetElementId);

                return existingTextarea;
            },
        );
    }

    _isInitialized() {
        return this._getExistingTextarea()
            .then((existingTextarea) => existingTextarea !== null);
    }

    _ensureIsInitialized() {
        return this._isInitialized()
            .then((isInitialized) => {
                if (isInitialized === true) {
                    return undefined;
                }

                throw new Error("this.copyPasteTargetElementId did not exist.");
            });
    }

    _ensureIsNotInitialized() {
        return this._isInitialized()
            .then((isInitialized) => {
                if (isInitialized === false) {
                    return undefined;
                }

                throw new Error("this.copyPasteTargetElementId exists.");
            });
    }

    _injectBackgroundTextarea() {
        return this._ensureIsNotInitialized()
            .then(() => {
                const textarea = document.createElement("textarea");
                textarea.id = this.copyPasteTargetElementId;
                document.body.appendChild(textarea);

                return undefined;
            });
    }

    _initializeIfNecessary() {
        return this._isInitialized()
            .then((isInitialized) => {
                if (isInitialized !== true) {
                    return this.initialize();
                }

                return undefined;
            });
    }

    _removeBackgroundTextarea() {
        return this._ensureIsInitialized()
            .then(() => this._getExistingTextarea())
            .then((existingTextarea) => {
                existingTextarea.parentNode.removeChild(existingTextarea);

                return undefined;
            });
    }

    initialize() {
        return promiseTry(
            () => {
                logDebug("Start", "ClipboardManager.initialize");

                return this._injectBackgroundTextarea()
                    .then(() => {
                        logDebug("Done", "ClipboardManager.initialize");

                        return undefined;
                    });
            },
        );
    }

    unintialize() {
        return promiseTry(
            () => {
                logDebug("Start", "ClipboardManager.unintialize");

                return this._removeBackgroundTextarea()
                    .then(() => {
                        logDebug("Done", "ClipboardManager.unintialize");

                        return undefined;
                    });
            },
        );
    }

    getClipboardText() {
        return promiseTry(
            () => {
                logDebug("Start", "getClipboardText");

                return this._initializeIfNecessary()
                    .then(() => this.permissionsManager.useOptionalPermissions(
                        [
                            "clipboardRead",
                        ],
                        [],
                        (granted) => {
                            if (granted) {
                                return this._getExistingTextarea()
                                    .then((textarea) => {
                                        textarea.value = "";
                                        textarea.focus();

                                        const success = document.execCommand("Paste");

                                        if (!success) {
                                            return null;
                                        }

                                        return textarea.value;
                                    });
                            }

                            return null;
                        }),
                    )
                    .then((text) => {
                        logDebug("Done", "getClipboardText", text);

                        return text;
                    });
            },
        );
    }}
