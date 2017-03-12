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

const currentStorageFormatVersion = "v1.0.0";

const getStorageKey = (storageFormatVersion, key) => {
    if (!allKnownStorageKeys[storageFormatVersion][key]) {
        throw new Error(`Unknown storage key (${storageFormatVersion}): ${key}`);
    }

    return `${storageFormatVersion}_${key}`;
};

const allKnownStorageKeys = {};

allKnownStorageKeys["v1.0.0"] = {
    "options-popup-donate-buttons-hide": "options-popup-donate-buttons-hide",
};

const knownStorageKeys = allKnownStorageKeys[currentStorageFormatVersion];

const setStoredValue = (key, value) => promiseTry(
    () => {
        log("Start", "setStoredValue", key, typeof value, value);

        const storageKey = getStorageKey(currentStorageFormatVersion, key);

        const valueJson = JSON.stringify(value);

        return getBackgroundPage()
            .then((background) => {
                background.localStorage.setItem(storageKey, valueJson);

                log("Done", "setStoredValue", key, typeof value, value);

                return undefined;
            });
    }
);

const getStoredValue = (key) => promiseTry(
    () => {
        log("Start", "getStoredValue", key);

        const storageKey = getStorageKey(currentStorageFormatVersion, key);

        return getBackgroundPage()
            .then((background) => {
                const valueJson = background.localStorage.getItem(storageKey);

                if (valueJson === null) {
                    log("Done", "getStoredValue", key, null);

                    return null;
                }

                const value = JSON.parse(valueJson);

                log("Done", "getStoredValue", key, value);

                return value;
            });
    }
);
