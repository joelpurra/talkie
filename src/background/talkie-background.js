/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

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
    logDebug,
} from "../shared/log";

import {
    promiseTry,
} from "../shared/promise";

import {
    canTalkieRunInTab,
    isCurrentPageInternalToTalkie,
} from "../shared/tabs";

import {
    getVoices,
} from "../shared/voices";

export default class TalkieBackground {
    constructor(speechChain, talkieSpeaker, speakingStatus, voiceManager, languageHelper, configuration, execute) {
        this.speechChain = speechChain;
        this.talkieSpeaker = talkieSpeaker;
        this.speakingStatus = speakingStatus;
        this.voiceManager = voiceManager;
        this.languageHelper = languageHelper;
        this.configuration = configuration;
        this.execute = execute;

        this.notAbleToSpeakTextFromThisSpecialTab = {
            text: browser.i18n.getMessage("notAbleToSpeakTextFromThisSpecialTab"),
            effectiveLanguage: this.configuration.messagesLocale,
        };

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

    speakSelectionOnPage() {
        return promiseTry(
            () => Promise.all([
                canTalkieRunInTab(),
                isCurrentPageInternalToTalkie(),
            ])
                .then(([canRun, isInternalPage]) => {
                        // NOTE: can't perform (most) actions if it's not a "normal" tab.
                    if (!canRun) {
                        logDebug("iconClickAction", "Did not detect a normal tab, skipping.");

                            // NOTE: don't "warn" about internal pages opening.
                        if (isInternalPage) {
                            logDebug("iconClickAction", "Detected internal page, skipping warning.");

                            return undefined;
                        }

                        const text = this.notAbleToSpeakTextFromThisSpecialTab.text;
                        const lang = this.notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage;

                        return this.startSpeakingTextInLanguageWithOverridesAction(text, lang);
                    }

                    return this.speakUserSelection();
                })
        );
    }

    startStopSpeakSelectionOnPage() {
        return promiseTry(
            () => this.speakingStatus.isSpeaking()
                .then((wasSpeaking) => this.talkieSpeaker.stopSpeaking()
                    .then(() => {
                        if (!wasSpeaking) {
                            return this.speakSelectionOnPage();
                        }

                        return undefined;
                    }))
        );
    }

    stopSpeakingAction() {
        return promiseTry(
            () => this.talkieSpeaker.stopSpeaking()
        );
    }

    startSpeakingTextInVoiceAction(text, voice) {
        return promiseTry(
            () => this.talkieSpeaker.stopSpeaking()
                .then(() => {
                    // NOTE: keeping the root chain separate from this chain.
                    this.speechChain.link(() => this.talkieSpeaker.speakTextInVoice(text, voice));

                    return undefined;
                })
        );
    }

    addRateAndPitchToSpecificVoice(voice) {
        return promiseTry(
            () => {
                return Promise.all([
                    this.voiceManager.getEffectiveRateForVoice(voice.name),
                    this.voiceManager.getEffectivePitchForVoice(voice.name),
                ])
                    .then(([effectiveRateForVoice, effectivePitchForVoice]) => {
                        const voiceWithPitchAndRate = Object.assign({}, voice, {
                            rate: effectiveRateForVoice,
                            pitch: effectivePitchForVoice,
                        });

                        return voiceWithPitchAndRate;
                    });
            }
        );
    }

    startSpeakingTextInVoiceWithOverridesAction(text, voice) {
        return promiseTry(
            () => this.addRateAndPitchToSpecificVoice(voice)
                .then((voiceWithPitchAndRate) => this.startSpeakingTextInVoiceAction(text, voiceWithPitchAndRate))
        );
    }

    startSpeakingTextInLanguageAction(text, language) {
        return promiseTry(
            () => this.talkieSpeaker.stopSpeaking()
                .then(() => {
                    // NOTE: keeping the root chain separate from this chain.
                    this.speechChain.link(() => this.talkieSpeaker.speakTextInLanguage(text, language));

                    return undefined;
                })
        );
    }

    startSpeakingTextInLanguageWithOverridesAction(text, language) {
        return promiseTry(
            () => {
                return this.voiceManager.getEffectiveVoiceForLanguage(language)
                    .then((effectiveVoiceForLanguage) => this.startSpeakingTextInVoiceWithOverridesAction(text, effectiveVoiceForLanguage));
            }
        );
    }

    startSpeakingCustomTextDetectLanguage(text) {
        return promiseTry(
            () => this.talkieSpeaker.stopSpeaking()
                .then(() => canTalkieRunInTab())
                .then((canRun) => {
                    if (canRun) {
                        return this.languageHelper.detectPageLanguage();
                    }

                    logDebug("startSpeakingCustomTextDetectLanguage", "Did not detect a normal tab, skipping page language detection.");

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

                    return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
                })
        );
    }

    onTabRemovedHandler(tabId) {
        return this.speakingStatus.isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                if (isTabSpeaking) {
                    return this.talkieSpeaker.stopSpeaking()
                        .then(() => this.speakingStatus.setTabIsDoneSpeaking(tabId));
                }

                return undefined;
            });
    }

    onTabUpdatedHandler(tabId, changeInfo) {
        return this.speakingStatus.isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                // NOTE: changeInfo only has properties which have changed.
                // https://developer.browser.com/extensions/tabs#event-onUpdated
                if (isTabSpeaking && changeInfo.url) {
                    return this.talkieSpeaker.stopSpeaking()
                        .then(() => this.speakingStatus.setTabIsDoneSpeaking(tabId));
                }

                return undefined;
            });
    }

    onExtensionSuspendHandler() {
        return promiseTry(
            () => {
                logDebug("Start", "onExtensionSuspendHandler");

                return this.speakingStatus.isSpeaking()
                    .then((talkieIsSpeaking) => {
                        // NOTE: Clear all text if Talkie was speaking.
                        if (talkieIsSpeaking) {
                            return this.talkieSpeaker.stopSpeaking();
                        }

                        return undefined;
                    })
                    .then(() => {
                        logDebug("Done", "onExtensionSuspendHandler");

                        return undefined;
                    });
            }
        );
    }

    executeGetFramesSelectionTextAndLanguage() {
        return this.execute.scriptInAllFramesWithTimeout(this.executeGetFramesSelectionTextAndLanguageCode, 1000)
            .then((framesSelectionTextAndLanguage) => {
                logDebug("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

                if (!framesSelectionTextAndLanguage || !Array.isArray(framesSelectionTextAndLanguage)) {
                    throw new Error("framesSelectionTextAndLanguage");
                }

                return framesSelectionTextAndLanguage;
            });
    }

    detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage) {
        return promiseTry(() => {
            logDebug("Start", "Speaking all selections");

            logDebug("Variable", `selections (length ${selections && selections.length || 0})`, selections);

            return promiseTry(
                () => getVoices()
            )
                .then((allVoices) => this.languageHelper.cleanupSelections(allVoices, detectedPageLanguage, selections))
                .then((cleanedupSelections) => {
                    logDebug("Variable", `cleanedupSelections (length ${cleanedupSelections && cleanedupSelections.length || 0})`, cleanedupSelections);

                    const speakPromises = cleanedupSelections.map((selection) => {
                        logDebug("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

                        return this.startSpeakingTextInLanguageWithOverridesAction(selection.text, selection.effectiveLanguage);
                    });

                    logDebug("Done", "Speaking all selections");

                    return Promise.all(speakPromises);
                });
        });
    }

    speakUserSelection() {
        return promiseTry(
            () => {
                logDebug("Start", "Speaking selection");

                return Promise.all(
                    [
                        this.executeGetFramesSelectionTextAndLanguage(),
                        this.languageHelper.detectPageLanguage(),
                    ]
                )
                    .then(([framesSelectionTextAndLanguage, detectedPageLanguage]) => {
                        return this.detectLanguagesAndSpeakAllSelections(framesSelectionTextAndLanguage, detectedPageLanguage);
                    })
                    .then(() => logDebug("Done", "Speaking selection"));
            });
    }
}
