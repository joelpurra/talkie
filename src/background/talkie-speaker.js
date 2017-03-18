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

import {
    log,
    logError,
} from "../shared/log";

import {
    promiseTry,
    promiseSeries,
    promiseTimeout,
} from "../shared/promise";

import {
    flatten,
} from "../shared/basic";

import {
    knownEvents,
} from "../shared/events";

import {
    getVoices,
} from "../shared/voices";

import Execute from "../shared/execute";

import TextHelper from "./text-helper";

import LanguageHelper from "./language-helper";

export default class TalkieSpeaker {
    // https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
    // https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
    constructor(broadcaster, shouldContinueSpeakingProvider) {
        this.broadcaster = broadcaster;
        this.shouldContinueSpeakingProvider = shouldContinueSpeakingProvider;

        this.synthesizer = null;

        this.MAX_UTTERANCE_TEXT_LENGTH = 100;

        this.executeGetFramesSelectionTextAndLanguageCode = `
            (function() {
                try {
                    function talkieGetParentElementLanguages(element) {
                        return []
                            .concat((element || null) && element.getAttribute && element.getAttribute("lang"))
                            .concat((element || null) && element.parentElement && talkieGetParentElementLanguages(element.parentElement));
                    };

                    var talkieSelectionData = {
                        text: ((document || null) && (document.getSelection || null) && (document.getSelection() || null) && document.getSelection().toString()),
                        htmlTagLanguage: ((document || null) && (document.getElementsByTagName || null) && (document.getElementsByTagName("html") || null) && (document.getElementsByTagName("html").length > 0 || null) && (document.getElementsByTagName("html")[0].getAttribute("lang") || null)),
                        parentElementsLanguages: (talkieGetParentElementLanguages((document || null) && (document.getSelection || null) && (document.getSelection() || null) && (document.getSelection().rangeCount > 0 || null) && (document.getSelection().getRangeAt || null) && (document.getSelection().getRangeAt(0) || null) && (document.getSelection().getRangeAt(0).startContainer || null) && (document.getSelection().getRangeAt(0).startContainer.parentElement || null))),
                    };

                    return talkieSelectionData;
                } catch (error) {
                    return null;
                }
            }());`
            .replace(/\n/g, "")
            .replace(/\s{2,}/g, " ");
    }

    getSynthesizerFromBrowser() {
        return promiseTry(
            () => {
                log("Start", "getSynthesizerFromBrowser", "Pre-requisites check");

                if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function" || typeof window.speechSynthesis.speak !== "function") {
                    throw new Error("The browser does not support speechSynthesis.");
                }

                if (!("SpeechSynthesisUtterance" in window)) {
                    throw new Error("The browser does not support SpeechSynthesisUtterance.");
                }

                log("Done", "getSynthesizerFromBrowser", "Pre-requisites check");
            })
            .then(() => {
                log("Start", "getSynthesizerFromBrowser");

                // NOTE: the speech synthesizer can only be used after the voices have been loaded.
                const synthesizer = window.speechSynthesis;

                // https://github.com/mdn/web-speech-api/blob/gh-pages/speak-easy-synthesis/script.js#L33-L36
                // NOTE: The synthesizer will work right away in Firefox.
                const voices = synthesizer.getVoices();

                if (Array.isArray(voices) && voices.length > 0) {
                    log("Done", "getSynthesizerFromBrowser (direct)");

                    return synthesizer;
                }

                const asyncSynthesizerInitialization = new Promise(
                    (resolve, reject) => {
                        try {
                            log("Start", "getSynthesizerFromBrowser (event-based)");

                            const handleVoicesChanged = () => {
                                delete synthesizer.onerror;
                                delete synthesizer.onvoiceschanged;

                                log("Variable", "synthesizer", synthesizer);

                                log("Done", "getSynthesizerFromBrowser (event-based)");

                                return resolve(synthesizer);
                            };

                            const handleError = (event) => {
                                delete synthesizer.onerror;
                                delete synthesizer.onvoiceschanged;

                                logError("Error", "getSynthesizerFromBrowser", event);

                                return reject(null);
                            };

                            // NOTE: Chrome needs to wait for the onvoiceschanged event before using the synthesizer.
                            synthesizer.onvoiceschanged = handleVoicesChanged;
                            synthesizer.onerror = handleError;
                        } catch (error) {
                            return reject(error);
                        }
                    }
                );

                return promiseTimeout(asyncSynthesizerInitialization, 1000)
                    .catch((error) => {
                        delete synthesizer.onerror;
                        delete synthesizer.onvoiceschanged;

                        if (error && error.name === "PromiseTimeout") {
                            log("Done", "getSynthesizerFromBrowser (timeout)", "asyncSynthesizerInitialization", error);

                            // NOTE: assume the synthesizer has somehow been initialized without triggering the onvoiceschanged event.
                            return synthesizer;
                        }

                        logError("Error", "getSynthesizerFromBrowser", "asyncSynthesizerInitialization", error);

                        throw error;
                    });
            }
        )
            .then((synthesizer) => {
                // NOTE: only for logging purposes.
                const voices = synthesizer.getVoices();

                log("Variable", "getSynthesizerFromBrowser", "voices[]", voices.length, voices);

                return synthesizer;
            });
    }

    getSynthesizer() {
        return promiseTry(
            () => {
                if (this.synthesizer !== null) {
                    return this.synthesizer;
                }

                return this.getSynthesizerFromBrowser()
                    .then((synthesizer) => {
                        this.synthesizer = synthesizer;

                        return this.synthesizer;
                    });
            }
        );
    }

    getAllVoices() {
        return promiseTry(
            () => this.getSynthesizer()
                .then((synthesizer) => {
                    return synthesizer.getVoices();
                })
        );
    }

    stopSpeaking() {
        return promiseTry(
            () => {
                log("Start", "stopSpeaking");

                return this.getSynthesizer()
                    .then((synthesizer) => {
                        const eventData = {};

                        return Promise.resolve()
                            .then(() => this.broadcaster.broadcastEvent(knownEvents.stopSpeaking, eventData))
                            .then(() => {
                                synthesizer.cancel();

                                return undefined;
                            });
                    })
                    .then(() => {
                        // Reset the system to resume playback, just to be nice to the world.
                        this.synthesizer.resume();

                        log("Done", "stopSpeaking");

                        return undefined;
                    });
            }
        );
    }

    speakPartOfText(textPart, voice) {
        return this.getSynthesizer()
            .then((synthesizer) => new Promise(
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
            )
        );
    }

    getActualVoice(mappedVoice) {
        return promiseTry(
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
    }

    splitAndSpeak(text, voice) {
        return promiseTry(
            () => {
                log("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

                const speakingEventData = {
                    text: text,
                    voice: voice.name,
                    language: voice.lang,
                };

                return Promise.resolve()
                    .then(() => this.broadcaster.broadcastEvent(knownEvents.beforeSpeaking, speakingEventData))
                    .then(() => this.getActualVoice(voice))
                    .then((actualVoice) => {
                        const paragraphs = TextHelper.splitTextToParagraphs(text);
                        const cleanTextParts = paragraphs.map((paragraph) => TextHelper.splitTextToSentencesOfMaxLength(paragraph, this.MAX_UTTERANCE_TEXT_LENGTH));
                        const textParts = flatten(cleanTextParts);

                        const shouldContinueSpeaking = this.shouldContinueSpeakingProvider.getShouldContinueSpeakingProvider();

                        const textPartsPromises = textParts.map((textPart) => () => {
                            const speakingPartEventData = {
                                textPart: textPart,
                                voice: voice.name,
                                language: voice.lang,
                            };

                            return shouldContinueSpeaking()
                                .then((continueSpeaking) => {
                                    if (continueSpeaking) {
                                        return Promise.resolve()
                                            .then(() => this.broadcaster.broadcastEvent(knownEvents.beforeSpeakingPart, speakingPartEventData))
                                            .then(() => this.speakPartOfText(textPart, actualVoice))
                                            .then(() => this.broadcaster.broadcastEvent(knownEvents.afterSpeakingPart, speakingPartEventData));
                                    }

                                    return undefined;
                                });
                        });

                        return promiseSeries(textPartsPromises);
                    })
                    .then(() => this.broadcaster.broadcastEvent(knownEvents.afterSpeaking, speakingEventData));
            }
        );
    }

    speakTextInVoice(text, voice) {
        return promiseTry(
            () => Promise.resolve()
                .then(() => {
                    Execute.logToPage(`Speaking text (length ${text.length}, ${voice.name}, ${voice.lang}): ${text}`);

                    return this.splitAndSpeak(text, voice);
                })
                .then(() => {
                    log("Done", "speakTextInVoice", `Speak text (length ${text.length}, ${voice.name}, ${voice.lang})`);

                    return undefined;
                })
        );
    }

    speakTextInLanguage(text, language) {
        return promiseTry(
            () => {
                const voice = {
                    name: null,
                    lang: language,
                };

                return Promise.resolve()
                    .then(() => {
                        return this.speakTextInVoice(text, voice);
                    })
                    .then(() => log("Done", "speakTextInLanguage", `Speak text (length ${text.length}, ${language})`));
            }
        );
    }

    executeGetFramesSelectionTextAndLanguage() {
        return Execute.scriptInAllFramesWithTimeout(this.executeGetFramesSelectionTextAndLanguageCode, 1000)
            .then((framesSelectionTextAndLanguage) => {
                log("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

                if (!framesSelectionTextAndLanguage || !Array.isArray(framesSelectionTextAndLanguage)) {
                    throw new Error("framesSelectionTextAndLanguage");
                }

                return framesSelectionTextAndLanguage;
            });
    }

    detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage) {
        return promiseTry(() => {
            log("Start", "Speaking all selections");

            log("Variable", `selections (length ${selections && selections.length || 0})`, selections);

            return promiseTry(
                () => getVoices()
            )
                .then((allVoices) => LanguageHelper.cleanupSelections(allVoices, detectedPageLanguage, selections))
                .then((cleanedupSelections) => {
                    log("Variable", `cleanedupSelections (length ${cleanedupSelections && cleanedupSelections.length || 0})`, cleanedupSelections);

                    const speakPromises = cleanedupSelections.map((selection) => {
                        log("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

                        return this.speakTextInLanguage(selection.text, selection.effectiveLanguage);
                    });

                    log("Done", "Speaking all selections");

                    return Promise.all(speakPromises);
                });
        });
    }

    speakUserSelection() {
        return promiseTry(
            () => {
                log("Start", "Speaking selection");

                return Promise.all(
                    [
                        this.executeGetFramesSelectionTextAndLanguage(),
                        LanguageHelper.detectPageLanguage(),
                    ]
                )
                    .then(([framesSelectionTextAndLanguage, detectedPageLanguage]) => {
                        return this.detectLanguagesAndSpeakAllSelections(framesSelectionTextAndLanguage, detectedPageLanguage);
                    })
                    .then(() => log("Done", "Speaking selection"));
            });
    }
}
