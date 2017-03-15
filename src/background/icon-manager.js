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
} from "../shared/log";

export default class IconManager {
    getIconModePaths(name) {
        return {
        // NOTE: icons in use before Chrome 53 were 19x19 and 38x38.
        // NOTE: icons in use from Chrome 53 (switching to Material design) are 16x16 and 32x32.
        // NOTE: keeping larger icons to accomodate future changes.
            "16": `resources/icon/icon-${name}/icon-16x16.png`,
            "32": `resources/icon/icon-${name}/icon-32x32.png`,
            "48": `resources/icon/icon-${name}/icon-48x48.png`,
            "64": `resources/icon/icon-${name}/icon-64x64.png`,

        // NOTE: passing the larger icons slowed down the UI by several hundred milliseconds per icon switch.
        // "128": `resources/icon/icon-${name}/icon-128x128.png`,
        // "256": `resources/icon/icon-${name}/icon-256x256.png`,
        // "512": `resources/icon/icon-${name}/icon-512x512.png`,
        // "1024": `resources/icon/icon-${name}/icon-1024x1024.png`,
        };
    };

    setIconMode(name) {
        return new Promise(
    (resolve, reject) => {
        try {
            log("Start", "Changing icon to", name);

            const paths = this.getIconModePaths(name);
            const details = {
                path: paths,
            };

            browser.browserAction.setIcon(
                details,
                () => {
                    if (browser.runtime.lastError) {
                        return reject(browser.runtime.lastError);
                    }

                    log("Done", "Changing icon to", name);

                    resolve();
                }
            );
        } catch (error) {
            return reject(error);
        }
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
