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

/* global
chrome:false,
console:false,
dualLog:false,
dualLogError:false,
eventToPromise:false,
getStoredValue:false,
Promise:false,
promiseTry:false,
setStoredValue:false,
startFrontend:false,
stopFrontend:false,
Tabrow:false,
window:false,
*/

/* eslint-disable no-undef */
localScriptName = "options.js";
/* eslint-enable no-undef */

dualLog("Start", "Loading code");

const initializeTabrow = () => promiseTry(
    () => {
        const optionsTabrow = new Tabrow("options-tabrow");
        optionsTabrow.initialize();
    }
);

const loadOptionAndStartListeners = () => promiseTry(
    () => {
        const hideDonationsId = "options-popup-donate-buttons-hide";

        return Promise.resolve()
            .then(() => getStoredValue(hideDonationsId))
            .then((hideDonations) => {
                hideDonations = hideDonations === true;

                const hideDonationsElement = document.getElementById(hideDonationsId);
                hideDonationsElement.checked = hideDonations === true;

                hideDonationsElement.onclick = () => {
                    return setStoredValue(hideDonationsId, hideDonationsElement.checked === true);
                };

                return undefined;
            });
    }
);

const start = () => promiseTry(
    () => {
        dualLog("Start", "start");

        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => initializeTabrow())
            .then(() => loadOptionAndStartListeners())
            .then(() => {
                dualLog("Done", "start");

                return undefined;
            })
            .catch((error) => {
                dualLogError("Error", "Start", error);
            });
    }
);

const stop = () => promiseTry(
    () => {
        dualLog("Start", "stop");

        return Promise.resolve()
            .then(() => stopFrontend())
            .then(() => {
                dualLog("Done", "stop");

                return undefined;
            })
            .catch((error) => {
                dualLogError("Stop", "Stop", error);
            });
    }
);

document.addEventListener("DOMContentLoaded", eventToPromise.bind(this, start));
window.addEventListener("unload", eventToPromise.bind(this, stop));

dualLog("Done", "Loading code");
