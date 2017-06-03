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

// TODO: proper data handling.
import {
    promiseTry,
} from "../../shared/promise";

import {
    getBackgroundPage,
} from "../../shared/tabs";

import {
    openUrlInNewTab as sharedOpenUrlInNewTab,
} from "../../shared/urls";

import {
    getMappedVoices,
} from "../../shared/voices";

import {
    debounce,
} from "../../shared/basic";

import configurationObject from "../../configuration.json";

import SynchronousConfiguration from "./synchronous-configuration";

const synchronousConfiguration = new SynchronousConfiguration(configurationObject);

/* eslint-disable no-sync */
export const getConfigurationValueSync = (path) => synchronousConfiguration.getSync(path);
/* eslint-enable no-sync */

export const getConfigurationValue = (configurationPath) => getBackgroundPage()
    .then((background) => background.getConfigurationValue(configurationPath));

export const speak = (text, voice) => getBackgroundPage()
    .then((background) => background.stopSpeakFromFrontend()
        .then(() => background.startSpeakFromFrontend(text, voice))
    );

export const debouncedSpeak = debounce(speak, 200);

export const getVoices = () => getMappedVoices();

export const getSampleText = () => promiseTry(
    () => browser.i18n.getMessage("frontend_voicesSampleText")
);

export const getEffectiveVoiceForLanguage = (languageCode) => getBackgroundPage()
    .then((background) => background.getEffectiveVoiceForLanguage(languageCode))
    .then((effectiveVoiceForLanguage) => effectiveVoiceForLanguage.name);

export const getEffectiveRateForVoice = (voiceName) => getBackgroundPage()
    .then((background) => background.getEffectiveRateForVoice(voiceName));

export const setVoiceRateOverride = (voiceName, rate) => getBackgroundPage()
    .then((background) => background.setVoiceRateOverride(voiceName, rate));

export const getEffectivePitchForVoice = (voiceName) => getBackgroundPage()
    .then((background) => background.getEffectivePitchForVoice(voiceName));

export const setVoicePitchOverride = (voiceName, pitch) => getBackgroundPage()
    .then((background) => background.setVoicePitchOverride(voiceName, pitch));

export const toggleLanguageVoiceOverrideName = (languageCode, voiceName) => getBackgroundPage()
    .then((background) => background.toggleLanguageVoiceOverrideName(languageCode, voiceName));

export const isPremiumVersion = () => getBackgroundPage()
    .then((background) => background.isPremiumVersion());

export const getVersionName = () => getBackgroundPage()
    .then((background) => background.getVersionName());

export const openUrlInNewTab = (url) => sharedOpenUrlInNewTab(url);
