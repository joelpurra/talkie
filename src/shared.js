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
window:false,
console:false,
Promise:false
*/

const extensionShortName = chrome.i18n.getMessage("extensionShortName");

const log = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.log(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};

const logError = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.error(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};

const logDebug = (...args) => {
    const now = new Date().toISOString();

    /* eslint-disable no-console */
    console.info(now, extensionShortName, ...args);
    /* eslint-enable no-console */
};

log("Start", "Loading shared code");

// TODO: move to a file?
// TODO: read from manifest.json?
// TODO: allow overrides?
const configuration = {
    urls: {
        options: "chrome://extensions?options=enfbcfmmdpdminapkflljhbfeejjhjjk",
        main: "https://github.com/joelpurra/talkie",
        chromewebstore: "https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk",
        donate: "https://joelpurra.com/donate",
    },
};

const openUrlInNewTab = (url) => promiseTry(
    () => {
        if (typeof url !== "string") {
            throw new Error("Bad url: " + url);
        }

        // NOTE: only https urls.
        if (!url.startsWith("https://")) {
            throw new Error("Bad url, only https:// allowed: " + url);
        }

        chrome.tabs.create({active: true, url: url});
    }
);

const openUrlFromConfigurationInNewTab = (id) => promiseTry(
    () => {
        const url = configuration.urls[id];

        if (typeof url !== "string") {
            throw new Error("Bad url for id: " + id);
        }

        return openUrlInNewTab(url);
    }
);

const shallowCopy = (...objs) => Object.assign({}, ...objs);

const last = (indexable) => indexable[indexable.length - 1];

const flatten = (deepArray) => {
    if (!Array.isArray(deepArray)) {
        return deepArray;
    }

    if (deepArray.length === 0) {
        return [];
    }

    if (deepArray.length === 1) {
        return [].concat(flatten(deepArray[0]));
    }

    return [].concat(flatten(deepArray[0])).concat(flatten(deepArray.slice(1)));
};

const isUndefinedOrNullOrEmptyOrWhitespace = (str) => !(str && typeof str === "string" && str.length > 0 && str.trim().length > 0);

const getRandomInt = (min, max) => {
    if (typeof min === "undefined") {
        min = Number.MIN_VALUE;
        max = Number.MAX_VALUE;
    }

    if (typeof max === "undefined") {
        max = min;
        min = 0;
    }

    if (max === min) {
        return min;
    }

    if (min > max) {
        const t = min;
        min = max;
        max = t;
    }

    return min + Math.floor(Math.random() * (max - min));
};

const promiseTry = (fn) => new Promise(
    (resolve, reject) => {
        try {
            const result = fn();

            resolve(result);
        } catch (error) {
            reject(error);
        }
    }
);

const promiseSeries = (promises, state) => promiseTry(
    () => {
        if (promises.length === 0) {
            return undefined;
        }

        const first = promises[0];

        if (promises.length === 1) {
            return Promise.resolve(first(state));
        }

        const rest = promises.slice(1);

        return Promise.resolve(first(state))
            .then((result) => promiseSeries(rest, result));
    }
);

const getCurrentActiveTab = () => new Promise(
    (resolve, reject) => {
        try {
            const queryOptions = {
                "active": true,
                "currentWindow": true,
            };

            chrome.tabs.query(queryOptions, (tabs) => {
                // https://developer.chrome.com/extensions/tabs#method-query
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                const singleTabResult = tabs.length === 1;

                const tab = tabs[0] || null;

                log("getCurrentActiveTab", tabs, tab, singleTabResult);

                if (singleTabResult) {
                    return resolve(tab);
                }

                return resolve(null);
            });
        } catch (error) {
            return reject(error);
        }
    }
);

const isCurrentPageInternalToTalkie = () => promiseTry(
    () => getCurrentActiveTab()
        .then((tab) => {
            if (tab) {
                const url = tab.url;

                if (typeof url === "string" && url.length > 0) {
                    if (url.startsWith("chrome-extension://") && url.endsWith("/src/popup.html")) {
                        return true;
                    }

                    return false;
                }

                return false;
            }

            // NOTE: no active tab probably means it's a very special page.
            return true;
        })
);

const getCurrentActiveNormalLoadedTab = () => new Promise(
    (resolve, reject) => {
        try {
            const queryOptions = {
                "active": true,
                "currentWindow": true,
                "windowType": "normal",
                "status": "complete",
            };

            chrome.tabs.query(queryOptions, (tabs) => {
                // https://developer.chrome.com/extensions/tabs#method-query
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                const singleTabResult = tabs.length === 1;

                const tab = tabs[0] || null;

                log("getCurrentActiveNormalLoadedTab", tabs, tab, singleTabResult);

                if (singleTabResult) {
                    return resolve(tab);
                }

                return resolve(null);
            });
        } catch (error) {
            return reject(error);
        }
    }
);

const canTalkieRunInTab = () => promiseTry(
    () => getCurrentActiveNormalLoadedTab()
        .then((tab) => {
            if (tab) {
                const url = tab.url;

                if (typeof url === "string" && url.length > 0) {
                    if (url.startsWith("chrome://")) {
                        return false;
                    }

                    if (url.startsWith("chrome-extension://")) {
                        return false;
                    }

                    if (url.startsWith("https://chrome.google.com/")) {
                        return false;
                    }

                    if (url.startsWith("about:")) {
                        return false;
                    }

                    return true;
                }

                return false;
            }

            return false;
        })
);

const executeScriptInTopFrame = (code) => new Promise(
    (resolve, reject) => {
        try {
            log("About to execute code in page context", code);

            chrome.tabs.executeScript(
                {
                    allFrames: false,
                    matchAboutBlank: false,
                    code: code,
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    return resolve(result);
                }
            );
        } catch (error) {
            return reject(error);
        }
    }
);

const executeScriptInAllFrames = (code) => new Promise(
    (resolve, reject) => {
        try {
            log("About to execute code in page context", code);

            chrome.tabs.executeScript(
                {
                    allFrames: true,
                    matchAboutBlank: true,
                    code: code,
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    return resolve(result);
                }
            );
        } catch (error) {
            return reject(error);
        }
    }
); const variableToSafeString = (v) => {
    if (v === undefined) {
        return "undefined";
    }

    if (v === null) {
        return "null";
    }

    return v.toString();
};

const executeLogToPageCode = "console.log(%a);";

const executeLogToPage = (...args) => promiseTry(
    () => {
        const now = new Date().toISOString();

        const logValues = [
            now,
            extensionShortName,
            ...args.map((arg) => variableToSafeString(arg)),
        ]
            .map((arg) => arg.replace(/\\/g, "\\\\"))
            .map((arg) => arg.replace(/"/g, "\\\""))
            .map((arg) => arg.replace(/\n/g, "\\\\n"))
            .map((arg) => `"${arg}"`)
            .join(", ");

        const code = executeLogToPageCode.replace("%a", logValues);

        return executeScriptInTopFrame(code);
    }
);

const executeLogToPageWithColorCode = "console.log(%a);";

const executeLogToPageWithColor = (...args) => promiseTry(
    () => {
        const now = new Date().toISOString();

        const logValues = "\"" + [
            now,
            extensionShortName,
            "%c",
            ...args,
            " ",
        ]
            .map((arg) => variableToSafeString(arg))
            .map((arg) => arg.replace(/\\/g, "\\\\"))
            .map((arg) => arg.replace(/"/g, "\\\""))
            .map((arg) => arg.replace(/\n/g, "\\\\n"))
            .map((arg) => `${arg}`)
            .join(" ") + "\", \"background: #007F41; color: #FFFFFF; padding: 0.3em;\"";

        const code = executeLogToPageWithColorCode.replace("%a", logValues);

        return executeScriptInTopFrame(code);
    }
);

const executePlug = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => executeLogToPageWithColor("Thank you for using Talkie!"))
            .then(() => executeLogToPageWithColor("https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk"))
            .then(() => executeLogToPageWithColor("Created by Joel Purra. Released under GNU General Public License version 3.0 (GPL-3.0)"))
            .then(() => executeLogToPageWithColor("https://joelpurra.com/"))
            .then(() => executeLogToPageWithColor("If you like Talkie, send a link to your friends -- and consider donating to support further open source development."))
            .then(() => executeLogToPageWithColor("https://joelpurra.com/donate/"));
    }
);

const executeGetTalkieWasPluggedCode = "window.talkieWasPlugged;";
const executeGetTalkieWasPlugged = () => executeScriptInTopFrame(executeGetTalkieWasPluggedCode);

const executeSetTalkieWasPluggedCode = "window.talkieWasPlugged = true;";
const executeSetTalkieWasPlugged = () => executeScriptInTopFrame(executeSetTalkieWasPluggedCode);

const executePlugOnce = () => {
    return executeGetTalkieWasPlugged()
        .then((talkieWasPlugged) => {
            if (talkieWasPlugged && talkieWasPlugged.toString() !== "true") {
                return executePlug()
                    .then(() => executeSetTalkieWasPlugged());
            }

            return true;
        });
};

class Broadcaster {
    constructor() {
        this.actionRespondingMap = {};
        this.actionListeningMap = {};
    }

    // TODO REMOVE: not using chrome's message system.
    // broadcastHandler(message, sender, sendResponse) {
    //     try {
    //         log("Start", "broadcastHandler", message, sender, sendResponse);
    //
    //         const respondingAction = this.actionRespondingMap[message.action] || null;
    //         const listeningActions = this.actionListeningMap[message.action] || [];
    //
    //         log("broadcastHandler", "respondingAction", respondingAction, "listeningActions", listeningActions);
    //
    //         listeningActions.forEach((listeningAction) => {
    //         // NOTE: not waiting for a return value, as there will be none.
    //             listeningAction(message.data, sender);
    //         });
    //
    //         if (!respondingAction) {
    //             // sendResponse(null);
    //
    //             return false;
    //         }
    //
    //         // NOTE: can't return promise from handler.
    //         Promise.resolve()
    //             .then(() => respondingAction(message.data, sender))
    //             .then((result) => {
    //                 log("Done", "broadcastHandler", "action", message.action, result);
    //
    //                 sendResponse(result);
    //
    //                 return undefined;
    //             })
    //             .catch((error) => {
    //                 try {
    //                     sendResponse(error);
    //                 } catch (secondError) {
    //                     logError("Second Error", "broadcastHandler", "action", message.action, error, secondError);
    //
    //                     throw error;
    //                 }
    //                 logError("Error", "broadcastHandler", "action", message.action, error);
    //
    //                 throw error;
    //             });
    //
    //         // NOTE: indicate async response.
    //         // https://developer.chrome.com/extensions/runtime#event-onMessage
    //         return true;
    //     } catch (error) {
    //         sendResponse(error);
    //
    //         logError("Error", "broadcastHandler", "catch", error);
    //
    //         return false;
    //     }
    // }

    registerRespondingAction(actionName, respondingActionHandler) {
        return promiseTry(
    () => {
        if (this.actionRespondingMap[actionName]) {
            throw new Error("Only one responding handler allowed at the moment: " + actionName);
        }

        this.actionRespondingMap[actionName] = respondingActionHandler;
    }
);
    }

    registerListeningAction(actionName, listeningActionHandler) {
        return promiseTry(
    () => {
        this.actionListeningMap[actionName] = (this.actionListeningMap[actionName] || []).concat(listeningActionHandler);
    }
);
    }

    broadcastEvent(actionName, actionData) {
        return new Promise(
            (resolve, reject) => {
                try {
                    // log("Start", "Sending message", actionName, actionData);

                    const respondingAction = this.actionRespondingMap[actionName] || null;
                    const listeningActions = this.actionListeningMap[actionName] || [];

                    if (respondingAction === null && listeningActions.length === 0) {
                        // NOTE: there was no matching action registered.
                        // throw new Error("There was no matching action: " + actionName);

                        return resolve(undefined);
                    }

                    listeningActions.forEach((listeningAction) => {
                        listeningAction(actionName, actionData);
                    });

                    let respondingActionResult = null;
                    let respondingActionError = null;

                    if (respondingAction) {
                        respondingAction(actionName, actionData)
                            .then((result) => {
                                respondingActionResult = result;

                                return result;
                            })
                            .catch((error) => {
                                respondingActionError = error;

                                throw error;
                            });
                    }

                    if (respondingActionError) {
                        return reject(respondingActionError);
                    }

                    return resolve(respondingActionResult);

                    // TODO REMOVE: not using chrome's message system.
                    // const message = {
                    //     action: actionName,
                    //     data: actionData,
                    // };
                    //
                    // chrome.runtime.sendMessage(
                    //     message,
                    //     (response) => {
                    //         if (chrome.runtime.lastError) {
                    //             // https://developer.chrome.com/extensions/runtime#method-sendMessage
                    //             // https://bugs.chromium.org/p/chromium/issues/detail?id=479425#c6
                    //             const knownCrossFramMessagingError = "Could not establish connection. Receiving end does not exist.";
                    //
                    //             if (chrome.runtime.lastError.message === knownCrossFramMessagingError) {
                    //                 return resolve(undefined);
                    //             }
                    //
                    //             logError("Error", "Sending message", actionName, actionData, chrome.runtime.lastError);
                    //
                    //             return reject(chrome.runtime.lastError);
                    //         }
                    //
                    //         log("Done", "Sending message", actionName, actionData);
                    //
                    //         resolve(response);
                    //     }
                    // );
                } catch (error) {
                    logError("Error", "catch", "Sending message", actionName, actionData);

                    return reject(error);
                }
            }
        );
    }

    start() {
        // TODO REMOVE: not using chrome's message system.
        // chrome.runtime.onMessage.addListener(this.broadcastHandler.bind(this));
    }
}

class TalkieProgress {
    constructor(broadcaster, min, max, current) {
        this.broadcaster = broadcaster;
        this.interval = null;
        this.intervalDelay = 100;
        this.minSpeed = 0.015;

        this.resetProgress(min, max, current);
    }

    getEventData() {
        const eventData = {
            min: this.min,
            max: this.max,
            current: this.current,
        };

        return eventData;
    }

    broadcastEvent(eventName) {
        const eventData = this.getEventData();

        return this.broadcaster.broadcastEvent(eventName, eventData);
    }

    getPercent() {
        if (this.max === 0) {
            return 0;
        }

        const pct = (this.current / this.max) * 100;

        return pct;
    }

    updateProgress() {
        this.broadcastEvent(knownEvents.updateProgress);
    }

    resetProgress(min, max, current) {
        const now = Date.now();

        this.resetTime = now;
        this.min = min || 0;
        this.max = max || 0;
        this.current = current || 0;
        this.segmentSum = this.min;
        // this.segments = [];

        this.broadcastEvent(knownEvents.resetProgress);

        this.updateProgress();
    }

    addProgress(n) {
        const segmentLimited = Math.min(this.segmentSum, this.current + n);

        this.current = segmentLimited;

        this.broadcastEvent(knownEvents.addProgress);

        this.updateProgress();
    }

    getSpeed() {
        const now = Date.now();

        const timeDiff = now - this.resetTime;

        if (timeDiff === 0) {
            return this.minSpeed;
        }

        const speed = this.current / timeDiff;

        const adjustedSpeed = Math.max(speed, this.minSpeed);

        return adjustedSpeed;
    }

    intervalIncrement() {
        const now = Date.now();
        const intervalDiff = now - this.previousInterval;
        const speed = this.getSpeed();
        const increment = intervalDiff * speed;

        this.previousInterval = now;

        this.addProgress(increment);
    }

    startSegment(n) {
        const now = Date.now();

        this.previousInterval = now;

        this.segmentSum += n;

        this.interval = setInterval(this.intervalIncrement.bind(this), this.intervalDelay);
    }

    endSegment() {
        clearInterval(this.interval);

        this.interval = null;

        this.current = this.segmentSum;

        this.updateProgress();
    }

    finishProgress() {
        this.current = this.max;

        this.broadcastEvent(knownEvents.finishProgress);

        this.updateProgress();
    }

    start() {
        const self = this;

        return Promise.resolve()
            .then(() => self.broadcaster.registerListeningAction(knownEvents.beforeSpeaking, (actionName, actionData) => self.resetProgress(0, actionData.text.length, 0)))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.beforeSpeakingPart, (actionName, actionData) => self.startSegment(actionData.textPart.length)))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.afterSpeakingPart, () => self.endSegment()))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => self.finishProgress()));
    }
}

const knownEvents = {
    beforeSpeaking: "beforeSpeaking",
    stopSpeaking: "stopSpeaking",
    afterSpeaking: "afterSpeaking",
    beforeSpeakingPart: "beforeSpeakingPart",
    afterSpeakingPart: "afterSpeakingPart",
    updateProgress: "updateProgress",
    resetProgress: "resetProgress",
    addProgress: "addProgress",
    finishProgress: "finishProgress",
};

const getBackgroundPage = () => new Promise(
    (resolve, reject) => {
        try {
            chrome.runtime.getBackgroundPage((backgroundPage) => {
                // https://developer.chrome.com/extensions/runtime.html#method-getBackgroundPage
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                if (backgroundPage) {
                    return resolve(backgroundPage);
                }

                return resolve(null);
            });
        } catch (error) {
            return reject(error);
        }
    }
);

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

const getVoices = () => promiseTry(
    () => {
        return getBackgroundPage()
            .then((background) => {
                const voices = background.speechSynthesis.getVoices();

                if (!voices || voices.length === 0) {
                    throw new Error("The browser does not have any voices installed.");
                }

                return voices;
            });
    }
);

const getMappedVoices = () => promiseTry(
    () => {
        return getVoices()
            .then((voices) => {
                const mappedVoices = voices.map(voice => {
                    return {
                        name: voice.name,
                        lang: voice.lang,
                    };
                });

                return mappedVoices;
            });
    }
);

const api = {};

api.shared = {
    Broadcaster,
    canTalkieRunInTab,
    executeGetTalkieWasPlugged,
    executeGetTalkieWasPluggedCode,
    executeLogToPage,
    executeLogToPageCode,
    executeLogToPageWithColor,
    executeLogToPageWithColorCode,
    executePlug,
    executePlugOnce,
    executeScriptInAllFrames,
    executeScriptInTopFrame,
    executeSetTalkieWasPlugged,
    executeSetTalkieWasPluggedCode,
    extensionShortName,
    flatten,
    getCurrentActiveNormalLoadedTab,
    getCurrentActiveTab,
    getMappedVoices,
    getRandomInt,
    getStoredValue,
    getVoices,
    isCurrentPageInternalToTalkie,
    isUndefinedOrNullOrEmptyOrWhitespace,
    knownEvents,
    knownStorageKeys,
    last,
    log,
    logDebug,
    logError,
    openUrlFromConfigurationInNewTab,
    promiseSeries,
    promiseTry,
    setStoredValue,
    shallowCopy,
    TalkieProgress,
};

log("Done", "Loading shared code");
