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

const extensionShortName = browser.i18n.getMessage("extensionShortName");

export const log = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.log(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};

export const logError = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.error(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};

export const logDebug = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.info(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};
