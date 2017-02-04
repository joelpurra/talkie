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
console:false,
dualLog:false,
dualLogError:false,
eventToPromise:false,
getBackgroundPage:false,
getStoredValue:false,
getMappedVoices:false,
Promise:false,
promiseTry:false,
setStoredValue:false,
startFrontend:false,
stopFrontend:false,
Tabrow:false,
window:false,
*/

/* eslint-disable no-undef */
localScriptName = "options.js";
/* eslint-enable no-undef */

dualLog("Start", "Loading code");

const initializeTabrow = () => promiseTry(
    () => {
        const optionsTabrow = new Tabrow("options-tabrow");
        optionsTabrow.initialize();
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
                dualLog("loadVoicesAndLanguages", "allVoicesByLanguage", allVoicesByLanguage);

                const allVoicesByLanguageGroup = allVoices.reduce((obj, voice) => { const group = voice.lang.substr(0, 2); obj[group] = (obj[group] || {}); obj[group][voice.lang] = allVoicesByLanguage[voice.lang]; return obj; }, {});
                const allLanguagesGroups = Object.keys(allVoicesByLanguageGroup);
                allLanguagesGroups.sort();
                dualLog("loadVoicesAndLanguages", "allLanguagesGroups", allLanguagesGroups);

                const allVoicesByVoiceName = allVoices.reduce((obj, voice) => { obj[voice.name] = (obj[voice.name] || []).concat(voice); return obj; }, {});
                const allVoiceNames = Object.keys(allVoicesByVoiceName);
                allVoiceNames.sort();
                dualLog("loadVoicesAndLanguages", "allVoicesByLanguageGroup", allVoicesByLanguageGroup);

                const voicesLanguagesListElement = document.getElementById("voices-languages-list");
                const voicesVoicesListElement = document.getElementById("voices-voices-list");
                const voicesSampleTextElement = document.getElementById("voices-sample-text");

                const displayVoicesInSelectElement = (selectedVoices) => {
                    Array.from(voicesVoicesListElement.children).forEach((child) => child.remove());

                    selectedVoices.forEach((voice) => {
                        const option = document.createElement("option");
                        option.talkie = {};
                        option.talkie.voiceName = voice.name;
                        option.talkie.voices = [voice];
                        option.textContent = voice.name;

                        voicesVoicesListElement.appendChild(option);
                    });
                };

                displayVoicesInSelectElement(allVoices);

                const voiceListElementOnChangeHandler = (event) => promiseTry(
                    () => {
                        const selectElement = event.target;
                        const selectedOption = Array.from(selectElement.querySelectorAll("option")).filter((option) => option.selected === true)[0] || null;

                        const sampleText = voicesSampleTextElement.textContent.trim();

                        if (sampleText.length === 0) {
                            return;
                        }

                        return getBackgroundPage()
                            .then((background) => {
                            // TODO: use proper Talkie function.
                                background.speechSynthesis.cancel();

                                if (selectedOption && selectedOption && selectedOption.talkie && typeof Array.isArray(selectedOption.talkie.voices)) {
                                    const lang = selectedOption.talkie.voices[0].lang;

                                    return background.fallbackSpeak(background.speechSynthesis, sampleText, lang);
                                }

                                return undefined;
                            });
                    }
                );

                Array.from(voicesLanguagesListElement.children).forEach((child) => child.remove());

                {
                    const allLanguageOption = document.createElement("option");
                    allLanguageOption.talkie = {};
                    allLanguageOption.talkie.language = null;
                    allLanguageOption.talkie.voices = allVoices;

                // TODO: translate.
                    allLanguageOption.textContent = "All";

                    voicesLanguagesListElement.appendChild(allLanguageOption);
                }

                allLanguagesGroups.forEach((languageGroup) => {
                    const optgroup = document.createElement("optgroup");
                    optgroup.label = languageGroup;

                    const languagesPerGroupKeys = Object.keys(allVoicesByLanguageGroup[languageGroup]);
                    languagesPerGroupKeys.sort();

                    languagesPerGroupKeys.forEach((language) => {
                        const option = document.createElement("option");
                        option.talkie = {};
                        option.talkie.language = language;
                        option.talkie.voices = allVoicesByLanguage[language];
                        option.textContent = language;

                        optgroup.appendChild(option);
                    });

                    voicesLanguagesListElement.appendChild(optgroup);
                });

                const languageListElementOnChangeHandler = (event) => promiseTry(
                    () => {
                        const selectElement = event.target;
                        const selectedOption = Array.from(selectElement.querySelectorAll("option")).filter((option) => option.selected === true)[0] || null;

                        if (selectedOption && selectedOption && selectedOption.talkie && Array.isArray(selectedOption.talkie.voices)) {
                            const voicesForLanguage = selectedOption.talkie.voices;

                            displayVoicesInSelectElement(voicesForLanguage);
                        } else {
                            displayVoicesInSelectElement(allVoices);
                        }
                    }
            );

                voicesLanguagesListElement.onchange = eventToPromise.bind(this, languageListElementOnChangeHandler);
                voicesVoicesListElement.onchange = eventToPromise.bind(this, voiceListElementOnChangeHandler);

                voicesSampleTextElement.onfocus = () => {
                    voicesSampleTextElement.select();
                };

                return undefined;
            });
    }
);

const loadOptionAndStartListeners = () => promiseTry(
    () => {
        const hideDonationsId = "options-popup-donate-buttons-hide";

        return Promise.resolve()
            .then(() => getStoredValue(hideDonationsId))
            .then((hideDonations) => {
                hideDonations = hideDonations === true;

                const hideDonationsElement = document.getElementById(hideDonationsId);
                hideDonationsElement.checked = hideDonations === true;

                hideDonationsElement.onclick = () => {
                    return setStoredValue(hideDonationsId, hideDonationsElement.checked === true);
                };

                return undefined;
            });
    }
);

const start = () => promiseTry(
    () => {
        dualLog("Start", "start");

        return Promise.resolve()
            .then(() => startFrontend())
            .then(() => initializeTabrow())
            .then(() => loadVoicesAndLanguages())
            .then(() => loadOptionAndStartListeners())
            .then(() => {
                dualLog("Done", "start");

                return undefined;
            })
            .catch((error) => {
                dualLogError("Error", "Start", error);
            });
    }
);

const stop = () => promiseTry(
    () => {
        dualLog("Start", "stop");

        return Promise.resolve()
            .then(() => stopFrontend())
            .then(() => {
                dualLog("Done", "stop");

                return undefined;
            })
            .catch((error) => {
                dualLogError("Stop", "Stop", error);
            });
    }
);

document.addEventListener("DOMContentLoaded", eventToPromise.bind(this, start));
window.addEventListener("unload", eventToPromise.bind(this, stop));

dualLog("Done", "Loading code");
