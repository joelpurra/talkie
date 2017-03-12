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
} from "../shared/promise";

import {
    isUndefinedOrNullOrEmptyOrWhitespace,
    shallowCopy,
} from "../shared/basic";

import {
    executeLogToPage,
} from "../shared/execute";

import {
    messagesLocale,
} from "../shared/configuration";

const noTextSelectedMessage = {
    text: chrome.i18n.getMessage("noTextSelectedMessage"),
    effectiveLanguage: messagesLocale,
};

const noVoiceForLanguageDetectedMessage = {
    text: chrome.i18n.getMessage("noVoiceForLanguageDetectedMessage"),
    effectiveLanguage: chrome.i18n.getMessage("noVoiceForLanguageDetectedMessageLanguage"),
};

export const detectPageLanguage = () => new Promise(
    (resolve, reject) => {
        try {
            chrome.tabs.detectLanguage((language) => {
                // https://developer.chrome.com/extensions/tabs#method-detectLanguage
                if (chrome.runtime.lastError) {
                    // https://github.com/joelpurra/talkie/issues/3
                    // NOTE: It seems the Vivaldi browser doesn't (yet/always) support detectLanguage.
                    // As this is not critical, just log the error and resolve with null.
                    // return reject(chrome.runtime.lastError);
                    logError("detectPageLanguage", chrome.runtime.lastError);

                    return resolve(null);
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

const getSelectionsWithValidText = (selections) => promiseTry(
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

const detectAndAddLanguageForSelections = (selectionsWithValidText) => promiseTry(
    () => Promise.all(
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
);

const isKnownVoiceLanguage = (allVoices, elementLanguage) => allVoices.some((voice) => voice.lang.startsWith(elementLanguage));

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

const cleanupLanguagesArray = (allVoices, languages) => {
    const copy = (languages || [])
        .filter(isValidString)
        .map(mapIso639Aliases)
        .filter(isKnownVoiceLanguage.bind(null, allVoices));

    return copy;
};

const getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = (allVoices, detectedPageLanguage, selectionsWithValidTextAndDetectedLanguage) => promiseTry(
    () => {
        const cleanupParentElementsLanguages = (selection) => {
            const copy = shallowCopy(selection);

            copy.parentElementsLanguages = cleanupLanguagesArray(allVoices, copy.parentElementsLanguages);

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

            const cleanedLanguages = cleanupLanguagesArray(allVoices, detectedLanguages);

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

        const selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage = selectionsWithValidTextAndDetectedLanguage
            .map(cleanupParentElementsLanguages)
            .map(setEffectiveLanguage);

        return selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage;
    }
);

const useFallbackMessageIfNoLanguageDetected = (selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage) => promiseTry(
    () => {
        const fallbackMessageForNoLanguageDetected = (selection) => {
            if (selection.effectiveLanguage === null) {
                return noVoiceForLanguageDetectedMessage;
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
            log("Empty filtered selections");

            results.push(noTextSelectedMessage);
        }

        return results;
    }
);

export const cleanupSelections = (allVoices, detectedPageLanguage, selections) => Promise.resolve()
    .then(() => getSelectionsWithValidText(selections))
    .then((selectionsWithValidText) => detectAndAddLanguageForSelections(selectionsWithValidText))
    .then((selectionsWithValidTextAndDetectedLanguage) => getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage(allVoices, detectedPageLanguage, selectionsWithValidTextAndDetectedLanguage))
    .then((selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage) => useFallbackMessageIfNoLanguageDetected(selectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage));
