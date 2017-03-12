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
allowExtensionSuspend:false,
Broadcaster:false,
canTalkieRunInTab:false,
chrome:false,
commandHandler:false,
console:false,
contextMenuOptionsCollection:false,
createContextMenu:false,
detectLanguagesAndSpeakAllSelections:false,
detectPageLanguage:false,
disablePopup:false,
enablePopup:false,
executePlugOnce:false,
getSynthesizer:false,
incrementCallerId:false,
isCurrentPageInternalToTalkie:false,
isSpeaking:false,
isSpeakingTabId:false,
knownEvents:false,
log:false,
logError:false,
messagesLocale:false,
openUrlFromConfigurationInNewTab:false,
preventExtensionSuspend:false,
Promise:false,
promiseTry:false,
setActiveTabAsSpeaking:false,
setActiveTabIsDoneSpeaking:false,
setIconModePlaying:false,
setIconModeStopped:false,
setTabIsDoneSpeaking:false,
shortcutKeyCommandHandler:false,
speakTextInLanguage:false,
speakTextInVoice:false,
speakUserSelection:false,
stopSpeaking:false,
TalkieProgress:false,
window:false,
*/

// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
log("Start", "Loading backgrund code");

log("Locale (@@ui_locale)", uiLocale);
log("Locale (messages.json)", messagesLocale);

const notAbleToSpeakTextFromThisSpecialTab = {
    text: chrome.i18n.getMessage("notAbleToSpeakTextFromThisSpecialTab"),
    effectiveLanguage: messagesLocale,
};

(function main() {
    // NOTE: using a chainer to be able to add click-driven speech events one after another.
    let rootChainPromise = Promise.resolve();

    const rootChainPromiseCatcher = (error) => {
        logError("rootChainPromiseCatcher", error);
    };

    const rootChain = (promise) => {
        rootChainPromise = rootChainPromise
        .then(promise)
        .catch(rootChainPromiseCatcher);
    };

    // NOTE: while not strictly necessary, keep and pass a reference to the global (initialized) synthesizer.
    let synthesizer = null;

    const speakSelectionOnPage = () => promiseTry(
        () => {
            return Promise.all([
                canTalkieRunInTab(),
                isCurrentPageInternalToTalkie(),
            ])
                .then(([canRun, isInternalPage]) => {
                    // NOTE: can't perform (most) actions if it's not a "normal" tab.
                    if (!canRun) {
                        log("iconClickAction", "Did not detect a normal tab, skipping.");

                        // NOTE: don't "warn" about internal pages opening.
                        if (isInternalPage) {
                            log("iconClickAction", "Detected internal page, skipping warning.");

                            return undefined;
                        }

                        const text = notAbleToSpeakTextFromThisSpecialTab.text;
                        const lang = notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage;

                        return speakTextInLanguage(broadcaster, synthesizer, text, lang);
                    }

                    return speakUserSelection(broadcaster, synthesizer);
                });
        }
    );

    const startStopSpeakSelectionOnPage = () => promiseTry(
        () => {
            return isSpeaking()
                .then((wasSpeaking) => stopSpeaking(broadcaster, synthesizer)
                    .then(() => {
                        if (!wasSpeaking) {
                            return rootChain(() => speakSelectionOnPage());
                        }

                        return undefined;
                    }));
        }
    );

    const iconClickAction = () => startStopSpeakSelectionOnPage();

    const commandMap = {
        // NOTE: implicitly set by the browser, and actually "clicks" the Talkie icon.
        // Handled by the popup handler (popup contents) and icon click handler.
        // "_execute_browser_action": iconClickAction,
        "start-stop": iconClickAction,
        "open-website-main": () => openUrlFromConfigurationInNewTab("main"),
        "open-website-chromewebstore": () => openUrlFromConfigurationInNewTab("chromewebstore"),
        "open-website-donate": () => openUrlFromConfigurationInNewTab("donate"),
    };

    const stopSpeakingAction = () => promiseTry(
        () => {
            return stopSpeaking(broadcaster, synthesizer);
        }
    );

    const startSpeakingTextInVoiceAction = (text, voice) => promiseTry(
        () => {
            return stopSpeaking(broadcaster, synthesizer)
                .then(() => rootChain(() => speakTextInVoice(broadcaster, synthesizer, text, voice)));
        }
    );

    const startSpeakingCustomTextDetectLanguage = (text) => promiseTry(
        () => canTalkieRunInTab()
            .then((canRun) => {
                if (canRun) {
                    return detectPageLanguage();
                }

                log("startSpeakingCustomTextDetectLanguage", "Did not detect a normal tab, skipping page language detection.");

                return null;
            })
            .then((detectedPageLanguage) => {
                const selections = [
                    {
                        text: text,
                        htmlTagLanguage: null,
                        parentElementsLanguages: [],
                    },
                ];

                return detectLanguagesAndSpeakAllSelections(broadcaster, synthesizer, selections, detectedPageLanguage);
            })
    );

    const contextMenuClickAction = (info) => promiseTry(
        () => {
            log("Start", "contextMenuClickAction", info);

            if (!info) {
                throw new Error("Unknown context menu click action info object.");
            }

            return promiseTry(
                () => {
                    const id = info.menuItemId;
                    const selection = info.selectionText || null;

                    if (id === contextMenuOptionsCollection.selectionContextMenuStartStop.id) {
                        if (!selection || typeof selection !== "string" || selection.length === 0) {
                            throw new Error("Unknown context menu click action selection was empty.");
                        }

                        return stopSpeakingAction()
                            .then(() => startSpeakingCustomTextDetectLanguage(selection));
                    }

                    // NOTE: context menu items default to being commands.
                    return commandHandler(commandMap, id);
                }
            )
                .then(() => {
                    log("Done", "contextMenuClickAction", info);

                    return undefined;
                });
        }
    );

    const createContextMenus = () => {
        const contextMenuOptionsCollectionPromises = Object.keys(contextMenuOptionsCollection).map((contextMenuOptionsCollectionKey) => {
            const contextMenuOption = contextMenuOptionsCollection[contextMenuOptionsCollectionKey];

            return createContextMenu(contextMenuOption);
        });

        return Promise.all(contextMenuOptionsCollectionPromises);
    };

    const onExtensionInstalledHandler = () => {
        createContextMenus();
    };

    const onTabRemovedHandler = (tabId) => {
        return isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                if (isTabSpeaking) {
                    return stopSpeaking(broadcaster, synthesizer)
                        .then(() => setTabIsDoneSpeaking(tabId));
                }

                return undefined;
            });
    };

    const onTabUpdatedHandler = (tabId, changeInfo) => {
        return isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                // NOTE: changeInfo only has properties which have changed.
                // https://developer.chrome.com/extensions/tabs#event-onUpdated
                if (isTabSpeaking && changeInfo.url) {
                    return stopSpeaking(broadcaster, synthesizer)
                        .then(() => setTabIsDoneSpeaking(tabId));
                }

                return undefined;
            });
    };

    const onExtensionSuspendHandler = () => {
        log("Start", "onExtensionSuspendHandler");

        return isSpeaking()
            .then((talkieIsSpeaking) => {
                // Clear all text if Talkie was speaking.
                if (talkieIsSpeaking) {
                    return stopSpeaking();
                }

                return undefined;
            })
            .then(() => {
                // Reset the system to resume playback, just to be nice to the world.
                synthesizer.resume();

                log("Done", "onExtensionSuspendHandler");

                return undefined;
            });
    };

    const broadcaster = new Broadcaster();
    broadcaster.start();

    broadcaster.registerListeningAction(knownEvents.stopSpeaking, () => incrementCallerId());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => incrementCallerId());

    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => executePlugOnce());

    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => setActiveTabAsSpeaking());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => setActiveTabIsDoneSpeaking());

    // NOTE: setting icons async.
    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => { setTimeout(() => setIconModePlaying(), 10); return undefined; });
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => { setTimeout(() => setIconModeStopped(), 10); return undefined; });

    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => disablePopup());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => enablePopup());

    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => preventExtensionSuspend());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => allowExtensionSuspend());

    const progress = new TalkieProgress(broadcaster);

    progress.start()
        .then((result) => log("Done", "progress.start()", result))
        .catch((error) => logError("Error", "progress.start()", error));

    window.broadcaster = broadcaster;
    window.iconClick = iconClickAction;
    window.log = log;
    window.logError = logError;
    window.progress = progress;

    window.stopSpeakFromFrontend = stopSpeakingAction;
    window.startSpeakFromFrontend = startSpeakingTextInVoiceAction;

    chrome.runtime.onInstalled.addListener(onExtensionInstalledHandler);

    chrome.tabs.onRemoved.addListener(onTabRemovedHandler);
    chrome.tabs.onUpdated.addListener(onTabUpdatedHandler);
    chrome.runtime.onSuspend.addListener(onExtensionSuspendHandler);

    // NOTE: used when the popup has been disabled.
    chrome.browserAction.onClicked.addListener(iconClickAction);

    chrome.commands.onCommand.addListener(shortcutKeyCommandHandler);

    chrome.contextMenus.onClicked.addListener(contextMenuClickAction);
    enablePopup();

    rootChain(
        () => getSynthesizer()
            .then((result) => {
                synthesizer = result;

                return undefined;
            })
    );
}());

log("Done", "Loading backgrund code");
