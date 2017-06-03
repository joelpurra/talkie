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
    jsonClone,
} from "./basic";

// NOTE: bumping the version, even a minor bump, currently resets the entire hydrated state.
// NOTE: resetting the state on upgrade is intentional -- it's only temporary data, don't want to bother with it.
const storageVersion = "v1.0.0";

export const getPersistKeyPrefix = () => {
    const localStorageKeyPrefix = "per-page-state";

    // TODO: make configurable?
    const pagePath = document.location.pathname;

    const localStorageKey = `${localStorageKeyPrefix}--${pagePath}--${storageVersion}--`;

    return localStorageKey;
};

// TODO: evaluate if de/hydrating only parts of the state is better.
// TODO: replace redux-persist with other/own storage system? Still want/need cross-tab sync.
const EMPTY_STATE = {};
const DEFAULT_STATE = {};

export const SHARED_STATE_STORAGE_KEY_WHITELIST = [
    "metadata",
    "voices",
];

// TODO: is this the correct location for this function?
export const loadStateSync = (keys = SHARED_STATE_STORAGE_KEY_WHITELIST) => {
    const localStorageKeyPrefix = getPersistKeyPrefix();

    const state = keys.reduce((obj, key) => {
        // NOTE: mimicing the key style of redux-persist.
        // https://github.com/rt2zz/redux-persist/blob/master/src/getStoredState.js
        const localStorageKey = `${localStorageKeyPrefix}${key}`;
        const stateForKeyJSONString = window.localStorage.getItem(localStorageKey);

        let stateForKey = null;

        if (typeof stateForKeyJSONString === "string") {
            const parsedStateForKey = JSON.parse(stateForKeyJSONString);

            if (
            parsedStateForKey
            && typeof parsedStateForKey === "object"
            && parsedStateForKey !== null
        ) {
                stateForKey = parsedStateForKey;
            }
        }

        if (!stateForKey && DEFAULT_STATE[key]) {
            stateForKey = jsonClone(DEFAULT_STATE[key]);
        }

        if (stateForKey) {
            obj[key] = stateForKey;
        }

        return obj;
    },
    EMPTY_STATE);

    return state;
};
