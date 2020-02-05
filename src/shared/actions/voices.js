/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

export const speak = (text, voice) =>
    (dispatch, getState, api) => api.debouncedSpeak(text, voice);
