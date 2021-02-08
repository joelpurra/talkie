/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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
	async (dispatch, getState, api) => {
		const voices = await api.getVoices();

		await dispatch(setVoices(voices));
	};

export const setVoices = (voices) => {
	return {
		type: actionTypes.SET_VOICES,
		voices,
	};
};

export const loadSpeakLongTexts = () =>
	async (dispatch, getState, api) => {
		const speakLongTexts = await api.getSpeakLongTextsOption();

		await dispatch(setSpeakLongTexts(speakLongTexts));
	};

export const storeSpeakLongTexts = (speakLongTexts) =>
	async (dispatch, getState, api) => {
		await api.setSpeakLongTextsOption(speakLongTexts);
		await dispatch(loadSpeakLongTexts());
	};

export const setSpeakLongTexts = (speakLongTexts) => {
	return {
		speakLongTexts,
		type: actionTypes.SET_SPEAK_LONG_TEXTS,
	};
};

function getNavigatorLanguage() {
	let lang = null;

	try {
		lang = navigator.language;
	} catch {
		// NOTE: swallowing errors.
	}

	return lang;
}

function getNavigatorLanguages() {
	let langs = null;

	try {
		langs = navigator.languages;
	} catch {
		// NOTE: swallowing errors.
		langs = [];
	}

	return langs;
}

export const loadNavigatorLanguage = () =>
	async (dispatch) => {
		const navigatorLanguage = await getNavigatorLanguage();

		await dispatch(setNavigatorLanguage(navigatorLanguage));
	};

export const setNavigatorLanguage = (navigatorLanguage) => {
	return {
		navigatorLanguage,
		type: actionTypes.SET_NAVIGATOR_LANGUAGE,
	};
};

export const loadNavigatorLanguages = () =>
	async (dispatch) => {
		const navigatorLanguages = await getNavigatorLanguages();

		await dispatch(setNavigatorLanguages(navigatorLanguages));
	};

export const setNavigatorLanguages = (navigatorLanguages) => {
	return {
		navigatorLanguages,
		type: actionTypes.SET_NAVIGATOR_LANGUAGES,
	};
};

export const loadTranslatedLanguages = () =>
	async (dispatch, getState, api) => {
		const translatedLanguages = await api.getTranslatedLanguages();

		await dispatch(setTranslatedLanguages(translatedLanguages));
	};

export const setTranslatedLanguages = (translatedLanguages) => {
	return {
		translatedLanguages,
		type: actionTypes.SET_TRANSLATED_LANGUAGES,
	};
};

export const speak = (text, voice) =>
	(dispatch, getState, api) => api.debouncedSpeak(text, voice);
