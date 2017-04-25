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
    logDebug,
    logInfo,
    logError,
} from "../shared/log";

import {
    promiseTry,
    promiseSeries,
} from "../shared/promise";

import {
    isUndefinedOrNullOrEmptyOrWhitespace,
    shallowCopy,
} from "../shared/basic";

export default class LanguageHelper {
    constructor(contentLogger, configuration) {
        this.contentLogger = contentLogger;
        this.configuration = configuration;

        this.noTextSelectedMessage = {
            text: browser.i18n.getMessage("noTextSelectedMessage"),
            effectiveLanguage: this.configuration.messagesLocale,
        };

        this.noVoiceForLanguageDetectedMessage = {
            text: browser.i18n.getMessage("noVoiceForLanguageDetectedMessage"),
            effectiveLanguage: browser.i18n.getMessage("noVoiceForLanguageDetectedMessageLanguage"),
        };

        // https://www.iso.org/obp/ui/#iso:std:iso:639:-1:ed-1:v1:en
        // https://en.wikipedia.org/wiki/ISO_639-1
        // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
        // http://xml.coverpages.org/iso639a.html
        // NOTE: discovered because Twitter seems to still use "iw".
        this.iso639Dash1Aliases1988To2002 = {
            "in": "id",
            "iw": "he",
            "ji": "yi",
        };
    }

    detectPageLanguage() {
        return promiseTry(
            () => {
                // https://developer.browser.com/extensions/tabs#method-detectLanguage
                return browser.tabs.detectLanguage()
                    .then((language) => {
                        logDebug("detectPageLanguage", "Browser detected primary page language", language);

                        // The language fallback value is "und", so treat it as no language.
                        if (!language || typeof language !== "string" || language === "und") {
                            return null;
                        }

                        return language;
                    })
                    .catch((error) => {
                        // https://github.com/joelpurra/talkie/issues/3
                        // NOTE: It seems the Vivaldi browser doesn't (yet/always) support detectLanguage.
                        // As this is not critical, just log the error and resolve with null.
                        logError("detectPageLanguage", error);

                        return null;
                    });
            }
        );
    }

    detectTextLanguage(text) {
        return promiseTry(
            () => {
                if (!("detectLanguage" in browser.i18n)) {
                    // NOTE: text-based language detection is only used as a fallback.
                    logDebug("detectTextLanguage", "Browser does not support detecting text language");

                    return null;
                }

                // https://developer.browser.com/extensions/i18n#method-detectLanguage
                return browser.i18n.detectLanguage(text)
                    .then((result) => {
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
                            logDebug("detectTextLanguage", "Browser did not detect reliable text language", result);

                            return null;
                        }

                        const primaryDetectedTextLanguage = result.languages[0].language;

                        logDebug("detectTextLanguage", "Browser detected reliable text language", result, primaryDetectedTextLanguage);

                        return primaryDetectedTextLanguage;
                    });
            }
        );
    }

    getSelectionsWithValidText(selections) {
        return promiseTry(
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
            }
        );
    }

    detectAndAddLanguageForSelections(selectionsWithValidText) {
        return promiseTry(
            () => Promise.all(
            selectionsWithValidText.map(
                (selection) => {
                    const copy = shallowCopy(selection);

                    return this.detectTextLanguage(copy.text)
                        .then((detectedTextLanguage) => {
                            copy.detectedTextLanguage = detectedTextLanguage;

                            return copy;
                        });
                })
            )
        );
    }

    isKnownVoiceLanguage(allVoices, elementLanguage) {
        return allVoices.some((voice) => voice.lang.startsWith(elementLanguage));
    }

    mapIso639Aliases(language) {
        return this.iso639Dash1Aliases1988To2002[language] || language;
    }

    isValidString(str) {
        return !isUndefinedOrNullOrEmptyOrWhitespace(str);
    }

    cleanupLanguagesArray(allVoices, languages) {
        const copy = (languages || [])
            .filter((str) => this.isValidString(str))
            .map((language) => this.mapIso639Aliases(language))
            .filter((elementLanguage) => this.isKnownVoiceLanguage(allVoices, elementLanguage));

        return copy;
    }

    getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage(allVoices, detectedPageLanguage, selectionsWithValidTextAndDetectedLanguage) {
        return promiseTry(
            () => {
                const cleanupParentElementsLanguages = (selection) => {
                    const copy = shallowCopy(selection);

                    copy.parentElementsLanguages = this.cleanupLanguagesArray(allVoices, copy.parentElementsLanguages);

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

                    logDebug("setEffectiveLanguage", "detectedLanguages", detectedLanguages);

                    const cleanedLanguages = this.cleanupLanguagesArray(allVoices, detectedLanguages);

                    logDebug("setEffectiveLanguage", "cleanedLanguages", cleanedLanguages);

                    const primaryLanguagePrefix = cleanedLanguages[0] || null;

                    logDebug("setEffectiveLanguage", "primaryLanguagePrefix", primaryLanguagePrefix);

                    // NOTE: if there is a more specific language with the same prefix among the detected languages, prefer it.
                    const cleanedLanguagesWithPrimaryPrefix = cleanedLanguages.filter(getMoreSpecificLanguagesWithPrefix(primaryLanguagePrefix));

                    logDebug("setEffectiveLanguage", "cleanedLanguagesWithPrimaryPrefix", cleanedLanguagesWithPrimaryPrefix);

                    const effectiveLanguage = cleanedLanguagesWithPrimaryPrefix[0] || cleanedLanguages[0] || null;

                    logDebug("setEffectiveLanguage", "effectiveLanguage", effectiveLanguage);

                    copy.effectiveLanguage = effectiveLanguage;

                    // TODO: report language results and move logging elsewhere?
                    promiseSeries([
                        () => this.contentLogger.logToPage("Language", "Selected text language:", copy.detectedTextLanguage),
                        () => this.contentLogger.logToPage("Language", "Selected text element language:", copy.parentElementsLanguages[0] || null),
                        () => this.contentLogger.logToPage("Language", "HTML tag language:", copy.htmlTagLanguage),
                        () => this.contentLogger.logToPage("Language", "Detected page language:", detectedPageLanguage),
                        () => this.contentLogger.logToPage("Language", "Effective language:", copy.effectiveLanguage),
                    ])
                        .catch((error) => {
                            // NOTE: swallowing any logToPage() errors.
                            // NOTE: reduced logging for known tab/page access problems.
                            if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
                                logDebug("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
                            } else {
                                logInfo("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
                            }

                            return undefined;
                        });

                    return copy;
                };

                const selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = selectionsWithValidTextAndDetectedLanguage
                    .map(cleanupParentElementsLanguages)
                    .map(setEffectiveLanguage);

                return selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage;
            }
        );
    }

    useFallbackMessageIfNoLanguageDetected(selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage) {
        return promiseTry(
            () => {
                const fallbackMessageForNoLanguageDetected = (selection) => {
                    if (selection.effectiveLanguage === null) {
                        return this.noVoiceForLanguageDetectedMessage;
                    }

                    return selection;
                };

                const mapResults = (selection) => {
                    return {
                        text: selection.text,
                        effectiveLanguage: selection.effectiveLanguage,
                    };
                };

                const results = selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage
                    .map(fallbackMessageForNoLanguageDetected)
                    .map(mapResults);

                if (results.length === 0) {
                    logDebug("Empty filtered selections");

                    results.push(this.noTextSelectedMessage);
                }

                return results;
            }
        );
    }

    cleanupSelections(allVoices, detectedPageLanguage, selections) {
        return Promise.resolve()
            .then(() => this.getSelectionsWithValidText(selections))
            .then((selectionsWithValidText) => this.detectAndAddLanguageForSelections(selectionsWithValidText))
            .then((selectionsWithValidTextAndDetectedLanguage) => this.getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage(allVoices, detectedPageLanguage, selectionsWithValidTextAndDetectedLanguage))
            .then((selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage) => this.useFallbackMessageIfNoLanguageDetected(selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage));
    }
}
