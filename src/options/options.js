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
    promiseTry,
} from "../shared/promise";

import {
    registerUnhandledRejectionHandler,
} from "../shared/error-handling";

import {
    debounce,
} from "../shared/basic";

import {
    getMappedVoices,
    rateRange,
    pitchRange,
} from "../shared/voices";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    eventToPromise,
    startFrontend,
    stopFrontend,
    htmlEscape,
} from "../frontend/shared-frontend";

import LogarithmicScaleRange from "./logarithmic-scale-range";

import Tabrow from "./tabrow";

import DualLogger from "../frontend/dual-log";

const dualLogger = new DualLogger("options.js");

const initializeTabrow = () => promiseTry(
    () => {
        const optionsTabrow = new Tabrow("options-tabrow");
        optionsTabrow.initialize();
    }
);

const speak = (text, voice) => promiseTry(
    () => {
        return getBackgroundPage()
            .then((background) => background.stopSpeakFromFrontend()
                .then(() => background.startSpeakFromFrontend(text, voice))
            );
    }
);

const getSelectedListOption = (selectElement) => {
    const options = Array.from(selectElement.querySelectorAll(":scope option"));
    const selected = options.filter((option) => option.selected === true);

    let result = null;

    if (selected.length > 0) {
        result = selected[0] || null;
    }

    return result;
};

const speakSelectedVoiceAndText = (selectedVoiceOption, selectedVoiceRate, selectedVoicePitch, textElement) => promiseTry(
    () => {
        const sampleText = textElement.value.trim();

        if (sampleText.length === 0) {
            return;
        }

        if (selectedVoiceOption && selectedVoiceOption && selectedVoiceOption.talkie && typeof Array.isArray(selectedVoiceOption.talkie.voices)) {
            const voiceWithPitchAndRate = Object.assign({}, selectedVoiceOption.talkie.voices[0], {
                rate: selectedVoiceRate,
                pitch: selectedVoicePitch,
            });

            return speak(sampleText, voiceWithPitchAndRate);
        }

        return undefined;
    }
);

const disabledVoiceDefaultToggleButton = (voicesDefaultToggleButton) => promiseTry(
    () => {
        voicesDefaultToggleButton.disabled = true;

        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                let buttonText = null;

                if (isPremium) {
                    buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageEmptySelection_Premium");
                } else {
                    buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageEmptySelection_Free");
                }

                voicesDefaultToggleButton.textContent = buttonText;

                return undefined;
            });
    }
);

const enabledVoiceDefaultToggleButton = (voicesDefaultToggleButton, languageName, voiceName) => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                // NOTE: attempting to prevent translation HTML injection.
                // TODO: generalized HTML-cleaning function?
                const messageDetailsObjects = [
                    {
                        placeholder: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                        value: `<strong>${languageName}</strong>`,
                    },
                    {
                        placeholder: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                        value: `<strong>${voiceName}</strong>`,
                    },
                ];

                const messageDetailsPlaceholders = messageDetailsObjects.map((messageDetailsPlaceholder) => messageDetailsPlaceholder.placeholder);

                let buttonTextWithPlaceholders = null;

                if (isPremium) {
                    voicesDefaultToggleButton.disabled = false;
                    buttonTextWithPlaceholders = browser.i18n.getMessage("frontend_voicesSetAsLanguageUseVoiceAsDefault_Premium", messageDetailsPlaceholders);
                } else {
                    voicesDefaultToggleButton.disabled = true;
                    buttonTextWithPlaceholders = browser.i18n.getMessage("frontend_voicesSetAsLanguageUseVoiceAsDefault_Free", messageDetailsPlaceholders);
                }

                const escapedButtonTextWithPlaceholders = htmlEscape(buttonTextWithPlaceholders);

                // NOTE: attempting to prevent translation HTML injection.
                // TODO: generalized HTML-cleaning function?
                const cleanedButtonTextWithReplacedValues = messageDetailsObjects.reduce(
                    (textWithPlaceholders, messageDetailsObject) => {
                        const placeholderRx = new RegExp(messageDetailsObject.placeholder, "g");
                        const replacedText = textWithPlaceholders.replace(placeholderRx, messageDetailsObject.value);

                        return replacedText;
                    },
                    escapedButtonTextWithPlaceholders
                );

                // NOTE: Hacks around linting with web-ext. How else to temporarily disable?
                // https://github.com/mozilla/web-ext
                // NOTE: function naming required by eslint-plugin-no-unsanitized, no matter what it does.
                // https://github.com/mozilla/eslint-plugin-no-unsanitized
                const escapeHTML = () => cleanedButtonTextWithReplacedValues;

                // NOTE: template string required by eslint-plugin-no-unsanitized.
                voicesDefaultToggleButton.innerHTML = escapeHTML`dummy string`;

                return undefined;
            });
    }
);

const updateToggleLanguageVoiceOverrideNameButton = (selectedLanguageOption, selectedVoiceOption, voicesDefaultToggleButton) => promiseTry(
    () => {
        if (selectedLanguageOption === null || selectedVoiceOption === null) {
            return disabledVoiceDefaultToggleButton(voicesDefaultToggleButton);
        }

        if (!selectedLanguageOption.talkie || !selectedVoiceOption.talkie) {
            return disabledVoiceDefaultToggleButton(voicesDefaultToggleButton);
        }

        const languageName = selectedLanguageOption.talkie.language;
        const voiceName = selectedVoiceOption.talkie.voiceName;

        if (languageName === null || voiceName === null) {
            return disabledVoiceDefaultToggleButton(voicesDefaultToggleButton);
        }

        return enabledVoiceDefaultToggleButton(voicesDefaultToggleButton, languageName, voiceName);
    }
);

const toggleLanguageVoiceOverrideNameClick = (selectedLanguageOption, selectedVoiceOption) => promiseTry(
    () => {
        if (selectedLanguageOption === null || selectedVoiceOption === null) {
            throw new Error("toggleLanguageVoiceOverrideNameClick 1");
        }

        if (!selectedLanguageOption.talkie || !selectedVoiceOption.talkie) {
            throw new Error("toggleLanguageVoiceOverrideNameClick 2");
        }

        const languageName = selectedLanguageOption.talkie.language;
        const voiceName = selectedVoiceOption.talkie.voiceName;

        if (languageName === null || voiceName === null) {
            throw new Error("toggleLanguageVoiceOverrideNameClick 3");
        }

        return getBackgroundPage()
            .then((background) => background.toggleLanguageVoiceOverrideName(languageName, voiceName));
    }
);

const saveVoiceRateAndPitch = (selectedVoiceOption, selectedVoiceRate, selectedVoicePitch) => promiseTry(
    () => {
        if (selectedVoiceOption === null) {
            throw new Error("saveVoiceRateAndPitch 1");
        }

        if (!selectedVoiceOption.talkie) {
            throw new Error("saveVoiceRateAndPitch 2");
        }

        const voiceName = selectedVoiceOption.talkie.voiceName;

        if (voiceName === null) {
            throw new Error("saveVoiceRateAndPitch 3");
        }

        // TODO: check that values are within range.
        return getBackgroundPage()
            .then((background) => Promise.all([
                background.setVoiceRateOverride(voiceName, selectedVoiceRate),
                background.setVoicePitchOverride(voiceName, selectedVoicePitch),
            ]));
    }
);

const debouncedSaveVoiceRateAndPitch = debounce(saveVoiceRateAndPitch, 100);

const disabledVoiceRateRange = (voicesRateRange, voicesRateRangeHeading) => promiseTry(
    () => {
        voicesRateRange.disabled = true;

        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                let headingText = null;

                if (isPremium) {
                    headingText = browser.i18n.getMessage("frontend_voicesRateEmptyHeading_Premium");
                } else {
                    headingText = browser.i18n.getMessage("frontend_voicesRateEmptyHeading_Free");
                }

                voicesRateRangeHeading.textContent = headingText;

                return undefined;
            });
    }
);

const enabledVoiceRateRange = (voicesRateRange, voicesRateRangeHeading, voiceName) => promiseTry(
    () => {
        voicesRateRange.disabled = false;

        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                let headingText = null;

                if (isPremium) {
                    headingText = browser.i18n.getMessage("frontend_voicesRateHeading_Premium", [ voiceName ]);
                } else {
                    headingText = browser.i18n.getMessage("frontend_voicesRateHeading_Free", [ voiceName ]);
                }

                voicesRateRangeHeading.textContent = headingText;

                return undefined;
            });
    }
);

const disabledVoicePitchRange = (voicesPitchRange, voicesPitchRangeHeading) => promiseTry(
    () => {
        voicesPitchRange.disabled = true;

        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                let headingText = null;

                if (isPremium) {
                    headingText = browser.i18n.getMessage("frontend_voicesPitchEmptyHeading_Premium");
                } else {
                    headingText = browser.i18n.getMessage("frontend_voicesPitchEmptyHeading_Free");
                }

                voicesPitchRangeHeading.textContent = headingText;

                return undefined;
            });
    }
);

const enabledVoicePitchRange = (voicesPitchRange, voicesPitchRangeHeading, voiceName) => promiseTry(
    () => {
        voicesPitchRange.disabled = false;

        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.isPremiumVersion())
            .then((isPremium) => {
                let headingText = null;

                if (isPremium) {
                    headingText = browser.i18n.getMessage("frontend_voicesPitchHeading_Premium", [ voiceName ]);
                } else {
                    headingText = browser.i18n.getMessage("frontend_voicesPitchHeading_Free", [ voiceName ]);
                }

                voicesPitchRangeHeading.textContent = headingText;

                return undefined;
            });
    }
);

const updateRateHeadings = (selectedVoiceOption, voicesRateRange, voicesRateRangeHeading) => promiseTry(
    () => {
        if (selectedVoiceOption === null || !selectedVoiceOption.talkie || !selectedVoiceOption.talkie.voiceName) {
            return disabledVoiceRateRange(voicesRateRange, voicesRateRangeHeading);
        }

        const voiceName = selectedVoiceOption.talkie.voiceName;

        return enabledVoiceRateRange(voicesRateRange, voicesRateRangeHeading, voiceName);
    }
);

const updatePitchHeadings = (selectedVoiceOption, voicesPitchRange, voicesPitchRangeHeading) => promiseTry(
    () => {
        if (selectedVoiceOption === null || !selectedVoiceOption.talkie || !selectedVoiceOption.talkie.voiceName) {
            return disabledVoicePitchRange(voicesPitchRange, voicesPitchRangeHeading);
        }

        const voiceName = selectedVoiceOption.talkie.voiceName;

        return enabledVoicePitchRange(voicesPitchRange, voicesPitchRangeHeading, voiceName);
    }
);

const disableRateAndPitchHeadings = (voicesRateRange, voicesRateRangeHeading, voicesPitchRange, voicesPitchRangeHeading) => promiseTry(
    () => {
        return Promise.all([
            disabledVoiceRateRange(voicesRateRange, voicesRateRangeHeading),
            disabledVoicePitchRange(voicesPitchRange, voicesPitchRangeHeading),
        ]);
    }
);

const updateRateAndPitchHeadings = (selectedVoiceOption, voicesRateRange, voicesRateRangeHeading, voicesPitchRange, voicesPitchRangeHeading) => promiseTry(
    () => {
        return Promise.all([
            updateRateHeadings(selectedVoiceOption, voicesRateRange, voicesRateRangeHeading),
            updatePitchHeadings(selectedVoiceOption, voicesPitchRange, voicesPitchRangeHeading),
        ]);
    }
);

const voiceRateLogValue = new LogarithmicScaleRange(rateRange.min, rateRange.default, rateRange.max, rateRange.step);

const loadRateValue = (voicesRateRange, voiceName) => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.getEffectiveRateForVoice(voiceName))
            .then((effectiveVoiceRate) => {
                voiceRateLogValue.linearValue = effectiveVoiceRate;

                voicesRateRange.value = voiceRateLogValue.logValue;

                return undefined;
            });
    }
);

const loadPitchValue = (voicesPitchRange, voiceName) => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => getBackgroundPage())
            .then((background) => background.getEffectivePitchForVoice(voiceName))
            .then((effectiveVoicePitch) => {
                voicesPitchRange.value = effectiveVoicePitch;

                return undefined;
            });
    }
);

const loadRateAndPitchValues = (selectedVoiceOption, voicesRateRange, voicesPitchRange) => promiseTry(
    () => {
        if (selectedVoiceOption === null || !selectedVoiceOption.talkie || !selectedVoiceOption.talkie.voiceName) {
            throw new Error();
        }

        const voiceName = selectedVoiceOption.talkie.voiceName;

        return Promise.all([
            loadRateValue(voicesRateRange, voiceName),
            loadPitchValue(voicesPitchRange, voiceName),
        ]);
    }
);

const updateVoiceRateRangeNumericDisplay = (voicesRateNumericDisplay, selectedVoiceRate) => promiseTry(
    () => {
        // TODO: empty value.
        // voicesRateNumericDisplay.textContent = "";
        voicesRateNumericDisplay.textContent = `(${selectedVoiceRate.toFixed(1)})`;
    }
);

const updateVoicePitchRangeNumericDisplay = (voicesPitchNumericDisplay, selectedVoicePitch) => promiseTry(
    () => {
        // TODO: empty value.
        // voicesPitchNumericDisplay.textContent = "";
        voicesPitchNumericDisplay.textContent = `(${selectedVoicePitch.toFixed(1)})`;
    }
);

const updateRateAndPitchNumericDisplays = (voicesRateNumericDisplay, selectedVoiceRate, voicesPitchNumericDisplay, selectedVoicePitch) => promiseTry(
    () => {
        return Promise.all([
            updateVoiceRateRangeNumericDisplay(voicesRateNumericDisplay, selectedVoiceRate),
            updateVoicePitchRangeNumericDisplay(voicesPitchNumericDisplay, selectedVoicePitch),
        ]);
    }
);

// const updateRateRangeStep = (voicesRateRange) => promiseTry(
//     () => {
//         voicesRateRange.step = voiceRateLogValue.logStep;
//     }
// );
//
// const debouncedUpdateRateRangeStep = debounce(updateRateRangeStep, 10);

const loadVoicesAndLanguages = () => promiseTry(
    () => {
        return getMappedVoices()
            .then((allVoices) => {
                // NOTE: assuming the voices are available once the background has loaded.
                // TODO: verify.
                const allVoicesByLanguage = allVoices.reduce((obj, voice) => { obj[voice.lang] = (obj[voice.lang] || []).concat(voice); return obj; }, {});
                const allLanguages = Object.keys(allVoicesByLanguage);
                allLanguages.sort();
                dualLogger.dualLogDebug("loadVoicesAndLanguages", "allVoicesByLanguage", allVoicesByLanguage);

                const allVoicesByLanguageGroup = allVoices.reduce((obj, voice) => { const group = voice.lang.substr(0, 2); obj[group] = (obj[group] || []).concat(voice); return obj; }, {});
                dualLogger.dualLogDebug("loadVoicesAndLanguages", "allVoicesByLanguageGroup", allVoicesByLanguageGroup);

                const allLanguagesByLanguageGroup = allVoices.reduce((obj, voice) => { const group = voice.lang.substr(0, 2); obj[group] = (obj[group] || {}); obj[group][voice.lang] = allVoicesByLanguage[voice.lang]; return obj; }, {});
                const allLanguagesGroups = Object.keys(allLanguagesByLanguageGroup);
                allLanguagesGroups.sort();
                dualLogger.dualLogDebug("loadVoicesAndLanguages", "allLanguagesGroups", allLanguagesGroups);

                const allVoicesByVoiceName = allVoices.reduce((obj, voice) => { obj[voice.name] = (obj[voice.name] || []).concat(voice); return obj; }, {});
                const allVoiceNames = Object.keys(allVoicesByVoiceName);
                allVoiceNames.sort();
                dualLogger.dualLogDebug("loadVoicesAndLanguages", "allLanguagesByLanguageGroup", allLanguagesByLanguageGroup);

                const voicesLanguagesListElement = document.getElementById("voices-languages-list");
                const voicesVoicesListElement = document.getElementById("voices-voices-list");
                const voicesSampleTextElement = document.getElementById("voices-sample-text");
                const voicesAvailableLanguagesCount = document.getElementById("voices-available-languages-count");
                const voicesAvailableVoicesCount = document.getElementById("voices-available-voices-count");
                const voicesDefaultToggleButton = document.getElementById("voices-default-toggle");
                const voicesRateRange = document.getElementById("voices-rate");
                const voicesRateRangeSteps = document.getElementById("voices-rate-steps");
                const voicesRateRangeHeading = document.getElementById("voices-rate-heading");
                const voicesRateNumericDisplay = document.getElementById("voices-rate-numeric-display");
                const voicesPitchRange = document.getElementById("voices-pitch");
                const voicesPitchRangeSteps = document.getElementById("voices-pitch-steps");
                const voicesPitchRangeHeading = document.getElementById("voices-pitch-heading");
                const voicesPitchNumericDisplay = document.getElementById("voices-pitch-numeric-display");

                voicesRateRange.min = voiceRateLogValue.logMin;
                voicesRateRange.value = voiceRateLogValue.logValue;
                // voicesRateRange.step = voiceRateLogValue.logStep;
                voicesRateRange.step = 1;
                voicesRateRange.max = voiceRateLogValue.logMax;

                voicesPitchRange.min = pitchRange.min;
                voicesPitchRange.value = pitchRange.default;
                voicesPitchRange.step = pitchRange.step;
                voicesPitchRange.max = pitchRange.max;

                [
                    voicesRateRange.min,
                    voicesRateRange.value,
                    voicesRateRange.max,
                ].forEach((step) => {
                    const option = document.createElement("option");
                    option.value = step;
                    option.textContent = step;
                    voicesRateRangeSteps.appendChild(option);
                });

                voicesRateRange.setAttribute("list", voicesRateRangeSteps.id);

                [
                    voicesPitchRange.min,
                    voicesPitchRange.value,
                    voicesPitchRange.max,
                ].forEach((step) => {
                    const option = document.createElement("option");
                    option.value = step;
                    option.textContent = step;
                    voicesPitchRangeSteps.appendChild(option);
                });

                voicesPitchRange.setAttribute("list", voicesPitchRangeSteps.id);

                const getSelectedLanguageOption = () => getSelectedListOption(voicesLanguagesListElement);
                const getSelectedVoiceOption = () => getSelectedListOption(voicesVoicesListElement);
                const getSelectedVoiceRate = () => { voiceRateLogValue.logValue = parseFloat(voicesRateRange.value); return Math.round10(voiceRateLogValue.linearValue, -1); };
                const getSelectedVoicePitch = () => Math.round10(parseFloat(voicesPitchRange.value), -1);

                disabledVoiceDefaultToggleButton(voicesDefaultToggleButton);

                voicesAvailableLanguagesCount.textContent = ` (${allLanguages.length})`;

                const displayVoicesInSelectElement = (selectedVoices, effectiveVoiceNameForLanguage) => {
                    Array.from(voicesVoicesListElement.children).forEach((child) => child.remove());

                    selectedVoices.forEach((voice) => {
                        const option = document.createElement("option");
                        option.talkie = {};
                        option.talkie.voiceName = voice.name;
                        option.talkie.voices = [voice];
                        option.textContent = voice.name;

                        if (voice.name === effectiveVoiceNameForLanguage) {
                            option.textContent += " ✓";
                        }

                        voicesVoicesListElement.appendChild(option);
                    });

                    voicesAvailableVoicesCount.textContent = ` (${selectedVoices.length})`;
                };

                const displayVoicesAndSelectVoiceInSelectElement = (selectedLanguageOption, effectiveVoiceNameForLanguage) => {
                    const voicesForLanguage = selectedLanguageOption.talkie.voices;

                    displayVoicesInSelectElement(voicesForLanguage, effectiveVoiceNameForLanguage);

                    Array.from(voicesVoicesListElement.children).forEach((option) => {
                        option.classList.remove("effective-voice");

                        if (option.talkie && option.talkie.voiceName === effectiveVoiceNameForLanguage) {
                            option.selected = true;
                            option.classList.add("effective-voice");

                            if (typeof option.scrollIntoViewIfNeeded === "function") {
                                option.scrollIntoViewIfNeeded(true);
                            }

                            voicesVoicesListElement.dispatchEvent(new Event("change"));
                        }
                    });

                    return undefined;
                };

                displayVoicesInSelectElement(allVoices);

                const speakBasedOnSelectedOption = () => {
                    const selectedVoiceOption = getSelectedVoiceOption();
                    const selectedVoiceRate = getSelectedVoiceRate();
                    const selectedVoicePitch = getSelectedVoicePitch();

                    return speakSelectedVoiceAndText(selectedVoiceOption, selectedVoiceRate, selectedVoicePitch, voicesSampleTextElement);
                };

                const debouncedSpeakBasedOnSelectedOption = debounce(speakBasedOnSelectedOption, 100);

                const voicesRateAndPitchRangesElementOnChangeSpeakSampleHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => debouncedSpeakBasedOnSelectedOption()
                );

                const voiceListElementOnChangeButtonHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedLanguageOption = getSelectedLanguageOption();
                        const selectedVoiceOption = getSelectedVoiceOption();

                        return updateToggleLanguageVoiceOverrideNameButton(selectedLanguageOption, selectedVoiceOption, voicesDefaultToggleButton);
                    }
                );

                const voicesDefaultToggleButtonOnClickToggleLanguageVoiceOverrideNameHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedLanguageOption = getSelectedLanguageOption();
                        const selectedVoiceOption = getSelectedVoiceOption();

                        return toggleLanguageVoiceOverrideNameClick(selectedLanguageOption, selectedVoiceOption)
                            .then(() => updateToggleLanguageVoiceOverrideNameButton(selectedLanguageOption, selectedVoiceOption, voicesDefaultToggleButton))
                            .then(() => displayVoicesAndSelectVoiceInSelectElement(selectedLanguageOption, selectedVoiceOption.talkie.voiceName));
                    }
                );

                const voiceListElementOnChangeRateAndPitchHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedVoiceOption = getSelectedVoiceOption();

                        return loadRateAndPitchValues(selectedVoiceOption, voicesRateRange, voicesPitchRange)
                            .then(() => {
                                const selectedVoiceRate = getSelectedVoiceRate();
                                const selectedVoicePitch = getSelectedVoicePitch();

                                return Promise.all([
                                    // debouncedUpdateRateRangeStep(voicesRateRange),
                                    updateRateAndPitchHeadings(selectedVoiceOption, voicesRateRange, voicesRateRangeHeading, voicesPitchRange, voicesPitchRangeHeading),
                                    updateRateAndPitchNumericDisplays(voicesRateNumericDisplay, selectedVoiceRate, voicesPitchNumericDisplay, selectedVoicePitch),
                                ]);
                            })
                            .then(() => debouncedSpeakBasedOnSelectedOption());
                    }
                );

                // const voicesRateRangesElementOnInputUpdateRateStepHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                //     () => {
                //         return debouncedUpdateRateRangeStep(voicesRateRange);
                //     }
                // );

                const voicesRateAndPitchRangesElementOnInputUpdateNumericDisplayHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedVoiceRate = getSelectedVoiceRate();
                        const selectedVoicePitch = getSelectedVoicePitch();

                        return updateRateAndPitchNumericDisplays(voicesRateNumericDisplay, selectedVoiceRate, voicesPitchNumericDisplay, selectedVoicePitch);
                    }
                );

                const voicesRateAndPitchRangesElementOnChangeSaveRateAndPitchHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedVoiceOption = getSelectedVoiceOption();
                        const selectedVoiceRate = getSelectedVoiceRate();
                        const selectedVoicePitch = getSelectedVoicePitch();

                        return debouncedSaveVoiceRateAndPitch(selectedVoiceOption, selectedVoiceRate, selectedVoicePitch);
                    }
                );

                const disableRateAndPitchHeadingsOnLoad = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        return disableRateAndPitchHeadings(voicesRateRange, voicesRateRangeHeading, voicesPitchRange, voicesPitchRangeHeading);
                    }
                );

                disableRateAndPitchHeadingsOnLoad();

                Array.from(voicesLanguagesListElement.children).forEach((child) => child.remove());

                {
                    const allLanguageOption = document.createElement("option");
                    allLanguageOption.talkie = {};
                    allLanguageOption.talkie.language = null;
                    allLanguageOption.talkie.voices = allVoices;

                    allLanguageOption.textContent = browser.i18n.getMessage("frontend_voicesShowAllVoices");
                    allLanguageOption.selected = true;

                    allLanguageOption.classList.add("group");

                    voicesLanguagesListElement.appendChild(allLanguageOption);
                }

                allLanguagesGroups.forEach((languageGroup) => {
                    const allVoicesByLanguageGroupKeys = Object.keys(allVoicesByLanguageGroup[languageGroup]);

                    const languagesPerGroupKeys = Object.keys(allLanguagesByLanguageGroup[languageGroup]);
                    languagesPerGroupKeys.sort();

                    const languageGroupOptionElement = document.createElement("option");

                    languageGroupOptionElement.classList.add("group");

                    if (languagesPerGroupKeys.length > 1 || allVoicesByLanguageGroupKeys.length > 1) {
                        languageGroupOptionElement.textContent = `${languageGroup} (${languagesPerGroupKeys.length}, ${allVoicesByLanguageGroupKeys.length})`;
                    } else {
                        languageGroupOptionElement.textContent = languageGroup;
                    }
                    languageGroupOptionElement.talkie = {};
                    languageGroupOptionElement.talkie.language = languageGroup;
                    languageGroupOptionElement.talkie.voices = allVoicesByLanguageGroup[languageGroup];

                    voicesLanguagesListElement.appendChild(languageGroupOptionElement);

                    languagesPerGroupKeys
                        .filter((language) => language !== languageGroup)
                        .forEach((language) => {
                            const languageOptionElement = document.createElement("option");
                            languageOptionElement.talkie = {};
                            languageOptionElement.talkie.language = language;
                            languageOptionElement.talkie.voices = allVoicesByLanguage[language];

                            if (allVoicesByLanguage[language].length > 1) {
                                languageOptionElement.textContent = `${language} (${allVoicesByLanguage[language].length})`;
                            } else {
                                languageOptionElement.textContent = language;
                            }

                            voicesLanguagesListElement.appendChild(languageOptionElement);
                        });
                });

                const languageListElementOnChangeUpdateVoiceListHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedLanguageOption = getSelectedLanguageOption();

                        if (selectedLanguageOption && selectedLanguageOption && selectedLanguageOption.talkie && Array.isArray(selectedLanguageOption.talkie.voices) && typeof selectedLanguageOption.talkie.language === "string") {
                            return getBackgroundPage()
                                .then((background) => background.getEffectiveVoiceForLanguage(selectedLanguageOption.talkie.language))
                                .then((effectiveVoiceForLanguage) => displayVoicesAndSelectVoiceInSelectElement(selectedLanguageOption, effectiveVoiceForLanguage.name));
                        }

                        displayVoicesInSelectElement(allVoices);
                    }
                );

                voicesLanguagesListElement.addEventListener("change", eventToPromise.bind(null, languageListElementOnChangeUpdateVoiceListHandler));

                voicesVoicesListElement.addEventListener("change", eventToPromise.bind(null, voiceListElementOnChangeButtonHandler));
                voicesVoicesListElement.addEventListener("change", eventToPromise.bind(null, voiceListElementOnChangeRateAndPitchHandler));

                // voicesRateRange.addEventListener("input", eventToPromise.bind(null, voicesRateRangesElementOnInputUpdateRateStepHandler));

                voicesRateRange.addEventListener("input", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnInputUpdateNumericDisplayHandler));
                voicesPitchRange.addEventListener("input", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnInputUpdateNumericDisplayHandler));

                voicesRateRange.addEventListener("change", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnChangeSaveRateAndPitchHandler));
                voicesPitchRange.addEventListener("change", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnChangeSaveRateAndPitchHandler));

                voicesRateRange.addEventListener("change", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnChangeSpeakSampleHandler));
                voicesPitchRange.addEventListener("change", eventToPromise.bind(null, voicesRateAndPitchRangesElementOnChangeSpeakSampleHandler));

                voicesDefaultToggleButton.addEventListener("click", eventToPromise.bind(null, voicesDefaultToggleButtonOnClickToggleLanguageVoiceOverrideNameHandler));

                voicesSampleTextElement.addEventListener("focus", () => {
                    voicesSampleTextElement.select();
                });

                return undefined;
            });
    }
);

const loadOptionAndStartListeners = () => promiseTry(
    () => {
        const hideDonationsOptionId = "options-popup-donate-buttons-hide";
        const hideDonationsId = "options-popup-donate-buttons-hide";

        return getBackgroundPage()
            .then((background) => background.getStoredValue(hideDonationsOptionId))
            .then((hideDonations) => {
                hideDonations = hideDonations === true;

                const hideDonationsElement = document.getElementById(hideDonationsId);
                hideDonationsElement.checked = hideDonations === true;

                const hideDonationsClickHandler = () => promiseTry(
                    () => {
                        return getBackgroundPage()
                            .then((background) => background.setStoredValue(hideDonationsOptionId, hideDonationsElement.checked === true));
                    }
                );

                hideDonationsElement.addEventListener("click", eventToPromise.bind(null, hideDonationsClickHandler));

                return undefined;
            });
    }
);

const loadVersion = () => promiseTry(
    () => {
        const versionElement = document.getElementById("version-name");

        return getBackgroundPage()
            .then((background) => background.getVersionName())
            .then((versionName) => {
                versionElement.textContent = versionName;

                return undefined;
            });
    }
);

const speakLegalese = () => promiseTry(
    () => {
        const legaleseTextElement = document.getElementById("license-gpl-legalese");

        const legaleseClickHandler = () => promiseTry(
            () => {
                const legaleseText = legaleseTextElement.textContent;
                const legaleseVoice = {
                    name: "Zarvox",
                    lang: "en-US",
                };

                return speak(legaleseText, legaleseVoice);
            }
        );

        legaleseTextElement.addEventListener("click", eventToPromise.bind(null, legaleseClickHandler));
    }
);

const onTabChange = () => promiseTry(
    () => {
        document.body.scrollTop = 0;
    }
);

const start = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "start");

        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => Promise.all([
                initializeTabrow(),
                loadVoicesAndLanguages(),
                loadOptionAndStartListeners(),
                speakLegalese(),
                loadVersion(),
            ]))
            .then(() => {
                dualLogger.dualLogDebug("Done", "start");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Start", error);
            });
    }
);

const stop = () => promiseTry(
    () => {
        dualLogger.dualLogDebug("Start", "stop");

        return Promise.resolve()
            .then(() => stopFrontend())
            .then(() => {
                dualLogger.dualLogDebug("Done", "stop");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Stop", "Stop", error);
            });
    }
);

registerUnhandledRejectionHandler();

document.addEventListener("tabchange", eventToPromise.bind(null, onTabChange));

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("unload", eventToPromise.bind(null, stop));
