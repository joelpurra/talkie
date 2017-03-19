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
    getMappedVoices,
} from "../shared/voices";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    eventToPromise,
    startFrontend,
    stopFrontend,
} from "../frontend/shared-frontend";

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

const speakSelectedVoiceAndText = (selectedVoiceOption, textElement) => promiseTry(
    () => {
        const sampleText = textElement.value.trim();

        if (sampleText.length === 0) {
            return;
        }

        if (selectedVoiceOption && selectedVoiceOption && selectedVoiceOption.talkie && typeof Array.isArray(selectedVoiceOption.talkie.voices)) {
            const voice = selectedVoiceOption.talkie.voices[0];

            return speak(sampleText, voice);
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
                const messageDetails = [
                    `<strong>${languageName}</strong>`,
                    `<strong>${voiceName}</strong>`,
                ];

                let buttonText = null;

                if (isPremium) {
                    voicesDefaultToggleButton.disabled = false;
                    buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageUseVoiceAsDefault_Premium", messageDetails);
                } else {
                    voicesDefaultToggleButton.disabled = true;
                    buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageUseVoiceAsDefault_Free", messageDetails);
                }

                // TODO: prevent translation HTML injection.
                voicesDefaultToggleButton.innerHTML = buttonText;

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

const loadVoicesAndLanguages = () => promiseTry(
    () => {
        return getMappedVoices()
            .then((allVoices) => {
                // NOTE: assuming the voices are available once the background has loaded.
                // TODO: verify.
                const allVoicesByLanguage = allVoices.reduce((obj, voice) => { obj[voice.lang] = (obj[voice.lang] || []).concat(voice); return obj; }, {});
                const allLanguages = Object.keys(allVoicesByLanguage);
                allLanguages.sort();
                dualLogger.dualLog("loadVoicesAndLanguages", "allVoicesByLanguage", allVoicesByLanguage);

                const allVoicesByLanguageGroup = allVoices.reduce((obj, voice) => { const group = voice.lang.substr(0, 2); obj[group] = (obj[group] || []).concat(voice); return obj; }, {});
                dualLogger.dualLog("loadVoicesAndLanguages", "allVoicesByLanguageGroup", allVoicesByLanguageGroup);

                const allLanguagesByLanguageGroup = allVoices.reduce((obj, voice) => { const group = voice.lang.substr(0, 2); obj[group] = (obj[group] || {}); obj[group][voice.lang] = allVoicesByLanguage[voice.lang]; return obj; }, {});
                const allLanguagesGroups = Object.keys(allLanguagesByLanguageGroup);
                allLanguagesGroups.sort();
                dualLogger.dualLog("loadVoicesAndLanguages", "allLanguagesGroups", allLanguagesGroups);

                const allVoicesByVoiceName = allVoices.reduce((obj, voice) => { obj[voice.name] = (obj[voice.name] || []).concat(voice); return obj; }, {});
                const allVoiceNames = Object.keys(allVoicesByVoiceName);
                allVoiceNames.sort();
                dualLogger.dualLog("loadVoicesAndLanguages", "allLanguagesByLanguageGroup", allLanguagesByLanguageGroup);

                const voicesLanguagesListElement = document.getElementById("voices-languages-list");
                const voicesVoicesListElement = document.getElementById("voices-voices-list");
                const voicesSampleTextElement = document.getElementById("voices-sample-text");
                const voicesAvailableLanguagesCount = document.getElementById("voices-available-languages-count");
                const voicesAvailableVoicesCount = document.getElementById("voices-available-voices-count");
                const voicesDefaultToggleButton = document.getElementById("voices-default-toggle");

                const getSelectedLanguageOption = () => getSelectedListOption(voicesLanguagesListElement);
                const getSelectedVoiceOption = () => getSelectedListOption(voicesVoicesListElement);

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

                const voiceListElementOnChangeSpeakSampleHandler = (/* eslint-disable no-unused-vars*/event/* eslint-enable no-unused-vars*/) => promiseTry(
                    () => {
                        const selectedVoiceOption = getSelectedVoiceOption();

                        return speakSelectedVoiceAndText(selectedVoiceOption, voicesSampleTextElement);
                    }
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
                voicesVoicesListElement.addEventListener("change", eventToPromise.bind(null, voiceListElementOnChangeSpeakSampleHandler));

                voicesVoicesListElement.addEventListener("change", eventToPromise.bind(null, voiceListElementOnChangeButtonHandler));

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

const start = () => promiseTry(
    () => {
        dualLogger.dualLog("Start", "start");

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
                dualLogger.dualLog("Done", "start");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Error", "Start", error);
            });
    }
);

const stop = () => promiseTry(
    () => {
        dualLogger.dualLog("Start", "stop");

        return Promise.resolve()
            .then(() => stopFrontend())
            .then(() => {
                dualLogger.dualLog("Done", "stop");

                return undefined;
            })
            .catch((error) => {
                dualLogger.dualLogError("Stop", "Stop", error);
            });
    }
);

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("unload", eventToPromise.bind(null, stop));
