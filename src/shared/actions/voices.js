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

import * as actionTypes from "../constants/action-types-voices";

/*eslint no-unused-vars: ["warn", { "args": "after-used" }] */

export const loadVoices = () =>
    (dispatch, getState, api) => api.getVoices()
        .then((voices) => dispatch(setVoices(voices)));

export const setVoices = (voices) => {
    return { type: actionTypes.SET_VOICES, voices };
};

export const loadSpeakLongTexts = () =>
    (dispatch, getState, api) => api.getSpeakLongTextsOption()
        .then((speakLongTexts) => dispatch(setSpeakLongTexts(speakLongTexts)));

export const storeSpeakLongTexts = (speakLongTexts) =>
    (dispatch, getState, api) => api.setSpeakLongTextsOption(speakLongTexts)
        .then(() => dispatch(loadSpeakLongTexts()));

export const setSpeakLongTexts = (speakLongTexts) => {
    return { type: actionTypes.SET_SPEAK_LONG_TEXTS, speakLongTexts };
};

export const loadSelectedLanguageCode = (languageCode) =>
    (dispatch) => {
        dispatch(setSelectedLanguageCode(languageCode));

        return dispatch(loadEffectiveVoiceForLanguage(languageCode));
    };

const setSelectedLanguageCode = (selectedLanguageCode) => {
    return { type: actionTypes.SET_SELECTED_LANGUAGE_CODE, selectedLanguageCode };
};

export const loadSelectedVoiceName = (voiceName) =>
    (dispatch, getState) => {
        const state = getState();

        // TODO: move to function and/or state?
        let existingVoiceName = null;

        if (
            state
            && state.shared
            && state.shared.voices
            && state.shared.voices.voices
            && state.shared.voices.voices.some((voice) => voice.name === voiceName)
        ) {
            existingVoiceName = voiceName;
        }

        return Promise.all([
            dispatch(setSelectedVoiceName(existingVoiceName)),
            dispatch(loadEffectiveRateForVoice(existingVoiceName)),
            dispatch(loadEffectivePitchForVoice(existingVoiceName)),
        ])
            .then(() => dispatch(speakState()));
    };

const setSelectedVoiceName = (selectedVoiceName) => {
    return { type: actionTypes.SET_SELECTED_VOICE_NAME, selectedVoiceName };
};

export const loadSampleText = () =>
    (dispatch, getState, api) => api.getSampleText()
        .then((sampleText) => dispatch(setSampleText(sampleText)));

export const setSampleText = (sampleText) => {
    return { type: actionTypes.SET_SAMPLE_TEXT, sampleText };
};

export const loadEffectiveRateForVoice = (voiceName) =>
    (dispatch, getState, api) => api.getEffectiveRateForVoice(voiceName)
        .then((effectiveRateForVoice) => dispatch(setRateForSelectedVoice(effectiveRateForVoice)));

export const storeVoiceRateOverride = (voiceName, rate) =>
    (dispatch, getState, api) => api.setVoiceRateOverride(voiceName, rate)
        .then(() => dispatch(setRateForSelectedVoice(rate)));

export const setRateForSelectedVoice = (rateForSelectedVoice) =>
    (dispatch) => Promise.resolve()
        .then(() => dispatch({ type: actionTypes.SET_RATE_FOR_SELECTED_VOICE, rateForSelectedVoice }))
        .then(() => dispatch(speakState()));

export const loadEffectivePitchForVoice = (voiceName) =>
    (dispatch, getState, api) => api.getEffectivePitchForVoice(voiceName)
        .then((effectivePitchForVoice) => dispatch(setPitchForSelectedVoice(effectivePitchForVoice)));

export const storeVoicePitchOverride = (voiceName, pitch) =>
    (dispatch, getState, api) => api.setVoicePitchOverride(voiceName, pitch)
        .then(() => dispatch(setPitchForSelectedVoice(pitch)));

export const setPitchForSelectedVoice = (pitchForSelectedVoice) =>
    (dispatch) => Promise.resolve()
        .then(() => dispatch({ type: actionTypes.SET_PITCH_FOR_SELECTED_VOICE, pitchForSelectedVoice }))
        .then(() => dispatch(speakState()));

export const loadEffectiveVoiceForLanguage = (languageCode) =>
    (dispatch, getState, api) => {
        if (languageCode) {
            return api.getEffectiveVoiceForLanguage(languageCode)
                .then((effectiveVoiceForLanguage) => Promise.all([
                    dispatch(setEffectiveVoiceNameForSelectedLanguage(effectiveVoiceForLanguage)),
                    dispatch(loadSelectedVoiceName(effectiveVoiceForLanguage)),
                ]));
        }

        const state = getState();

        const newSelectedVoiceName = (state.shared.voices.voices.length > 0 && state.shared.voices.voices[0].name) || null;

        return Promise.all([
            dispatch(setEffectiveVoiceNameForSelectedLanguage(null)),
            dispatch(loadSelectedVoiceName(newSelectedVoiceName)),
        ]);
    };

export const storeEffectiveVoiceNameForLanguage = (languageCode, voiceName) =>
    (dispatch, getState, api) => api.toggleLanguageVoiceOverrideName(languageCode, voiceName)
        .then(() => dispatch(loadEffectiveVoiceForLanguage(languageCode)));

export const setEffectiveVoiceNameForSelectedLanguage = (effectiveVoiceNameForSelectedLanguage) => {
    return { type: actionTypes.SET_DEFAULT_VOICE_NAME_FOR_SELECTED_LANGUAGE, effectiveVoiceNameForSelectedLanguage };
};

function getNavigatorLanguage() {
    let lang = null;

    try {
        lang = navigator.language;
    }
    catch (error)
    {
        // NOTE: swallowing errors.
    }

    return lang;
};

function getNavigatorLanguages() {
    let langs = null;

    try {
        langs = navigator.languages;
    }
    catch (error)
    {
        // NOTE: swallowing errors.
        langs = [];
    }

    return langs;
};

export const loadNavigatorLanguage = () =>
    (dispatch) => Promise.resolve()
        .then(() => getNavigatorLanguage())
        .then((navigatorLanguage) => dispatch(setNavigatorLanguage(navigatorLanguage)));

export const setNavigatorLanguage = (navigatorLanguage) => {
    return { type: actionTypes.SET_NAVIGATOR_LANGUAGE, navigatorLanguage };
};

export const loadNavigatorLanguages = () =>
    (dispatch) => Promise.resolve()
        .then(() => getNavigatorLanguages())
        .then((navigatorLanguages) => dispatch(setNavigatorLanguages(navigatorLanguages)));

export const setNavigatorLanguages = (navigatorLanguages) => {
    return { type: actionTypes.SET_NAVIGATOR_LANGUAGES, navigatorLanguages };
};

export const loadTranslatedLanguages = () =>
    (dispatch, getState, api) => api.getTranslatedLanguages()
        .then((translatedLanguages) => dispatch(setTranslatedLanguages(translatedLanguages)));

export const setTranslatedLanguages = (translatedLanguages) => {
    return { type: actionTypes.SET_TRANSLATED_LANGUAGES, translatedLanguages };
};

export const speakState = () =>
    (dispatch, getState) => Promise.resolve()
        .then(() => {
            const state = getState();

            // TODO: move to function and/or state?
            const readyToSpeak = state
                            && state.shared
                            && state.shared.voices
                            && typeof state.shared.voices.sampleText === "string"
                            && state.shared.voices.sampleText.length > 0
                            && (
                                (
                                    typeof state.shared.voices.selectedLanguageCode === "string"
                                    && state.shared.voices.selectedLanguageCode.length > 0
                                )
                                || (
                                    typeof state.shared.voices.selectedVoiceName === "string"
                                    && state.shared.voices.selectedVoiceName.length > 0
                                )
                            )
                            && !isNaN(state.shared.voices.rateForSelectedVoice)
                            && !isNaN(state.shared.voices.pitchForSelectedVoice);

            if (readyToSpeak) {
                const text = state.shared.voices.sampleText;
                const voice = {
                    lang: state.shared.voices.selectedLanguageCode || null,
                    name: state.shared.voices.selectedVoiceName || null,
                    rate: state.shared.voices.rateForSelectedVoice,
                    pitch: state.shared.voices.pitchForSelectedVoice,
                };

                return dispatch(speak(text, voice));
            }

            return undefined;
        });

export const speak = (text, voice) =>
    (dispatch, getState, api) => api.debouncedSpeak(text, voice);
