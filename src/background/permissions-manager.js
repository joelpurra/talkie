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
    logError,
} from "../shared/log";

export default class PermissionsManager {
    constructor() {
        // NOTE: this is obfuscation to avoid errors regarding the permissions API not yet being implemented in Firefox (WebExtensions).
        // NOTE: am doing feature detection, and this code should not even be called as the menus are not enabled for WebExtensions (Firefox).
        // TODO: remove once Firefox is the main/only browser, and/or update strict_min_version in manifest.json.
        const something = browser;
        /* eslint-disable dot-notation */
        this._pms = something["permissions"];
        /* eslint-enable dot-notation */
    }

    browserHasPermissionsFeature() {
        return promiseTry(
            () => {
                return !!this._pms;
            }
        );
    }

    hasPermissions(permissionNames, origins) {
        // NOTE: Firefox, and therefore browser-polyfill, has not implemented permissions -- using regular callbacks.
        // return this._pms.contains({
        //     permissions: permissionNames,
        //     origins: origins,
        // });
        return new Promise(
            (resolve, reject) => {
                try {
                    const containsOptions = {
                        permissions: permissionNames,
                        origins: origins,
                    };

                    this._pms.contains(
                        containsOptions,
                        (result) => {
                            if (browser.runtime.lastError) {
                                return reject(browser.runtime.lastError);
                            }

                            return resolve(result);
                        }
                    );
                } catch (error) {
                    return reject(error);
                }
            }
        );
    }

    acquirePermissions(permissionNames, origins) {
        // NOTE: Firefox, and therefore browser-polyfill, has not implemented permissions -- using regular callbacks.
        // return this._pms.request({
        //     permissions: permissionNames,
        //     origins: origins,
        // });
        return new Promise(
            (resolve, reject) => {
                try {
                    const requestOptions = {
                        permissions: permissionNames,
                        origins: origins,
                    };

                    this._pms.request(
                        requestOptions,
                        (granted) => {
                            if (browser.runtime.lastError) {
                                return reject(browser.runtime.lastError);
                            }

                            return resolve(granted);
                        }
                    );
                } catch (error) {
                    return reject(error);
                }
            }
        );
    }

    releasePermissions(permissionNames, origins) {
        // NOTE: Firefox, and therefore browser-polyfill, has not implemented permissions -- using regular callbacks.
        // return this._pms.remove({
        //     permissions: permissionNames,
        //     origins: origins,
        // });
        return new Promise(
            (resolve, reject) => {
                try {
                    const removeOptions = {
                        permissions: permissionNames,
                        origins: origins,
                    };

                    this._pms.remove(
                        removeOptions,
                        (granted) => {
                            if (browser.runtime.lastError) {
                                return reject(browser.runtime.lastError);
                            }

                            return resolve(granted);
                        }
                    );
                } catch (error) {
                    return reject(error);
                }
            }
        );
    }

    useOptionalPermissions(permissionNames, origins, fn) {
        return promiseTry(
            () => {
                logDebug("Start", "useOptionalPermissions", permissionNames.length, permissionNames, origins.length, origins);

                const hasPermissionsPromises = permissionNames.map((permissionName) => {
                    // TODO: be more fine-grained per origin as well?
                    return this.hasPermissions([ permissionName ], origins);
                });

                return Promise.all(hasPermissionsPromises)
                    .then((hasPermissionsStates) => {
                        const activePermissionNames = [];
                        const inactivePermissionNames = [];

                        hasPermissionsStates.forEach((hasPermissionsState, index) => {
                            const permissionName = permissionNames[index];

                            if (hasPermissionsState) {
                                activePermissionNames.push(permissionName);
                            } else {
                                inactivePermissionNames.push(permissionName);
                            }
                        });

                        logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Already acquired", activePermissionNames);
                        logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Not yet acquired", inactivePermissionNames);

                        return this.acquirePermissions(inactivePermissionNames, origins)
                            .then((granted) => {
                                if (granted) {
                                    logDebug("useOptionalPermissions", permissionNames.length, origins.length, "All permissions acquired");
                                } else {
                                    logDebug("useOptionalPermissions", permissionNames.length, origins.length, "Permissions not acquired");
                                }

                                return Promise.resolve()
                                    .then(() => fn(granted))
                                    .then((result) => {
                                        return this.releasePermissions(inactivePermissionNames)
                                            .then(() => {
                                                logDebug("Done", "useOptionalPermissions", permissionNames.length, origins.length);

                                                return result;
                                            });
                                    })
                                    .catch((error) => {
                                        logError("useOptionalPermissions", permissionNames.length, origins.length, error);

                                        return this.releasePermissions(inactivePermissionNames, origins)
                                            .then(() => {
                                                throw error;
                                            });
                                    });
                            });
                    });
            }
        );
    }
}
