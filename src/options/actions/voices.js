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

export const loadSelectedLanguageCode = (languageCode) =>
	(dispatch) => {
		dispatch(setSelectedLanguageCode(languageCode));

		return dispatch(loadEffectiveVoiceForLanguage(languageCode));
	};

const setSelectedLanguageCode = (selectedLanguageCode) => {
	return {
		selectedLanguageCode,
		type: actionTypes.SET_SELECTED_LANGUAGE_CODE,
	};
};

export const loadSelectedVoiceName = (voiceName) =>
	async (dispatch, getState) => {
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

		await Promise.all([
			dispatch(setSelectedVoiceName(existingVoiceName)),
			dispatch(loadEffectiveRateForVoice(existingVoiceName)),
			dispatch(loadEffectivePitchForVoice(existingVoiceName)),
		]);

		await dispatch(speakState());
	};

const setSelectedVoiceName = (selectedVoiceName) => {
	return {
		selectedVoiceName,
		type: actionTypes.SET_SELECTED_VOICE_NAME,
	};
};

export const loadSampleText = () =>
	async (dispatch, getState, api) => {
		const sampleText = await api.getSampleText();
		await dispatch(setSampleText(sampleText));
	};

export const setSampleText = (sampleText) => {
	return {
		sampleText,
		type: actionTypes.SET_SAMPLE_TEXT,
	};
};

export const loadEffectiveRateForVoice = (voiceName) =>
	async (dispatch, getState, api) => {
		const effectiveRateForVoice = await api.getEffectiveRateForVoice(voiceName);
		await dispatch(setRateForSelectedVoice(effectiveRateForVoice));
	};

export const storeVoiceRateOverride = (voiceName, rate) =>
	async (dispatch, getState, api) => {
		await api.setVoiceRateOverride(voiceName, rate);
		await dispatch(setRateForSelectedVoice(rate));
	};

export const setRateForSelectedVoice = (rateForSelectedVoice) =>
	async (dispatch) => {
		await dispatch({
			rateForSelectedVoice,
			type: actionTypes.SET_RATE_FOR_SELECTED_VOICE,
		});
		await dispatch(speakState());
	};

export const loadEffectivePitchForVoice = (voiceName) =>
	async (dispatch, getState, api) => {
		const effectivePitchForVoice = await api.getEffectivePitchForVoice(voiceName);

		await dispatch(setPitchForSelectedVoice(effectivePitchForVoice));
	};

export const storeVoicePitchOverride = (voiceName, pitch) =>
	async (dispatch, getState, api) => {
		await api.setVoicePitchOverride(voiceName, pitch);
		await dispatch(setPitchForSelectedVoice(pitch));
	};

export const setPitchForSelectedVoice = (pitchForSelectedVoice) =>
	async (dispatch) => {
		await dispatch({
			pitchForSelectedVoice,
			type: actionTypes.SET_PITCH_FOR_SELECTED_VOICE,
		});
		await dispatch(speakState());
	};

export const loadEffectiveVoiceForLanguage = (languageCode) =>
	async (dispatch, getState, api) => {
		if (languageCode) {
			const effectiveVoiceForLanguage = await api.getEffectiveVoiceForLanguage(languageCode);

			await Promise.all([
				dispatch(setEffectiveVoiceNameForSelectedLanguage(effectiveVoiceForLanguage)),
				dispatch(loadSelectedVoiceName(effectiveVoiceForLanguage)),
			]);
		} else {
			const state = getState();

			const newSelectedVoiceName = (state.shared.voices.voices.length > 0 && state.shared.voices.voices[0].name) || null;

			await Promise.all([
				dispatch(setEffectiveVoiceNameForSelectedLanguage(null)),
				dispatch(loadSelectedVoiceName(newSelectedVoiceName)),
			]);
		}
	};

export const storeEffectiveVoiceNameForLanguage = (languageCode, voiceName) =>
	async (dispatch, getState, api) => {
		await api.toggleLanguageVoiceOverrideName(languageCode, voiceName);
		await dispatch(loadEffectiveVoiceForLanguage(languageCode));
	};

export const setEffectiveVoiceNameForSelectedLanguage = (effectiveVoiceNameForSelectedLanguage) => {
	return {
		effectiveVoiceNameForSelectedLanguage,
		type: actionTypes.SET_DEFAULT_VOICE_NAME_FOR_SELECTED_LANGUAGE,
	};
};

export const speakState = () =>
	async (dispatch, getState, api) => {
		const state = getState();

		// TODO: move to function and/or state?
		const readyToSpeak = state
							&& state.voices
							&& typeof state.voices.sampleText === "string"
							&& state.voices.sampleText.length > 0
							&& (
								(
									typeof state.voices.selectedLanguageCode === "string"
									&& state.voices.selectedLanguageCode.length > 0
								)
								|| (
									typeof state.voices.selectedVoiceName === "string"
									&& state.voices.selectedVoiceName.length > 0
								)
							)
							&& !Number.isNaN(state.voices.rateForSelectedVoice)
							&& !Number.isNaN(state.voices.pitchForSelectedVoice);

		if (readyToSpeak) {
			const text = state.voices.sampleText;
			const voice = {
				lang: state.voices.selectedLanguageCode || null,
				name: state.voices.selectedVoiceName || null,
				pitch: state.voices.pitchForSelectedVoice,
				rate: state.voices.rateForSelectedVoice,
			};

			await api.debouncedSpeak(text, voice);
		}
	};
