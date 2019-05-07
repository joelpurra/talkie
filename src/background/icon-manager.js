/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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

export default class IconManager {
    constructor(metadataManager) {
        this.metadataManager = metadataManager;
    }

    getIconModePaths(versionType, name) {
        return {
            // NOTE: icons in use before Chrome 53 were 19x19 and 38x38.
            // NOTE: icons in use from Chrome 53 (switching to Material design) are 16x16 and 32x32.
            // NOTE: keeping larger icons to accomodate future changes.
            "16": `resources/icon/${versionType}/icon-${name}/icon-16x16.png`,
            "32": `resources/icon/${versionType}/icon-${name}/icon-32x32.png`,
            "48": `resources/icon/${versionType}/icon-${name}/icon-48x48.png`,
            "64": `resources/icon/${versionType}/icon-${name}/icon-64x64.png`,

            // NOTE: passing the larger icons slowed down the UI by several hundred milliseconds per icon switch.
            // "128": `resources/icon/${versionType}/icon-${name}/icon-128x128.png`,
            // "256": `resources/icon/${versionType}/icon-${name}/icon-256x256.png`,
            // "512": `resources/icon/${versionType}/icon-${name}/icon-512x512.png`,
            // "1024": `resources/icon/${versionType}/icon-${name}/icon-1024x1024.png`,
        };
    };

    setIconMode(name) {
        return promiseTry(
            () => {
                logDebug("Start", "Changing icon to", name);

                return this.metadataManager.getVersionType()
                    .then((versionType) => {
                        const paths = this.getIconModePaths(versionType, name);
                        const details = {
                            path: paths,
                        };

                        return browser.browserAction.setIcon(details)
                            .then((result) => {
                                logDebug("Done", "Changing icon to", name);

                                return result;
                            });
                    });
            }
        );
    }

    setIconModePlaying() {
        return this.setIconMode("stop");
    }
    setIconModeStopped() {
        return this.setIconMode("play");
    }
}
