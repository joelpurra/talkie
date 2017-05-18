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

export default class ReadClipboardManager {
    constructor(clipboardManager, talkieBackground, permissionsManager, metadataManager) {
        this.clipboardManager = clipboardManager;
        this.talkieBackground = talkieBackground;
        this.permissionsManager = permissionsManager;
        this.metadataManager = metadataManager;

        this.copyPasteTargetElementId = "copy-paste-textarea";
    }

    startSpeaking() {
        return promiseTry(
            () => {
                logDebug("Start", "startSpeaking");

                return this.metadataManager.isPremiumVersion()
                    .then((isPremium) => {
                        if (!isPremium) {
                            // TODO: translation.
                            const text = "I'm sorry, but reading text from the clipboard is a Talkie Premium feature. Have you considered upgrading?";

                            return text;
                        }

                        return this.permissionsManager.browserHasPermissionsFeature()
                            .then((hasPermissionsFeature) => {
                                if (!hasPermissionsFeature) {
                                    // TODO: translation.
                                    const text = "I'm sorry, but this web browser does not support reading from the clipboard. Not yet, at least. Please try again in one month or so!";

                                    return text;
                                }

                                return this.clipboardManager.getClipboardText()
                                    .then((clipboardText) => {
                                        let text = clipboardText;

                                        if (typeof text !== "string") {
                                            // TODO: translation.
                                            text = "Talkie does not have permission to access from the clipboard. That's ok, but then reading the clipboard text won't work.";
                                        }

                                        if (text.length === 0 || text.trim().length === 0) {
                                            // TODO: translation.
                                            text = "Could not find suitable text in the clipboard. Can you try copying something else?";
                                        }

                                        return text;
                                    });
                            });
                    })
                    .then((text) => this.talkieBackground.startSpeakingCustomTextDetectLanguage(text))
                    .then((result) => {
                        logDebug("Done", "startSpeaking");

                        return result;
                    });
            }
        );
    }
}
