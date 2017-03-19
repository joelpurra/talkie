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

import configurationJson from "../configuration.json";

import {
    promiseTry,
} from "../shared/promise";

export default class Configuration {
    constructor(metadataManager) {
        this.metadataManager = metadataManager;

        this.extensionShortName = browser.i18n.getMessage("extensionShortName");
        this.uiLocale = browser.i18n.getMessage("@@ui_locale");
        this.messagesLocale = browser.i18n.getMessage("extensionLocale");
    }

    _resolvePath(obj, path) {
        // NOTE: doesn't handle arrays nor properties of "any" non-object objects.
        if (!obj || typeof obj !== "object") {
            throw new Error();
        }

        if (!path || typeof path !== "string" || path.length === 0) {
            throw new Error();
        }

        // NOTE: doesn't handle path["subpath"].
        const parts = path.split(".");
        const part = parts.shift();

        if (({}).hasOwnProperty.call(obj, part)) {
            if (parts.length === 0) {
                return obj[part];
            }
            return this._resolvePath(obj[part], parts.join("."));
        }

        return null;
    }

    get(path) {
        return promiseTry(
            () => this.metadataManager.getVersionType()
                .then((versionType) => Promise.all([
                    this._resolvePath(configurationJson[versionType], path),
                    this._resolvePath(configurationJson.shared, path),
                ]))
                .then(([versionedValue, sharedValue]) => {
                    const value = versionedValue || sharedValue || null;

                    return value;
                })
            );
    }
}
