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
dualLog:false,
dualLogError:false,
eventToPromise:false,
getBackgroundPage:false,
getStoredValue:false,
knownEvents:false,
Promise:false,
promiseTry:false,
startFrontend:false,
stopFrontend:false,
window:false,
*/

/* eslint-disable no-undef */
localScriptName = "popup-start.js";
/* eslint-enable no-undef */

dualLog("Start", "Loading code");

const loadOptionsAndApply = () => promiseTry(
    () => {
        const hideDonationsOptionId = "options-popup-donate-buttons-hide";

        return Promise.resolve()
            .then(() => getStoredValue(hideDonationsOptionId))
            .then((hideDonations) => {
                hideDonations = hideDonations === true;

                if (hideDonations) {
                    const elementsToHide = []
                        .concat(Array.from(document.getElementsByTagName("footer")))
                        .concat(Array.from(document.getElementsByTagName("hr")));

                    elementsToHide.forEach((element) => {
                        element.style.display = "none";
                    });
                }

                return undefined;
            });
    }
);

const passClickToBackground = (background) => promiseTry(
        () => {
            try {
                dualLog("Start", "passClickToBackground");
                background.iconClick();
                dualLog("Done", "passClickToBackground");
            } catch (error) {
                dualLogError("Error", "passClickToBackground", error);
                throw error;
            }
        }
);

const updateProgress = (data) => {
    const progressBar = document.getElementById("progress");
    progressBar.max = data.max - data.min;
    progressBar.value = data.current;
};

const start = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => loadOptionsAndApply())
            .then(() => getBackgroundPage())
            .then((background) => background.broadcaster.registerListeningAction(knownEvents.updateProgress, (actionName, actionData) => updateProgress(actionData)))
            .then(() => getBackgroundPage())
            .then((background) => passClickToBackground(background));
    }
);

const stop = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => stopFrontend());
    }
);

document.addEventListener("DOMContentLoaded", eventToPromise.bind(this, start));
window.addEventListener("unload", eventToPromise.bind(this, stop));

dualLog("Done", "Loading code");
