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

// TODO: avoid special case use of manifest.
import ManifestProvider from "../split-environments/manifest-provider";

const manifestProvider = new ManifestProvider();

// TODO: configuration.
const extensionShortName = "Talkie";

// https://stackoverflow.com/questions/12830649/check-if-chrome-extension-installed-in-unpacked-mode
// http://stackoverflow.com/a/20227975
/* eslint-disable no-sync */
const isDevMode = () => !("update_url" in manifestProvider.getSync());
/* eslint-enable no-sync */

// NOTE: 0, 1, ...
const loggingLevels = [
    "TRAC",
    "DEBG",
    "INFO",
    "WARN",
    "ERRO",

    // NOTE: should "always" be logged, presumably for technical reasons.
    "ALWA",

    // NOTE: turns off logging output.
    "NONE",
];

const parseLevelName = (nextLevelName) => {
    if (typeof nextLevelName !== "string") {
        throw new TypeError("nextLevelName");
    }

    const normalizedLevelName = nextLevelName.toUpperCase();

    const levelIndex = loggingLevels.indexOf(normalizedLevelName);

    if (typeof levelIndex === "number" && Math.floor(levelIndex) === Math.ceil(levelIndex) && levelIndex >= 0 && levelIndex < loggingLevels.length) {
        return levelIndex;
    }

    throw new TypeError("nextLevel");
};

const parseLevel = (nextLevel) => {
    if (typeof nextLevel === "number" && Math.floor(nextLevel) === Math.ceil(nextLevel) && nextLevel >= 0 && nextLevel < loggingLevels.length) {
        return nextLevel;
    }

    const levelIndex = parseLevelName(nextLevel);

    return levelIndex;
};

// NOTE: default logging level differs for developers using the unpacked extension, and "normal" usage.
let currentLevelIndex = isDevMode() ? parseLevel("DEBG") : parseLevel("WARN");

export const setLevel = (nextLevel) => {
    currentLevelIndex = parseLevel(nextLevel);
};

// NOTE: allows switching logging to strings only, to allow terminal output logging (where only one string argument is shown).
let stringOnlyOutput = false;

export const setStringOnlyOutput = (stringOnly) => {
    stringOnlyOutput = (stringOnly === true);
};

const generateLogger = (loggingLevelName, consoleFunctioName) => {
    const functionLevelIndex = parseLevel(loggingLevelName);

    const logger = (...args) => {
        if (functionLevelIndex < currentLevelIndex) {
            return;
        }

        const now = new Date().toISOString();

        let loggingArgs = [
            loggingLevels[functionLevelIndex],
            now,
            extensionShortName,
            ...args,
        ];

        if (stringOnlyOutput) {
            // NOTE: for chrome command line console debugging.
            // NOTE: has to be an array.
            loggingArgs = [
                JSON.stringify(loggingArgs),
            ];
        }

        /* eslint-disable no-console */
        console[consoleFunctioName](...loggingArgs);
        /* eslint-enable no-console */
    };

    return logger;
};

export const logTrace = generateLogger("TRAC", "log");
export const logDebug = generateLogger("DEBG", "log");
export const logInfo = generateLogger("INFO", "info");
export const logWarn = generateLogger("WARN", "warn");
export const logError = generateLogger("ERRO", "error");
export const logAlways = generateLogger("ALWA", "log");
