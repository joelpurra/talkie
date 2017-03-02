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
Broadcaster:false,
canTalkieRunInTab:false,
chrome:false,
cleanupSelections:false,
console:false,
detectPageLanguage:false,
executeLogToPage:false,
executePlugOnce:false,
executeScriptInAllFrames:false,
executeScriptInTopFrame:false,
flatten:false,
getCurrentActiveTab:false,
getCurrentActiveTabId:false,
getMappedVoices:false,
getVoices:false,
isCurrentPageInternalToTalkie:false,
knownEvents:false,
last:false,
log:false,
logError:false,
messagesLocale:false,
openUrlFromConfigurationInNewTab:false,
Promise:false,
promiseSeries:false,
promiseTry:false,
SpeechSynthesisUtterance:false,
TalkieProgress:false,
window:false,
*/

// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
log("Start", "Loading backgrund code");

const MAX_UTTERANCE_TEXT_LENGTH = 100;

const buttonDefaultTitle = chrome.i18n.getMessage("buttonDefaultTitle");
const buttonStopTitle = chrome.i18n.getMessage("buttonStopTitle");

const notAbleToSpeakTextFromThisSpecialTab = {
    text: chrome.i18n.getMessage("notAbleToSpeakTextFromThisSpecialTab"),
    effectiveLanguage: messagesLocale,
};

const setup = () => promiseTry(
    () => {
        log("Start", "Pre-requisites check");

        if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function" || typeof window.speechSynthesis.speak !== "function") {
            throw new Error("The browser does not support speechSynthesis.");
        }

        if (!("SpeechSynthesisUtterance" in window)) {
            throw new Error("The browser does not support SpeechSynthesisUtterance.");
        }

        log("Done", "Pre-requisites check");
    })
    .then(() => new Promise(
        (resolve, reject) => {
            try {
                log("Start", "Speech synthesizer check");

                // NOTE: the speech synthesizer can only be used after the voices have been loaded.
                const synthesizer = window.speechSynthesis;

                const handleVoicesChanged = () => {
                    delete synthesizer.onerror;
                    delete synthesizer.onvoiceschanged;

                    log("Variable", "synthesizer", synthesizer);

                    log("Done", "Speech synthesizer check");

                    return resolve(synthesizer);
                };

                const handleError = (event) => {
                    delete synthesizer.onerror;
                    delete synthesizer.onvoiceschanged;

                    logError("Error", "Speech synthesizer check", event);

                    return reject(null);
                };

                synthesizer.onerror = handleError;
                synthesizer.onvoiceschanged = handleVoicesChanged;
            } catch (error) {
                return reject(error);
            }
        }
    ))
    .then((synthesizer) => {
        log("Start", "Voices check");

        return getMappedVoices()
            .then((voices) => {
                log("Variable", "voices[]", voices.length, voices);

                log("Done", "Voices check");

                return synthesizer;
            });
    }
);

const stopSpeaking = (broadcaster, synthesizer) => promiseTry(
    () => {
        const eventData = {};

        return Promise.resolve()
            .then(() => broadcaster.broadcastEvent(knownEvents.stopSpeaking, eventData))
            .then(() => {
                synthesizer.cancel();

                return undefined;
            });
    }
);

const speakPartOfText = (synthesizer, textPart, voice) => new Promise(
    (resolve, reject) => {
        try {
            log("Start", "speakPartOfText", `Speak text part (length ${textPart.length}): "${textPart}"`);

            const utterance = new SpeechSynthesisUtterance(textPart);

            // TODO: options for per-language voice , pitch, rate?
            // utterance.pitch = [0,2];
            // utterance.rate = [0.1,10];
            utterance.voice = voice;

            log("Variable", "utterance", utterance);

            const handleEnd = (event) => {
                delete utterance.onend;
                delete utterance.onerror;

                log("End", "speakPartOfText", `Speak text part (length ${textPart.length}) spoken in ${event.elapsedTime} milliseconds.`);

                return resolve();
            };

            const handleError = (event) => {
                delete utterance.onend;
                delete utterance.onerror;

                logError("Error", "speakPartOfText", `Speak text part (length ${textPart.length})`, event);

                return reject();
            };

            utterance.onend = handleEnd;
            utterance.onerror = handleError;

            // The actual act of speaking the text.
            synthesizer.speak(utterance);

            if (synthesizer.paused) {
                synthesizer.resume();
            }

            log("Variable", "synthesizer", synthesizer);

            log("Done", "speakPartOfText", `Speak text part (length ${textPart.length})`);
        } catch (error) {
            return reject(error);
        }
    }
);

const splitTextToParagraphs = (text) => {
    // NOTE: in effect discarding empty paragraphs.
    return text.split(/\n+/);
};

const splitTextToSentencesOfMaxLength = (text, maxPartLength) => {
    // NOTE: in effect merging multiple spaces in row to a single space.
    const spacedTextParts = text.split(/ +/);

    const naturalPauseRx = /(^--?$|[.,!?:;]$)/;

    const textParts = spacedTextParts.reduce((newParts, spacedTextPart) => {
        const appendToText = (ttt) => {
            if (last(newParts) === "") {
                newParts[newParts.length - 1] = ttt;
            } else {
                newParts[newParts.length - 1] += " " + ttt;
            }
        };

        const appendPart = (ttt) => {
            newParts[newParts.length] = ttt;
        };

        if (naturalPauseRx.test(spacedTextPart)) {
            appendToText(spacedTextPart);

            appendPart("");
        } else if ((last(newParts).length + 1 + spacedTextPart.length) < maxPartLength) {
            appendToText(spacedTextPart);
        } else {
            appendPart(spacedTextPart);
        }

        return newParts;
    }, [""]);

    // NOTE: cleaning empty strings "just in case".
    const cleanTextParts = textParts.filter((textPart) => textPart.trim().length > 0);

    return cleanTextParts;
};

const getActualVoice = (mappedVoice) => promiseTry(
    () => {
        log("Start", "getActualVoice", mappedVoice);

        return getVoices()
            .then((voices) => {
                const actualMatchingVoicesByName = voices.filter((voice) => mappedVoice.name && (voice.name === mappedVoice.name));
                const actualMatchingVoicesByLanguage = voices.filter((voice) => mappedVoice.lang && (voice.lang === mappedVoice.lang));
                const actualMatchingVoicesByLanguagePrefix = voices.filter((voice) => mappedVoice.lang && (voice.lang.substr(0, 2) === mappedVoice.lang.substr(0, 2)));

                const actualVoices = []
                    .concat(actualMatchingVoicesByName)
                    .concat(actualMatchingVoicesByLanguage)
                    .concat(actualMatchingVoicesByLanguagePrefix);

                if (actualVoices.length === 0) {
                    throw new Error(`Could not find any matching voice: ${JSON.stringify(mappedVoice)}`);
                }

                // NOTE: while there might be more than one voice for the particular voice name/language/language prefix, just consistently pick the first one.
                // if (actualMatchingVoices.length !== 1) {
                //     throw new Error(`Found other matching voices: ${JSON.stringify(mappedVoice)} ${actualMatchingVoices.length}`);
                // }

                const actualVoice = actualVoices[0];

                log("Done", "getActualVoice", mappedVoice, actualVoice);

                return actualVoice;
            })
            .catch((error) => {
                logError("Error", "getActualVoice", mappedVoice, error);

                throw error;
            });
    }
);

const splitAndSpeak = (broadcaster, synthesizer, text, voice, shouldContinueSpeakingProvider) => promiseTry(
    () => {
        log("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

        const speakingEventData = {
            text: text,
            voice: voice.name,
            language: voice.lang,
        };

        return Promise.resolve()
            .then(() => broadcaster.broadcastEvent(knownEvents.beforeSpeaking, speakingEventData))
            .then(() => getActualVoice(voice))
            .then((actualVoice) => {
                const paragraphs = splitTextToParagraphs(text);
                const cleanTextParts = paragraphs.map((paragraph) => splitTextToSentencesOfMaxLength(paragraph, MAX_UTTERANCE_TEXT_LENGTH));
                const textParts = flatten(cleanTextParts);

                const textPartsPromises = textParts.map((textPart) => () => {
                    const speakingPartEventData = {
                        textPart: textPart,
                        voice: voice.name,
                        language: voice.lang,
                    };

                    return shouldContinueSpeakingProvider()
                        .then((shouldContinueSpeaking) => {
                            if (shouldContinueSpeaking) {
                                return Promise.resolve()
                                    .then(() => broadcaster.broadcastEvent(knownEvents.beforeSpeakingPart, speakingPartEventData))
                                    .then(() => speakPartOfText(synthesizer, textPart, actualVoice))
                                    .then(() => broadcaster.broadcastEvent(knownEvents.afterSpeakingPart, speakingPartEventData));
                            }

                            return undefined;
                        });
                });

                return promiseSeries(textPartsPromises);
            })
            .then(() => broadcaster.broadcastEvent(knownEvents.afterSpeaking, speakingEventData));
    }
);

const speakTextInVoice = (broadcaster, synthesizer, text, voice) => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => {
                executeLogToPage(`Speaking text (length ${text.length}, ${voice.name}, ${voice.lang}): ${text}`);

                return splitAndSpeak(broadcaster, synthesizer, text, voice, onlyLastCallerContinueSpeakingProvider());
            })
            .then(() => log("Done", "speakTextInVoice", `Speak text (length ${text.length}, ${voice.name}, ${voice.lang})`));
    }
);

const speakTextInLanguage = (broadcaster, synthesizer, text, language) => promiseTry(
    () => {
        const voice = {
            name: null,
            lang: language,
        };

        return Promise.resolve()
            .then(() => {
                return speakTextInVoice(broadcaster, synthesizer, text, voice);
            })
            .then(() => log("Done", "speakTextInLanguage", `Speak text (length ${text.length}, ${language})`));
    }
);

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

            if (preventSuspensionProducingPort) {
                throw new Error("The preventSuspensionProducingPort was already set.");
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

        if (preventSuspensionProducingPort) {
            // https://developer.chrome.com/extensions/runtime#type-Port
            preventSuspensionProducingPort.disconnect();
            preventSuspensionProducingPort = null;
        }

        clearInterval(preventSuspensionIntervalId);
        preventSuspensionIntervalId = null;

        log("Done", "allowExtensionSuspend");
    }
);

const executeGetFramesSelectionTextAndLanguageCode = "function talkieGetParentElementLanguages(element) { return [].concat(element && element.getAttribute(\"lang\")).concat(element.parentElement && talkieGetParentElementLanguages(element.parentElement)); }; var talkieSelectionData = { text: document.getSelection().toString(), htmlTagLanguage: document.getElementsByTagName(\"html\")[0].getAttribute(\"lang\"), parentElementsLanguages: talkieGetParentElementLanguages(document.getSelection().rangeCount > 0 && document.getSelection().getRangeAt(0).startContainer.parentElement) }; talkieSelectionData";
const executeGetFramesSelectionTextAndLanguage = () => executeScriptInAllFrames(executeGetFramesSelectionTextAndLanguageCode).then((framesSelectionTextAndLanguage) => {
    log("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

    return framesSelectionTextAndLanguage;
});

const detectLanguagesAndSpeakAllSelections = (broadcaster, synthesizer, selections, detectedPageLanguage) => promiseTry(() => {
    log("Start", "Speaking all selections");

    log("Variable", `selections (length ${selections && selections.length || 0})`, selections);

    return promiseTry(() => getVoices())
        .then((allVoices) => cleanupSelections(allVoices, detectedPageLanguage, selections))
        .then((cleanedupSelections) => {
            log("Variable", `cleanedupSelections (length ${cleanedupSelections && cleanedupSelections.length || 0})`, cleanedupSelections);

            const speakPromises = cleanedupSelections.map((selection) => {
                log("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

                return speakTextInLanguage(broadcaster, synthesizer, selection.text, selection.effectiveLanguage);
            });

            log("Done", "Speaking all selections");

            return Promise.all(speakPromises);
        });
});

const speakUserSelection = (broadcaster, synthesizer) => promiseTry(() => {
    log("Start", "Speaking selection");

    return Promise.all(
        [
            executeGetFramesSelectionTextAndLanguage(),
            detectPageLanguage(),
        ]
    )
        .then(([framesSelectionTextAndLanguage, detectedPageLanguage]) => {
            return detectLanguagesAndSpeakAllSelections(broadcaster, synthesizer, framesSelectionTextAndLanguage, detectedPageLanguage);
        })
        .then(() => log("Done", "Speaking selection"));
});

const getIconModePaths = (name) => {
    return {
        // NOTE: icons in use before Chrome 53 were 19x19 and 38x38.
        // NOTE: icons in use from Chrome 53 (switching to Material design) are 16x16 and 32x32.
        // NOTE: keeping larger icons to accomodate future changes.
        "16": `resources/icon/icon-${name}/icon-16x16.png`,
        "32": `resources/icon/icon-${name}/icon-32x32.png`,
        "48": `resources/icon/icon-${name}/icon-48x48.png`,
        "64": `resources/icon/icon-${name}/icon-64x64.png`,

        // NOTE: passing the larger icons slowed down the UI by several hundred milliseconds per icon switch.
        // "128": `resources/icon/icon-${name}/icon-128x128.png`,
        // "256": `resources/icon/icon-${name}/icon-256x256.png`,
        // "512": `resources/icon/icon-${name}/icon-512x512.png`,
        // "1024": `resources/icon/icon-${name}/icon-1024x1024.png`,
    };
};

const setIconMode = (name) => new Promise(
    (resolve, reject) => {
        try {
            log("Start", "Changing icon to", name);

            const paths = getIconModePaths(name);
            const details = {
                path: paths,
            };

            chrome.browserAction.setIcon(
                details,
                () => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    log("Done", "Changing icon to", name);

                    resolve();
                }
            );
        } catch (error) {
            return reject(error);
        }
    }
);

const setIconModePlaying = () => setIconMode("stop");
const setIconModeStopped = () => setIconMode("play");

const createContextMenu = (contextMenuOptions) => new Promise(
    (resolve, reject) => {
        try {
            log("Start", "Creating context menu", contextMenuOptions);

            chrome.contextMenus.create(
                contextMenuOptions,
                () => {
                    if (chrome.runtime.lastError) {
                        return reject(chrome.runtime.lastError);
                    }

                    log("Done", "Creating context menu", contextMenuOptions);

                    resolve();
                }
            );
        } catch (error) {
            return reject(error);
        }
    }
);

const disablePopup = () => {
    const disablePopupOptions = {
        popup: "",
    };

    chrome.browserAction.setPopup(disablePopupOptions);

    const disableIconTitleOptions = {
        title: buttonStopTitle,
    };

    chrome.browserAction.setTitle(disableIconTitleOptions);
};

const enablePopup = () => {
    const enablePopupOptions = {
        popup: "src/popup-start.html",
    };

    chrome.browserAction.setPopup(enablePopupOptions);

    const enableIconTitleOptions = {
        title: buttonDefaultTitle,
    };

    chrome.browserAction.setTitle(enableIconTitleOptions);
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

    const commandHandler = (command) => {
        log("Start", "commandHandler", command);

        const commandAction = commandMap[command];

        if (typeof commandAction !== "function") {
            throw new Error("Bad command action for command: " + command);
        }

        return commandAction()
            .then((result) => {
                log("Done", "commandHandler", command, result);

                return undefined;
            })
            .catch((error) => {
                logError("Error", "commandHandler", command, error);

                throw error;
            });
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

    const contextMenuOptions = {
        selectionContextMenuStartStop: {
            id: "talkie-context-menu-start-stop",
            title: chrome.i18n.getMessage("contextMenuStartStopText"),
            contexts: [
                "selection",
            ],
        },
        buttonContextMenuStartStopDescription: {
            id: "start-stop",
            title: chrome.i18n.getMessage("commandStartStopDescription"),
            contexts: [
                "browser_action",
            ],
        },
        buttonContextMenuOpenWebsiteMainDescription: {
            id: "open-website-main",
            title: chrome.i18n.getMessage("commandOpenWebsiteMainDescription"),
            contexts: [
                "browser_action",
            ],
        },
        buttonContextMenuOpenWebsiteChromeWebStoreDescription: {
            id: "open-website-chromewebstore",
            title: chrome.i18n.getMessage("commandOpenWebsiteChromeWebStoreDescription"),
            contexts: [
                "browser_action",
            ],
        },
        buttonContextMenuOpenWebsiteDonateDescription: {
            id: "open-website-donate",
            title: chrome.i18n.getMessage("commandOpenWebsiteDonateDescription"),
            contexts: [
                "browser_action",
            ],
        },
    };

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

                    if (id === contextMenuOptions.selectionContextMenuStartStop.id) {
                        if (!selection || typeof selection !== "string" || selection.length === 0) {
                            throw new Error("Unknown context menu click action selection was empty.");
                        }

                        return stopSpeakingAction()
                            .then(() => startSpeakingCustomTextDetectLanguage(selection));
                    }

                    // NOTE: context menu items default to being commands.
                    return commandHandler(id);
                }
            )
                .then(() => {
                    log("Done", "contextMenuClickAction", info);

                    return undefined;
                });
        }
    );

    const createContextMenus = () => {
        const contextMenuOptionsPromises = Object.keys(contextMenuOptions).map((contextMenuOptionsKey) => {
            const contextMenuOption = contextMenuOptions[contextMenuOptionsKey];

            return createContextMenu(contextMenuOption);
        });

        return Promise.all(contextMenuOptionsPromises);
    };

    const onExtensionInstalledHandler = () => {
        createContextMenus();
    };

    const shortcutKeyCommandHandler = (command) => {
        log("Start", "shortcutKeyCommandHandler", command);

        // NOTE: straight mapping from command to action.
        return commandHandler(command)
            .then((result) => {
                log("Done", "shortcutKeyCommandHandler", command, result);

                return undefined;
            })
            .catch((error) => {
                logError("Error", "shortcutKeyCommandHandler", command, error);

                throw error;
            });
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
        () => setup()
            .then((result) => {
                synthesizer = result;

                return undefined;
            })
    );
}());

log("Done", "Loading backgrund code");
