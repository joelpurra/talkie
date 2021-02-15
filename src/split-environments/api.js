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

// TODO: proper data handling.
import {
	debounce,
} from "../shared/basic";
import {
	getBackgroundPage,
} from "../shared/tabs";
import {
	openOptionsPage as sharedOpenOptionsPage,
	openShortKeysConfiguration as sharedOpenShortKeysConfiguration,
	openUrlInNewTab as sharedOpenUrlInNewTab,
} from "../shared/urls";
import {
	getMappedVoices,
} from "../shared/voices";

export default class Api {
	// eslint-disable-next-line max-params
	constructor(metadataManager, configuration, translator, broadcastProvider, talkieLocaleHelper) {
		this.metadataManager = metadataManager;
		this.configuration = configuration;
		this.translator = translator;
		this.broadcastProvider = broadcastProvider;
		this.talkieLocaleHelper = talkieLocaleHelper;

		this.debouncedSpeak = debounce(this.speak.bind(this), 200);
		this.debouncedSpeakTextInLanguageWithOverrides = debounce(this.speakTextInLanguageWithOverrides.bind(this), 200);
	}

	getConfigurationValueSync(systemType, path) {
		// eslint-disable-next-line no-sync
		return this.configuration.getSync(systemType, path);
	}

	getConfigurationValue(configurationPath) {
		return this.configuration.get(configurationPath);
	}

	async iconClick() {
		const background = await getBackgroundPage();

		await background.iconClick();
	}

	async speak(text, voice) {
		const background = await getBackgroundPage();

		await background.stopSpeakFromFrontend();
		await background.startSpeakFromFrontend(text, voice);
	}

	async speakTextInLanguageWithOverrides(text, languageCode) {
		const background = await getBackgroundPage();

		await background.stopSpeakFromFrontend();
		await background.startSpeakInLanguageWithOverridesFromFrontend(text, languageCode);
	}

	getVoices() {
		return getMappedVoices();
	}

	async getIsPremiumEditionOption() {
		const background = await getBackgroundPage();

		return background.getIsPremiumEditionOption();
	}

	async setIsPremiumEditionOption(isPremiumEdition) {
		const background = await getBackgroundPage();

		await background.setIsPremiumEditionOption(isPremiumEdition === true);
	}

	async getSpeakLongTextsOption() {
		const background = await getBackgroundPage();

		return background.getSpeakLongTextsOption();
	}

	async setSpeakLongTextsOption(speakLongTexts) {
		const background = await getBackgroundPage();

		await background.setSpeakLongTextsOption(speakLongTexts === true);
	}

	async getSampleText() {
		return this.translator.translate("frontend_voicesSampleText");
	}

	async getEffectiveVoiceForLanguage(languageCode) {
		const background = await getBackgroundPage();
		const effectiveVoiceForLanguage = await background.getEffectiveVoiceForLanguage(languageCode);

		return effectiveVoiceForLanguage.name;
	}

	async getEffectiveRateForVoice(voiceName) {
		const background = await getBackgroundPage();

		await background.getEffectiveRateForVoice(voiceName);
	}

	async setVoiceRateOverride(voiceName, rate) {
		const background = await getBackgroundPage();

		await background.setVoiceRateOverride(voiceName, rate);
	}

	async getEffectivePitchForVoice(voiceName) {
		const background = await getBackgroundPage();

		await background.getEffectivePitchForVoice(voiceName);
	}

	async setVoicePitchOverride(voiceName, pitch) {
		const background = await getBackgroundPage();

		await background.setVoicePitchOverride(voiceName, pitch);
	}

	async toggleLanguageVoiceOverrideName(languageCode, voiceName) {
		const background = await getBackgroundPage();

		await background.toggleLanguageVoiceOverrideName(languageCode, voiceName);
	}

	getTranslatedLanguages() {
		return this.talkieLocaleHelper.getTranslatedLanguages();
	}

	isPremiumEdition() {
		return this.metadataManager.isPremiumEdition();
	}

	getVersionName() {
		return this.metadataManager.getVersionName();
	}

	getVersionNumber() {
		return this.metadataManager.getVersionNumber();
	}

	getEditionType() {
		return this.metadataManager.getEditionType();
	}

	getSystemType() {
		return this.metadataManager.getSystemType();
	}

	getOsType() {
		return this.metadataManager.getOsType();
	}

	openUrlInNewTab(url) {
		return sharedOpenUrlInNewTab(url);
	}

	openShortKeysConfiguration() {
		return sharedOpenShortKeysConfiguration();
	}

	openOptionsPage() {
		return sharedOpenOptionsPage();
	}

	registerListeningAction(event, handler) {
		return this.broadcastProvider.registerListeningAction(event, handler);
	}
}
