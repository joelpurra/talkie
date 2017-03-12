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
api:false,
chrome:false,
executeScriptInTopFrame:false,
getCurrentActiveTab:false,
getCurrentActiveTabId:false,
log:false,
logError:false,
promiseTry:false,
*/

let lastCallerId = 0;

const incrementCallerId = () => {
    lastCallerId++;
};

const onlyLastCallerContinueSpeakingProvider = () => {
    incrementCallerId();
    const callerOnTheAirId = lastCallerId;

    log("Start", "onlyLastCallerContinueSpeakingProvider", callerOnTheAirId);

    return () => promiseTry(
        () => {
            const isLastCallerOnTheAir = callerOnTheAirId === lastCallerId;

            log("Status", "onlyLastCallerContinueSpeakingProvider", callerOnTheAirId, isLastCallerOnTheAir);

            return isLastCallerOnTheAir;
        }
    );
};

let currentSpeakingTab = null;

const getSpeakingTabId = () => promiseTry(
    () => currentSpeakingTab
);

const setSpeakingTabId = (tabId) => isSpeakingTabId(tabId)
    .then((isTabSpeaking) => {
        if (isTabSpeaking) {
            throw new Error(`Tried to set tab ${tabId} as speaking, but another tab was already speaking.`);
        }

        currentSpeakingTab = tabId;

        return undefined;
    });

const setTabIsDoneSpeaking = (tabId) => isSpeakingTabId(tabId)
    .then((isTabSpeaking) => {
        // TODO: throw if it's not the same tabId as the currently speaking tab?
        if (isTabSpeaking) {
            currentSpeakingTab = null;
        }

        return undefined;
    });

const isSpeakingTabId = (tabId) => promiseTry(
    () => currentSpeakingTab !== null && tabId === currentSpeakingTab
);

const isSpeaking = () => getSpeakingTabId()
    // TODO: check synthesizer.speaking === true?
    .then((speakingTabId) => speakingTabId !== null);

const setActiveTabIsDoneSpeaking = () => getCurrentActiveTabId()
    .then((activeTabId) => setTabIsDoneSpeaking(activeTabId));

const setActiveTabAsSpeaking = () => getCurrentActiveTab()
    .then((activeTab) => {
        // NOTE: some tabs can't be retreived.
        if (!activeTab) {
            return undefined;
        }

        const activeTabId = activeTab.id;

        return setSpeakingTabId(activeTabId);
    });

const isActiveTabSpeaking = () => getCurrentActiveTabId()
    .then((activeTabId) => isSpeakingTabId(activeTabId));

let preventSuspensionProducingPort = null;
let preventSuspensionIntervalId = null;
const preventSuspensionPortName = "talkie-prevents-suspension";
const preventSuspensionConnectOptions = {
    name: preventSuspensionPortName,
};

const executeConnectFromContentCode = `var talkiePreventSuspensionPort = chrome.runtime.connect(${JSON.stringify(preventSuspensionConnectOptions)}); var preventExtensionSuspendConnectFromContentResult = { name: talkiePreventSuspensionPort.name }; preventExtensionSuspendConnectFromContentResult`;
const executeConnectFromContent = () => executeScriptInTopFrame(executeConnectFromContentCode).then((preventExtensionSuspendConnectFromContentResult) => {
    log("Variable", "preventExtensionSuspendConnectFromContentResult", preventExtensionSuspendConnectFromContentResult);

    return preventExtensionSuspendConnectFromContentResult;
});

const preventExtensionSuspend = () => promiseTry(
    () => {
        log("Start", "preventExtensionSuspend");

        const onMessageProducingHandler = (msg) => {
            log("preventExtensionSuspend", "onMessageProducingHandler", msg);
        };

        const messageProducer = () => {
            preventSuspensionProducingPort.postMessage("Ah, ha, ha, ha, stayin' alive, stayin' alive");
        };

        const onConnectProducingHandler = (port) => {
            log("preventExtensionSuspend", "onConnectProducingHandler", port);

            if (port.name !== preventSuspensionPortName) {
                return;
            }

            // NOTE: the chrome.runtime.onConnect event is triggered once per frame on the page.
            // Save the first port, ignore the rest.
            if (preventSuspensionProducingPort !== null) {
                return;
            }

            preventSuspensionProducingPort = port;

            preventSuspensionProducingPort.onMessage.addListener(onMessageProducingHandler);

            preventSuspensionIntervalId = setInterval(messageProducer, 1000);
        };

        chrome.runtime.onConnect.addListener(onConnectProducingHandler);

        log("Done", "preventExtensionSuspend");

        return executeConnectFromContent();
    }
);

const allowExtensionSuspend = () => promiseTry(
    () => {
        log("Start", "allowExtensionSuspend");

        if (preventSuspensionProducingPort !== null) {
            try {
                // https://developer.chrome.com/extensions/runtime#type-Port
                // NOTE: should work irregardless if the port was connected or not.
                preventSuspensionProducingPort.disconnect();
            } catch (error) {
                logError("Error", "allowExtensionSuspend", error);
            }

            preventSuspensionProducingPort = null;
        }

        clearInterval(preventSuspensionIntervalId);
        preventSuspensionIntervalId = null;

        log("Done", "allowExtensionSuspend");
    }
);

api.activity = {
    allowExtensionSuspend,
    getSpeakingTabId,
    incrementCallerId,
    isActiveTabSpeaking,
    isSpeaking,
    onlyLastCallerContinueSpeakingProvider,
    preventExtensionSuspend,
    setActiveTabAsSpeaking,
    setActiveTabIsDoneSpeaking,
    setSpeakingTabId,
};
