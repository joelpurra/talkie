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

import type Broadcaster from "@talkie/shared-application/broadcaster.mjs";
import type SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import type StorageManager from "@talkie/shared-application/storage-manager.mjs";
import {
	logDebug,
	logError,
	type LoggingLevel,
	logInfo,
	logTrace,
	logWarn,
	setLevel,
	setStringOnlyOutput,
} from "@talkie/shared-application-helpers/log.mjs";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import {
	type IMetadataManager,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import {
	type ITalkieServices,
} from "@talkie/split-environment-webextension/browser-specific/italkie-services.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";

import type HistoryManager from "../history-manager.mjs";
import type TalkieBackground from "../talkie-background.mjs";
import type TalkieSpeaker from "../talkie-speaker.mjs";
import type VoiceManager from "../voice-manager.mjs";

const createTalkieServices = async (
	broadcaster: ReadonlyDeep<Broadcaster>,
	configuration: ReadonlyDeep<IConfiguration>,
	historyManager: ReadonlyDeep<HistoryManager>,
	metadataManager: ReadonlyDeep<IMetadataManager>,
	settingsManager: ReadonlyDeep<SettingsManager>,
	storageManager: ReadonlyDeep<StorageManager>,
	talkieBackground: ReadonlyDeep<TalkieBackground>,
	talkieSpeaker: ReadonlyDeep<TalkieSpeaker>,
	voiceManager: ReadonlyDeep<VoiceManager>,
	// eslint-disable-next-line max-params
): Promise<ITalkieServices> => {
	// TODO: group methods.
	/* eslint-disable sort-keys */
	const talkieServices: ITalkieServices = {
		broadcaster: () => broadcaster,
		logTrace(...args: Readonly<unknown[]>) {
			void logTrace(...args);
		},

		logDebug(...args: Readonly<unknown[]>) {
			void logDebug(...args);
		},

		logInfo(...args: Readonly<unknown[]>) {
			void logInfo(...args);
		},

		logWarn(...args: Readonly<unknown[]>) {
			void logWarn(...args);
		},

		logError(...args: Readonly<unknown[]>) {
			void logError(...args);
		},

		setLoggingLevel(nextLevel: LoggingLevel) {
			setLevel(nextLevel);
		},

		setLoggingStringOnlyOutput(stringOnly: boolean) {
			setStringOnlyOutput(stringOnly);
		},
		getAllVoicesSafeObjects: async () => talkieSpeaker.getAllVoicesSafeObjects(),
		async iconClick() {
			// NOTE: keeping the root chain separate from the speech chain.
			void talkieBackground.startStopSpeakSelectionOnPage();
		},

		stopSpeakFromFrontend: async () => talkieBackground.stopSpeakingAction(),
		async startSpeakFromFrontend(text: string, voice: Readonly<IVoiceNameAndRateAndPitch>) {
			// NOTE: keeping the root chain separate from the speech chain.
			void talkieBackground.startSpeakingTextInVoiceAction(text, voice);
		},

		async startSpeakInVoiceWithOverridesFromFrontend(frontendText: string, frontendVoiceName: string) {
			// NOTE: not sure if copying these variables have any effect.
			// NOTE: Hope it helps avoid some vague "TypeError: can't access dead object" in Firefox.
			const text = String(frontendText);
			const voiceName = String(frontendVoiceName);

			// NOTE: keeping the root chain separate from the speech chain.
			void talkieBackground.startSpeakingTextInVoiceWithOverridesAction(text, voiceName);
		},

		async startSpeakInLanguageWithOverridesFromFrontend(frontendText: string, frontendLanguageCode: string) {
			// NOTE: not sure if copying these variables have any effect.
			// NOTE: Hope it helps avoid some vague "TypeError: can't access dead object" in Firefox.
			const text = String(frontendText);
			const languageCode = String(frontendLanguageCode);

			// NOTE: keeping the root chain separate from the speech chain.
			void talkieBackground.startSpeakingTextInLanguageWithOverridesAction(text, languageCode);
		},
		getVersionNumber: async () => metadataManager.getVersionNumber(),
		getVersionName: async () => metadataManager.getVersionName(),
		getEditionType: async () => metadataManager.getEditionType(),
		isPremiumEdition: async () => metadataManager.isPremiumEdition(),
		getSystemType: async () => metadataManager.getSystemType(),
		getOperatingSystemType: async () => metadataManager.getOperatingSystemType(),

		getIsPremiumEdition: async () => settingsManager.getIsPremiumEdition(),
		setIsPremiumEdition: async (isPremiumEdition: boolean) => settingsManager.setIsPremiumEdition(isPremiumEdition),
		getSpeakLongTexts: async () => settingsManager.getSpeakLongTexts(),
		setSpeakLongTexts: async (speakLongTexts: boolean) => settingsManager.setSpeakLongTexts(speakLongTexts),
		getShowAdditionalDetails: async () => settingsManager.getShowAdditionalDetails(),
		setShowAdditionalDetails: async (showAdditionalDetails: boolean) => settingsManager.setShowAdditionalDetails(showAdditionalDetails),
		getSpeakingHistoryLimit: async () => settingsManager.getSpeakingHistoryLimit(),
		setSpeakingHistoryLimit: async (speakingHistoryLimit: number) => settingsManager.setSpeakingHistoryLimit(speakingHistoryLimit),

		getMostRecentSpeakingEntry: async () => historyManager.getMostRecentSpeakingEntry(),
		getSpeakingHistory: async () => historyManager.getSpeakingHistory(),
		clearSpeakingHistory: async () => historyManager.clearSpeakingHistory(),
		pruneSpeakingHistory: async () => historyManager.pruneSpeakingHistory(),
		removeSpeakingHistoryEntry: async (hash: number) => historyManager.removeSpeakingHistoryEntry(hash),
		storeMostRecentSpeakingEntry: async (speakingHistoryEntry: ReadonlyDeep<SpeakingHistoryEntry>) => historyManager.storeMostRecentSpeakingEntry(speakingHistoryEntry),

		getEffectiveVoiceForLanguage: async (languageName: string) => voiceManager.getEffectiveVoiceForLanguage(languageName),
		isLanguageVoiceOverrideName: async (languageName: string, voiceName: string) => voiceManager.isLanguageVoiceOverrideName(languageName, voiceName),
		toggleLanguageVoiceOverrideName: async (languageName: string, voiceName: string) => voiceManager.toggleLanguageVoiceOverrideName(languageName, voiceName),
		getVoiceRateDefault: async (voiceName: string) => voiceManager.getVoiceRateDefault(voiceName),
		setVoiceRateOverride: async (voiceName: string, rate: number) => voiceManager.setVoiceRateOverride(voiceName, rate),
		getEffectiveRateForVoice: async (voiceName: string) => voiceManager.getEffectiveRateForVoice(voiceName),
		getVoicePitchDefault: async (voiceName: string) => voiceManager.getVoicePitchDefault(voiceName),
		setVoicePitchOverride: async (voiceName: string, pitch: number) => voiceManager.setVoicePitchOverride(voiceName, pitch),
		getEffectivePitchForVoice: async (voiceName: string) => voiceManager.getEffectivePitchForVoice(voiceName),

		getStoredValue: async <T extends JsonValue>(key: string) => storageManager.getStoredValue<T>(key),
		setStoredValue: async (key: string, value: JsonValue) => storageManager.setStoredValue(key, value),
		getConfigurationValue: async <T extends JsonValue>(path: string) => configuration.get<T>(path),
	};
	/* eslint-enable sort-keys */

	return talkieServices;
};

export default createTalkieServices;
