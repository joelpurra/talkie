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
knownEvents:false,
log:false,
logError:false,
Promise:false,
promiseTry:false,
window:false,
*/
const background = chrome.extension.getBackgroundPage();

const localScriptName = "pop-start.js";

const dualLog = (...args) => {
    log(localScriptName, ...args);
    background.log(localScriptName, ...args);
};

const dualLogError = (...args) => {
    logError(localScriptName, ...args);
    background.logError(localScriptName, ...args);
};

dualLog("Start", "Loading code");

const passClickToBackground = () => promiseTry(
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
    // progressBar.style.width = `${progress.getPercent()}%`;
    progressBar.max = data.max - data.min;
    progressBar.value = data.current;
};

const start = () => promiseTry(
    () => {
        progressBar = document.getElementById("progress");

        return Promise.resolve()
            .then(() => translate())
            .then(() => broadcaster.registerListeningAction(knownEvents.updateProgress, (actionName, actionData) => updateProgress(actionData)))
            .then(() => passClickToBackground());
    }
);

const stop = () => promiseTry(
    () => {
        // TODO: unregister listeners.
    }
);

const onDOMContentLoaded = () => promiseTry(
    () => {
        try {
            dualLog("Start", "onDOMContentLoaded");

            start()
                .then((result) => dualLog("Done", "onDOMContentLoaded", result))
                .catch((error) => dualLogError("Error", "onDOMContentLoaded", error));
        } catch (error) {
            dualLogError("Error", "onDOMContentLoaded", error);

            throw error;
        }
    }
);

const onUnload = () => promiseTry(
    () => {
        try {
            dualLog("Start", "onUnload");

            stop()
                .then((result) => dualLog("Done", "onUnload", result))
                .catch((error) => dualLogError("Error", "onUnload", error));
        } catch (error) {
            dualLogError("Error", "onUnload", error);

            throw error;
        }
    }
);

const translate = () => promiseTry(
    () => {
        dualLog("Start", "translate");

        const translateAttributeName = "data-translate";
        const translatableElements = document.querySelectorAll(`[${translateAttributeName}]`);

        dualLog("translate", "Translatable elements", translatableElements);

        translatableElements.forEach((element) => {
            const translationId = element.getAttribute(translateAttributeName);

            if (typeof translationId === "string" && translationId.length > 0) {
                const translated = chrome.i18n.getMessage(translationId);

                if (typeof translated === "string") {
                    element.textContent = translated;
                } else {
                    dualLogError("Could not translate element", "Translated message not found", element, translationId, translated);
                }
            } else {
                dualLogError("Could not translate element", "Invalid translation id", element, translationId);
            }
        });

        dualLog("Done", "translate");
    }
);

const broadcaster = background.broadcaster;
let progressBar = null;

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
window.addEventListener("unload", onUnload);

dualLog("Done", "Loading code");
