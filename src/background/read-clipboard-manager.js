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
                    .then((isPremiumVersion) => {
                        if (!isPremiumVersion) {
                            const text = browser.i18n.getMessage("readClipboardIsAPremiumFeature");

                            return text;
                        }

                        return this.permissionsManager.browserHasPermissionsFeature()
                            .then((hasPermissionsFeature) => {
                                if (!hasPermissionsFeature) {
                                    const text = browser.i18n.getMessage("readClipboardNeedsBrowserSupport");

                                    return text;
                                }

                                return this.clipboardManager.getClipboardText()
                                    .then((clipboardText) => {
                                        let text = clipboardText;

                                        if (typeof text !== "string") {
                                            text = browser.i18n.getMessage("readClipboardNeedsPermission");
                                        }

                                        if (text.length === 0 || text.trim().length === 0) {
                                            text = browser.i18n.getMessage("readClipboardNoSuitableText");
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
