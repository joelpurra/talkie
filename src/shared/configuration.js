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

export default class Configuration {
    constructor(metadataManager, configurationObject) {
        this.metadataManager = metadataManager;
        this.configurationObject = configurationObject;

        this.extensionShortName = browser.i18n.getMessage("extensionShortName");
        this.uiLocale = browser.i18n.getMessage("@@ui_locale");
        this.messagesLocale = browser.i18n.getMessage("extensionLocale");

        this.configurationObject.shared.urls.options = browser.runtime.getURL("/src/options/options.html");
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
            () => Promise.all([
                this.metadataManager.getVersionType(),
                this.metadataManager.getSystemType(),
            ])
                .then(([versionType, systemType]) => Promise.all([
                    this._resolvePath(this.configurationObject[versionType][systemType], path),
                    this._resolvePath(this.configurationObject[versionType], path),
                    this._resolvePath(this.configurationObject[systemType], path),
                    this._resolvePath(this.configurationObject.shared, path),
                ]))
                .then(([versionedSystemValue, versionedValue, systemValue, sharedValue]) => {
                    const value = versionedSystemValue
                        || versionedValue
                        || systemValue
                        || sharedValue
                        || null;

                    return value;
                })
            );
    }
}
