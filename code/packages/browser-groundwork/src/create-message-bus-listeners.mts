/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type HistoryManager from "@talkie/browser-bricks/history-manager.mjs";
import type SpeakClipboardManager from "@talkie/browser-bricks/speak-clipboard-manager.mjs";
import type SpeakerManager from "@talkie/browser-bricks/speaker-manager.mjs";
import type SpeakerPageManager from "@talkie/browser-bricks/speaker-page-manager.mjs";
import type Speaker from "@talkie/browser-bricks/speaker.mjs";
import type VoiceManager from "@talkie/browser-bricks/voice-manager.mjs";
import type SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import type {
	IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";
import type {
	IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import createMessageBusListenerHelpers from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	type UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import {
	type IMessageBusProviderGetter,
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

const createMessageBusListeners = async (
	messageBusProviderGetter: ReadonlyDeep<IMessageBusProviderGetter>,
	historyManager: ReadonlyDeep<HistoryManager>,
	premiumManager: ReadonlyDeep<IPremiumManager>,
	settingsManager: ReadonlyDeep<SettingsManager>,
	voiceManager: ReadonlyDeep<VoiceManager>,
	speaker: ReadonlyDeep<Speaker>,
	speakerManager: ReadonlyDeep<SpeakerManager>,
	speakerPageManager: ReadonlyDeep<SpeakerPageManager>,
	readClipboardManager: ReadonlyDeep<SpeakClipboardManager>,
	// eslint-disable-next-line max-params
): Promise<UninitializerCallback[]> => {
	const {
		startReactor,
		startResponder,
	} = createMessageBusListenerHelpers(messageBusProviderGetter);

	// TODO: properly group methods; preferably break out into groups of listeners.
	/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

	const t = [
		startReactor("extension:icon-click", async () => {
			// NOTE: keeping the root chain separate from the speech chain.
			void speakerPageManager.startStopSpeakSelectionOnPage();

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:speaking:stop", async () => {
			await speaker.stopSpeaking();

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:speaking:speakInCustomVoice", async (
			_action,
			{
				text,
				voice,
			}: {
				text: string;
				voice: Readonly<IVoiceNameAndRateAndPitch>;
			},
		) => {
			// NOTE: keeping the root chain separate from the speech chain.
			void speakerManager.speakTextInVoice(text, voice);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:speaking:speakInVoiceWithOverrides", async (
			_action,
			{
				text,
				voiceName,
			}: {
				text: string;
				voiceName: string;
			},
		) => {
			// NOTE: keeping the root chain separate from the speech chain.
			void speakerManager.speakTextInVoiceByName(text, voiceName);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:speaking:speakInLanguageWithOverrides", async (
			_action,
			{
				text,
				languageCode,
			}: {
				text: string;
				languageCode: string;
			},
		) => {
			// NOTE: keeping the root chain separate from the speech chain.
			void speakerManager.speakTextInLanguage(text, languageCode);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
		startResponder("service:voices:getEffectiveVoiceForLanguage", async (_action, languageCode: string) => voiceManager.getEffectiveVoiceForLanguage(languageCode) as any),

		startResponder("service:voices:toggleLanguageVoiceOverrideName", async (
			_action,
			{
				languageCode,
				voiceName,
			}: {
				languageCode: string;
				voiceName: string;
			},
		) => voiceManager.toggleLanguageVoiceOverrideName(languageCode, voiceName)),

		startResponder("service:voices:getEffectiveRateForVoice", async (_action, voiceName: string) => voiceManager.getEffectiveRateForVoice(voiceName)),

		startReactor("service:voices:setVoiceRateOverride", async (
			_action,
			{
				voiceName,
				rate,
			}: {
				voiceName: string;
				rate: number;
			},
		) => {
			await voiceManager.setVoiceRateOverride(voiceName, rate);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:voices:getEffectivePitchForVoice", async (_action, voiceName: string) => voiceManager.getEffectivePitchForVoice(voiceName)),

		startReactor("service:voices:setVoicePitchOverride", async (
			_action,
			{
				voiceName,
				pitch,
			}: {
				voiceName: string;
				pitch: number;
			},
		) => {
			await voiceManager.setVoicePitchOverride(voiceName, pitch);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:premium:isPremiumEdition", async () => premiumManager.isPremiumEdition()),

		startResponder("service:settings:getIsPremiumEdition", async () => settingsManager.getIsPremiumEdition()),

		startReactor("service:settings:setIsPremiumEdition", async (_action, isPremiumEdition: boolean) => {
			await settingsManager.setIsPremiumEdition(isPremiumEdition);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:settings:getSpeakLongTexts", async () => settingsManager.getSpeakLongTexts()),

		startReactor("service:settings:setSpeakLongTexts", async (_action, speakLongTexts: boolean) => {
			await settingsManager.setSpeakLongTexts(speakLongTexts);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:settings:getShowAdditionalDetails", async () => settingsManager.getShowAdditionalDetails()),

		startReactor("service:settings:setShowAdditionalDetails", async (_action, showAdditionalDetails: boolean) => {
			await settingsManager.setShowAdditionalDetails(showAdditionalDetails);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:settings:getSpeakingHistoryLimit", async () => settingsManager.getSpeakingHistoryLimit()),

		startReactor("service:settings:setSpeakingHistoryLimit", async (_action, speakingHistoryLimit: number) => {
			await settingsManager.setSpeakingHistoryLimit(speakingHistoryLimit);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:settings:getContinueOnTabRemoved", async () => settingsManager.getContinueOnTabRemoved()),

		startReactor("service:settings:setContinueOnTabRemoved", async (_action, continueOnTabRemoved: boolean) => {
			await settingsManager.setContinueOnTabRemoved(continueOnTabRemoved);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:settings:getContinueOnTabUpdatedUrl", async () => settingsManager.getContinueOnTabUpdatedUrl()),

		startReactor("service:settings:setContinueOnTabUpdatedUrl", async (_action, continueOnTabUpdatedUrl: boolean) => {
			await settingsManager.setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startResponder("service:history:getMostRecentSpeakingEntry", async () => historyManager.getMostRecentSpeakingEntry()),

		startResponder("service:history:getSpeakingHistory", async () => historyManager.getSpeakingHistory()),

		startReactor("service:history:clearSpeakingHistory", async () => {
			await historyManager.clearSpeakingHistory();

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:history:removeSpeakingHistoryEntry", async (_action, hash: number) => {
			await historyManager.removeSpeakingHistoryEntry(hash);

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

		startReactor("service:speaking:speakFromClipboard", async () => {
			await readClipboardManager.checkPermissionAndSpeak();

			return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
		}),

	];
	/* eslint-enable @typescript-eslint/prefer-readonly-parameter-types */

	const u = await Promise.all(t.flat());

	return u.flat();
};

export default createMessageBusListeners;
