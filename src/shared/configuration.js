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
    // NOTE: keep SynchronousConfiguration and Configuration in... sync.
    constructor(metadataManager, configurationObject, internalUrlProvider) {
        this.metadataManager = metadataManager;
        this.configurationObject = configurationObject;
        this.internalUrlProvider = internalUrlProvider;

        this._initialize();
    }

    _initialize() {
        // NOTE: direct links to individual tabs.
        /* eslint-disable no-sync */
        this.configurationObject.shared.urls.options = this.internalUrlProvider.getSync("/src/options/options.html");
        /* eslint-enable no-sync */
        this.configurationObject.shared.urls["options-voices"] = this.configurationObject.shared.urls.options + "#voices";
        this.configurationObject.shared.urls["options-about"] = this.configurationObject.shared.urls.options + "#about";
        this.configurationObject.shared.urls["options-features"] = this.configurationObject.shared.urls.options + "#features";
        this.configurationObject.shared.urls["options-usage"] = this.configurationObject.shared.urls.options + "#usage";

        // NOTE: direct links to individual tabs.
        // NOTE: need to pass a parameter to the options page.
        this.configurationObject.shared.urls["options-from-popup"] = this.configurationObject.shared.urls.options + "?from=popup";
        this.configurationObject.shared.urls["options-voices-from-popup"] = this.configurationObject.shared.urls["options-from-popup"] + "#voices";
        this.configurationObject.shared.urls["options-about-from-popup"] = this.configurationObject.shared.urls["options-from-popup"] + "#about";
        this.configurationObject.shared.urls["options-features-from-popup"] = this.configurationObject.shared.urls["options-from-popup"] + "#features";
        this.configurationObject.shared.urls["options-usage-from-popup"] = this.configurationObject.shared.urls["options-from-popup"] + "#usage";

        /* eslint-disable no-sync */
        this.configurationObject.shared.urls.popup = this.internalUrlProvider.getSync("/src/popup/popup.html");
        /* eslint-enable no-sync */
        this.configurationObject.shared.urls["popup-passclick-false"] = this.configurationObject.shared.urls.popup + "?passclick=false";
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

    getSync(path) {
        // TODO: try/catch?
        /* eslint-disable no-sync */
        const versionType = this.metadataManager.getVersionTypeSync();
        const systemType = this.metadataManager.getSystemTypeSync();
        /* eslint-enable no-sync */

        const versionedSystemValue = this._resolvePath(this.configurationObject[versionType][systemType], path);
        const versionedValue = this._resolvePath(this.configurationObject[versionType], path);
        const systemValue = this._resolvePath(this.configurationObject[systemType], path);
        const sharedValue = this._resolvePath(this.configurationObject.shared, path);

        const value = versionedSystemValue
                         || versionedValue
                         || systemValue
                         || sharedValue
                         || null;

        return value;
    }
}
