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
console:false,
executeLogToPage:false,
executeScriptInAllFrames:false,
executeScriptInTopFrame:false,
executePlugOnce:false,
flatten:false,
getMappedVoices:false,
getVoices:false,
isCurrentPageInternalToTalkie:false,
isUndefinedOrNullOrEmptyOrWhitespace:false,
knownEvents:false,
last:false,
log:false,
logError:false,
openUrlFromConfigurationInNewTab:false,
Promise:false,
promiseSeries:false,
promiseTry:false,
shallowCopy:false,
SpeechSynthesisUtterance:false,
TalkieProgress:false,
window:false,
*/

// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
log("Start", "Loading code");

const uiLocale = chrome.i18n.getMessage("@@ui_locale");
const messagesLocale = chrome.i18n.getMessage("extensionLocale");

log("Locale (@@ui_locale)", uiLocale);
log("Locale (messages.json)", messagesLocale);

const MAX_UTTERANCE_TEXT_LENGTH = 100;

const buttonDefaultTitle = chrome.i18n.getMessage("buttonDefaultTitle");
const buttonStopTitle = chrome.i18n.getMessage("buttonStopTitle");

const noTextSelectedMessage = {
    text: chrome.i18n.getMessage("noTextSelectedMessage"),
    effectiveLanguage: messagesLocale,
};

const noVoiceForLanguageDetectedMessage = {
    text: chrome.i18n.getMessage("noVoiceForLanguageDetectedMessage"),
    effectiveLanguage: chrome.i18n.getMessage("noVoiceForLanguageDetectedMessageLanguage"),
};

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
    })
    .then((synthesizer) => {
        const unload = () => {
            log("Start", "Unloading");

            return executeGetTalkieIsSpeaking()
                .then((talkieIsSpeaking) => {
                    // Clear all text if Talkie was speaking.
                    if (talkieIsSpeaking) {
                        // TODO: use stopSpeaking()?
                        synthesizer.cancel();
                    }

                    return undefined;
                })
                .then(() => {
                    // Reset the system to resume playback, just to be nice to the world.
                    synthesizer.resume();

                    log("Done", "Unloading");

                    return undefined;
                });
        };

        chrome.runtime.onSuspend.addListener(unload);

        return synthesizer;
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

const speakWithoutPageContext = splitAndSpeak;

const speakInPageContext = (broadcaster, synthesizer, text, language) => promiseTry(
    () => {
        const voice = {
            name: null,
            lang: language,
        };

        return Promise.resolve()
            .then(() => executeAddOnBeforeUnloadHandlers())
            .then(() => promiseTry(
                () => {
                    executeLogToPage(`Speaking text: ${text}`);

                    return executeSetTalkieIsSpeaking()
                        .then(() => splitAndSpeak(broadcaster, synthesizer, text, voice, onlyLastCallerContinueSpeakingProvider()));
                }
            ))
            .then(() => log("Done", "speakInPageContext", `Speak text (length ${text.length})`));
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

const executeGetTalkieIsSpeakingCode = "window.talkieIsSpeaking;";
const executeGetTalkieIsSpeaking = () => executeScriptInTopFrame(executeGetTalkieIsSpeakingCode)
    .then((talkieIsSpeaking) => {
        return talkieIsSpeaking === "true";
    });

const executeSetTalkieIsSpeakingCode = "window.talkieIsSpeaking = true;";
const executeSetTalkieIsSpeaking = () => executeScriptInTopFrame(executeSetTalkieIsSpeakingCode);

const executeSetTalkieIsNotSpeakingCode = "window.talkieIsSpeaking = null;";
const executeSetTalkieIsNotSpeaking = () => executeScriptInTopFrame(executeSetTalkieIsNotSpeakingCode);

const executeAddOnBeforeUnloadHandlersCode = "window.talkieIsSpeaking === undefined && window.addEventListener(\"beforeunload\", function () { window.talkieIsSpeaking && window.speechSynthesis.cancel(); });";
const executeAddOnBeforeUnloadHandlers = () => executeScriptInTopFrame(executeAddOnBeforeUnloadHandlersCode);

const executeGetFramesSelectionTextAndLanguageCode = "function talkieGetParentElementLanguages(element) { return [].concat(element && element.getAttribute(\"lang\")).concat(element.parentElement && talkieGetParentElementLanguages(element.parentElement)); }; var talkieSelectionData = { text: document.getSelection().toString(), htmlTagLanguage: document.getElementsByTagName(\"html\")[0].getAttribute(\"lang\"), parentElementsLanguages: talkieGetParentElementLanguages(document.getSelection().rangeCount > 0 && document.getSelection().getRangeAt(0).startContainer.parentElement) }; talkieSelectionData";
const executeGetFramesSelectionTextAndLanguage = () => executeScriptInAllFrames(executeGetFramesSelectionTextAndLanguageCode).then((framesSelectionTextAndLanguage) => {
    log("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

    return framesSelectionTextAndLanguage;
});

const detectPageLanguage = () => new Promise(
    (resolve, reject) => {
        try {
            chrome.tabs.detectLanguage((language) => {
                // https://developer.chrome.com/extensions/tabs#method-detectLanguage
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                log("detectPageLanguage", "Browser detected primary page language", language);

                // The language fallback value is "und", so treat it as no language.
                if (!language || typeof language !== "string" || language === "und") {
                    return resolve(null);
                }

                return resolve(language);
            });
        } catch (error) {
            return reject(error);
        }
    }
);

const detectTextLanguage = (text) => new Promise(
    (resolve, reject) => {
        try {
            if (!("detectLanguage" in chrome.i18n)) {
                // NOTE: text-based language detection is only used as a fallback.
                log("detectTextLanguage", "Browser does not support detecting text language");

                return resolve(null);
            }

            chrome.i18n.detectLanguage(text, (result) => {
                // https://developer.chrome.com/extensions/i18n#method-detectLanguage
                if (chrome.runtime.lastError) {
                    return reject(chrome.runtime.lastError);
                }

                // The language fallback value is "und", so treat it as no language.
                if (
                    !result.isReliable
                    || !result.languages
                    || !(result.languages.length > 0)
                    || typeof result.languages[0].language !== "string"
                    || !(result.languages[0].language.trim().length > 0)
                    || result.languages[0].language === "und"
                ) {
                    // NOTE: text-based language detection is only used as a fallback.
                    log("detectTextLanguage", "Browser did not detect reliable text language", result);

                    return resolve(null);
                }

                const primaryDetectedTextLanguage = result.languages[0].language;

                log("detectTextLanguage", "Browser detected reliable text language", result, primaryDetectedTextLanguage);

                return resolve(primaryDetectedTextLanguage);
            });
        } catch (error) {
            return reject(error);
        }
    }
);

const cleanupSelections = (allVoices, detectedPageLanguage, selections) => promiseTry(
    () => {
        const isNonNullObject = (selection) => !!selection && typeof selection === "object";

        const hasValidText = (selection) => !isUndefinedOrNullOrEmptyOrWhitespace(selection.text);

        const trimText = (selection) => {
            const copy = shallowCopy(selection);

            copy.text = copy.text.trim();

            return copy;
        };

        const selectionsWithValidText = selections
        .filter(isNonNullObject)
        .filter(hasValidText)
        .map(trimText)
        .filter(hasValidText);

        return selectionsWithValidText;
    })
    .then((selectionsWithValidText) => Promise.all(
        selectionsWithValidText.map(
            (selection) => {
                const copy = shallowCopy(selection);

                return detectTextLanguage(copy.text)
                    .then((detectedTextLanguage) => {
                        copy.detectedTextLanguage = detectedTextLanguage;

                        return copy;
                    });
            })
        )
    )
    .then((selectionsWithValidTextAndDetectedLanguage) => {
        const isKnownVoiceLanguage = (elementLanguage) => allVoices.some((voice) => voice.lang.startsWith(elementLanguage));

        // https://www.iso.org/obp/ui/#iso:std:iso:639:-1:ed-1:v1:en
        // https://en.wikipedia.org/wiki/ISO_639-1
        // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
        // http://xml.coverpages.org/iso639a.html
        // NOTE: discovered because Twitter seems to still use "iw".
        const iso639Dash1Aliases1988To2002 = {
            "in": "id",
            "iw": "he",
            "ji": "yi",
        };

        const mapIso639Aliases = (language) => {
            return iso639Dash1Aliases1988To2002[language] || language;
        };

        const isValidString = (str) => !isUndefinedOrNullOrEmptyOrWhitespace(str);

        const cleanupLanguagesArray = (languages) => {
            const copy = (languages || [])
            .filter(isValidString)
            .map(mapIso639Aliases)
            .filter(isKnownVoiceLanguage);

            return copy;
        };

        const cleanupParentElementsLanguages = (selection) => {
            const copy = shallowCopy(selection);

            copy.parentElementsLanguages = cleanupLanguagesArray(copy.parentElementsLanguages);

            return copy;
        };

        const getMoreSpecificLanguagesWithPrefix = (prefix) => {
            return (language) => language.startsWith(prefix) && language.length > prefix.length;
        };

        const setEffectiveLanguage = (selection) => {
            const copy = shallowCopy(selection);

            const detectedLanguages = [
                copy.detectedTextLanguage,
                copy.parentElementsLanguages[0] || null,
                copy.htmlTagLanguage,
                detectedPageLanguage,
            ];

            log("setEffectiveLanguage", "detectedLanguages", detectedLanguages);

            const cleanedLanguages = cleanupLanguagesArray(detectedLanguages);

            log("setEffectiveLanguage", "cleanedLanguages", cleanedLanguages);

            const primaryLanguagePrefix = cleanedLanguages[0] || null;

            log("setEffectiveLanguage", "primaryLanguagePrefix", primaryLanguagePrefix);

            // NOTE: if there is a more specific language with the same prefix among the detected languages, prefer it.
            const cleanedLanguagesWithPrimaryPrefix = cleanedLanguages.filter(getMoreSpecificLanguagesWithPrefix(primaryLanguagePrefix));

            log("setEffectiveLanguage", "cleanedLanguagesWithPrimaryPrefix", cleanedLanguagesWithPrimaryPrefix);

            const effectiveLanguage = cleanedLanguagesWithPrimaryPrefix[0] || cleanedLanguages[0] || null;

            log("setEffectiveLanguage", "effectiveLanguage", effectiveLanguage);

            copy.effectiveLanguage = effectiveLanguage;

            executeLogToPage("Language", "Selected text language:", copy.detectedTextLanguage);
            executeLogToPage("Language", "Selected text element language:", copy.parentElementsLanguages[0] || null);
            executeLogToPage("Language", "HTML tag language:", copy.htmlTagLanguage);
            executeLogToPage("Language", "Detected page language:", detectedPageLanguage);
            executeLogToPage("Language", "Effective language:", copy.effectiveLanguage);

            return copy;
        };

        const mapResults = (selection) => {
            return {
                text: selection.text,
                effectiveLanguage: selection.effectiveLanguage,
            };
        };

        const fallbackMessageForNoLanguageDetected = (selection) => {
            if (selection.effectiveLanguage === null) {
                return noVoiceForLanguageDetectedMessage;
            }

            return selection;
        };

        const selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = selectionsWithValidTextAndDetectedLanguage.map(cleanupParentElementsLanguages)
        .map(setEffectiveLanguage)
        .map(fallbackMessageForNoLanguageDetected)
        .map(mapResults);

        if (selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage.length === 0) {
            log("Empty filtered selections");

            selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage.push(noTextSelectedMessage);
        }

        return selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage;
    }
);

const speakAllSelections = (broadcaster, synthesizer, selections, detectedPageLanguage) => promiseTry(() => {
    log("Start", "Speaking all selections");

    log("Variable", `selections (length ${selections && selections.length || 0})`, selections);

    return promiseTry(() => getVoices())
        .then((allVoices) => cleanupSelections(allVoices, detectedPageLanguage, selections))
        .then((cleanedupSelections) => {
            log("Variable", `cleanedupSelections (length ${cleanedupSelections && cleanedupSelections.length || 0})`, cleanedupSelections);

            const speakPromises = cleanedupSelections.map((selection) => {
                log("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

                return speakInPageContext(broadcaster, synthesizer, selection.text, selection.effectiveLanguage);
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
            return speakAllSelections(broadcaster, synthesizer, framesSelectionTextAndLanguage, detectedPageLanguage);
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

    rootChain(
        () => setup()
            .then((result) => {
                synthesizer = result;

                return undefined;
            })
    );

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

                        const voice = {
                            name: null,
                            lang: notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage,
                        };

                        return speakWithoutPageContext(broadcaster, synthesizer, text, voice, onlyLastCallerContinueSpeakingProvider());
                    }

                    return speakUserSelection(broadcaster, synthesizer);
                });
        }
    );

    const startStopSpeakSelectionOnPage = () => promiseTry(
        () => {
            // TODO: internal check to see if Talkie was speaking?
            const wasSpeaking = synthesizer.speaking === true;

            return stopSpeaking(broadcaster, synthesizer)
                .then(() => {
                    if (!wasSpeaking) {
                        return rootChain(() => speakSelectionOnPage());
                    }

                    return undefined;
                });
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

    const shortcutKeyCommandHandler = (command) => {
        log("Start", "shortcutKeyCommandHandler", command);

        const commandAction = commandMap[command];

        if (typeof commandAction !== "function") {
            throw new Error("Bad command action for command: " + command);
        }

        return commandAction()
            .then((result) => {
                log("Done", "shortcutKeyCommandHandler", command, result);

                return undefined;
            })
            .catch((error) => {
                logError("Error", "shortcutKeyCommandHandler", command, error);

                throw error;
            });
    };

    const broadcaster = new Broadcaster();
    broadcaster.start();

    broadcaster.registerListeningAction(knownEvents.stopSpeaking, () => incrementCallerId());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => incrementCallerId());

    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => executePlugOnce());

    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => executeSetTalkieIsSpeaking());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => executeSetTalkieIsNotSpeaking());

    // NOTE: setting icons async.
    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => { setTimeout(() => setIconModePlaying(), 10); return undefined; });
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => { setTimeout(() => setIconModeStopped(), 10); return undefined; });

    broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => disablePopup());
    broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => enablePopup());

    const progress = new TalkieProgress(broadcaster);

    progress.start()
        .then((result) => log("Done", "progress.start()", result))
        .catch((error) => logError("Error", "progress.start()", error));

    window.broadcaster = broadcaster;
    window.iconClick = iconClickAction;
    window.log = log;
    window.logError = logError;
    window.progress = progress;

    window.stopSpeakFromFrontend = () => promiseTry(
        () => {
            return stopSpeaking(broadcaster, synthesizer);
        }
    );

    window.startSpeakFromFrontend = (text, voice) => promiseTry(
        () => {
            return stopSpeaking(broadcaster, synthesizer)
            .then(() => rootChain(() => speakWithoutPageContext(broadcaster, synthesizer, text, voice, onlyLastCallerContinueSpeakingProvider())));
        }
    );

    // NOTE: used when the popup has been disabled.
    chrome.browserAction.onClicked.addListener(iconClickAction);

    chrome.commands.onCommand.addListener(shortcutKeyCommandHandler);

    enablePopup();
}());

log("Done", "Loading code");
