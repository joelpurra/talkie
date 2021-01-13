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

// TODO: proper data handling.
import {
    promiseTry,
} from "../shared/promise";

import {
    getBackgroundPage,
} from "../shared/tabs";

import {
    openUrlInNewTab as sharedOpenUrlInNewTab,
    openShortKeysConfiguration as sharedOpenShortKeysConfiguration,
    openOptionsPage as sharedOpenOptionsPage,
} from "../shared/urls";

import {
    getMappedVoices,
} from "../shared/voices";

import {
    debounce,
} from "../shared/basic";

export default class Api {
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
        /* eslint-disable no-sync */
        return this.configuration.getSync(systemType, path);
        /* eslint-enable no-sync */
    }

    getConfigurationValue(configurationPath) {
        return this.configuration.get(configurationPath);
    }

    iconClick() {
        return getBackgroundPage()
            .then((background) => background.iconClick());
    }

    speak(text, voice) {
        return getBackgroundPage()
            .then((background) => background.stopSpeakFromFrontend()
                .then(() => background.startSpeakFromFrontend(text, voice)));
    }

    speakTextInLanguageWithOverrides(text, languageCode) {
        return getBackgroundPage()
            .then((background) => background.stopSpeakFromFrontend()
                .then(() => background.startSpeakInLanguageWithOverridesFromFrontend(text, languageCode)));
    }

    getVoices() {
        return getMappedVoices();
    }

    getIsPremiumEditionOption() {
        return getBackgroundPage()
            .then((background) => background.getIsPremiumEditionOption());
    }

    setIsPremiumEditionOption(isPremiumEdition) {
        return getBackgroundPage()
            .then((background) => background.setIsPremiumEditionOption(isPremiumEdition === true));
    }

    getSpeakLongTextsOption() {
        return getBackgroundPage()
            .then((background) => background.getSpeakLongTextsOption());
    }

    setSpeakLongTextsOption(speakLongTexts) {
        return getBackgroundPage()
            .then((background) => background.setSpeakLongTextsOption(speakLongTexts === true));
    }

    getSampleText() {
        return promiseTry(
            () => this.translator.translate("frontend_voicesSampleText"),
        );
    }

    getEffectiveVoiceForLanguage(languageCode) {
        return getBackgroundPage()
            .then((background) => background.getEffectiveVoiceForLanguage(languageCode))
            .then((effectiveVoiceForLanguage) => effectiveVoiceForLanguage.name);
    }

    getEffectiveRateForVoice(voiceName) {
        return getBackgroundPage()
            .then((background) => background.getEffectiveRateForVoice(voiceName));
    }

    setVoiceRateOverride(voiceName, rate) {
        return getBackgroundPage()
            .then((background) => background.setVoiceRateOverride(voiceName, rate));
    }

    getEffectivePitchForVoice(voiceName) {
        return getBackgroundPage()
            .then((background) => background.getEffectivePitchForVoice(voiceName));
    }

    setVoicePitchOverride(voiceName, pitch) {
        return getBackgroundPage()
            .then((background) => background.setVoicePitchOverride(voiceName, pitch));
    }

    toggleLanguageVoiceOverrideName(languageCode, voiceName) {
        return getBackgroundPage()
            .then((background) => background.toggleLanguageVoiceOverrideName(languageCode, voiceName));
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
