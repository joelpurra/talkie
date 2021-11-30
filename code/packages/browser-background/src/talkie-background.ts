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

import Execute from "@talkie/browser-shared/execute";
import Broadcaster from "@talkie/shared-application/broadcaster";
import {
	FramesSelectionTextAndLanguageCode,
	SelectedTextWithFocusTimestamp,
} from "@talkie/shared-application/hocs/pass-selected-text-to-background-types";
import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log";
import IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider";
import {
	IVoiceName,
	IVoiceNameAndRateAndPitch,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import {
	knownEvents,
} from "@talkie/split-environment-interfaces/moved-here/known-events";
import {
	canTalkieRunInTab,
	isCurrentPageInternalToTalkie,
} from "@talkie/split-environment-webextension/browser-specific/tabs";
import {
	ReadonlyDeep,
} from "type-fest";
import {
	Tabs,
} from "webextension-polyfill";

import LanguageHelper from "./language-helper";
import NonBreakingChain from "./non-breaking-chain";
import SpeakingStatus from "./speaking-status";
import TalkieSpeaker from "./talkie-speaker";
import VoiceManager from "./voice-manager";

export default class TalkieBackground {
	notAbleToSpeakTextFromThisSpecialTab: {
		effectiveLanguage: string;
		text: string;
	};

	executeGetFramesSelectionTextAndLanguageCode: string;

	// eslint-disable-next-line max-params
	constructor(private readonly speechChain: NonBreakingChain, private readonly broadcaster: Broadcaster, private readonly talkieSpeaker: TalkieSpeaker, private readonly speakingStatus: SpeakingStatus, private readonly voiceManager: VoiceManager, private readonly languageHelper: LanguageHelper, private readonly execute: Execute, private readonly translator: ITranslatorProvider, private readonly internalUrlProvider: IInternalUrlProvider) {
		this.notAbleToSpeakTextFromThisSpecialTab = {
			// eslint-disable-next-line no-sync
			effectiveLanguage: this.translator.translateSync("extensionLocale"),
			// eslint-disable-next-line no-sync
			text: this.translator.translateSync("notAbleToSpeakTextFromThisSpecialTab"),
		};

		// NOTE: duplicated elsewhere in the codebase.
		this.executeGetFramesSelectionTextAndLanguageCode = `
			(function() {
				try {
					function talkieGetParentElementLanguages(element) {
						return []
							.concat((element || null) && element && element.getAttribute && element.getAttribute("lang"))
							.concat((element || null) && element && element.parentElement && talkieGetParentElementLanguages(element.parentElement));
					};

					var talkieSelectionData = {
						text: ((document || null) && document && (document.getSelection || null) && (document.getSelection() || null) && document.getSelection().toString()) || null,
						htmlTagLanguage: ((document || null) && document && (document.getElementsByTagName || null) && (document.getElementsByTagName("html") || null) && (document.getElementsByTagName("html").length > 0 || null) && (document.getElementsByTagName("html")[0].getAttribute("lang") || null)) || null,
						parentElementsLanguages: (talkieGetParentElementLanguages((document || null) && document && (document.getSelection || null) && (document.getSelection() || null) && (document.getSelection().rangeCount > 0 || null) && (document.getSelection().getRangeAt || null) && (document.getSelection().getRangeAt(0) || null) && (document.getSelection().getRangeAt(0).startContainer || null))) || null,
					};

					return talkieSelectionData;
				} catch(error) {
					try {
						console.warn("Error while getting the selected text from page, swallowing error.", error);
					} catch {}

					return null;
				}
			}());`
			.replace(/\n/g, "")
			.replace(/\s{2,}/g, " ");
	}

	async speakSelectionOnPage(): Promise<void> {
		const [
			canRun,
			isInternalPage,
		] = await Promise.all([
			canTalkieRunInTab(),
			isCurrentPageInternalToTalkie(this.internalUrlProvider),
		]);

		// NOTE: can't perform (most) actions if it's not a "normal" tab.
		if (!canRun) {
			void logDebug("iconClickAction", "Did not detect a normal tab.");

			if (isInternalPage) {
				void logDebug("iconClickAction", "Requesting text selection from internal page.");

				const eventData = null;

				const selectedTextsFromFrontend = await this.broadcaster.broadcastEvent<knownEvents.passSelectedTextToBackground, null, ReadonlyDeep<SelectedTextWithFocusTimestamp> | null>(knownEvents.passSelectedTextToBackground, eventData);

				void logDebug("iconClickAction", "Received text selections from internal pages.", selectedTextsFromFrontend);

				const filteredSelectedTextsFromFrontend = selectedTextsFromFrontend
					.filter((t): t is ReadonlyDeep<NonNullable<SelectedTextWithFocusTimestamp>> => Boolean(t));

				const selectedTextFromFrontend = filteredSelectedTextsFromFrontend
					// eslint-disable-next-line unicorn/no-array-reduce
					.reduce<ReadonlyDeep<SelectedTextWithFocusTimestamp> | null>(
					(previous, selectedTextWithFocusTimestamp) => {
						// NOTE: first take the first available internal page.
						if (previous === null) {
							return selectedTextWithFocusTimestamp;
						}

						// NOTE: keep the most recently used (focused) internal page, and assume it's the one the selected text should be read from.
						if (previous.mostRecentUse < selectedTextWithFocusTimestamp.mostRecentUse) {
							return selectedTextWithFocusTimestamp;
						}

						return previous;
					},
					null,
				);

				if (selectedTextFromFrontend === null) {
					void logDebug("iconClickAction", "Did not receive text selection from internal page, doing nothing.");

					return;
				}

				const selections = [
					selectedTextFromFrontend.selectionTextAndLanguageCode,
				];

				// NOTE: assumes that internal pages have at least proper <html lang=""> attributes.
				const detectedPageLanguage = null;

				return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
			}

			void logDebug("iconClickAction", "Skipping speaking selection.");

			const text = this.notAbleToSpeakTextFromThisSpecialTab.text;
			const lang = this.notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage;

			return this.startSpeakingTextInLanguageWithOverridesAction(text, lang);
		}

		return this.speakUserSelection();
	}

	async startStopSpeakSelectionOnPage(): Promise<void> {
		const wasSpeaking = await this.speakingStatus.isSpeaking();
		await this.talkieSpeaker.stopSpeaking();

		if (!wasSpeaking) {
			await this.speakSelectionOnPage();
		}
	}

	async stopSpeakingAction(): Promise<void> {
		await this.talkieSpeaker.stopSpeaking();
	}

	async startSpeakingTextInVoiceAction(text: string, voice: Readonly<IVoiceNameAndRateAndPitch>): Promise<void> {
		const createSpeech = async () => this.talkieSpeaker.speakTextInVoice(text, voice);

		await this._enqueueSpeech(createSpeech);
	}

	async addRateAndPitchToSpecificVoice(voice: ReadonlyDeep<IVoiceName>): Promise<IVoiceNameAndRateAndPitch> {
		const [
			effectiveRateForVoice,
			effectivePitchForVoice,
		] = await Promise.all([
			this.voiceManager.getEffectiveRateForVoice(voice.name),
			this.voiceManager.getEffectivePitchForVoice(voice.name),
		]);

		const voiceWithPitchAndRate: IVoiceNameAndRateAndPitch = {
			...voice,
			pitch: effectivePitchForVoice,
			rate: effectiveRateForVoice,
		};

		return voiceWithPitchAndRate;
	}

	async startSpeakingTextInVoiceWithOverridesAction(text: string, voiceName: string): Promise<void> {
		const voice: IVoiceName = {
			name: voiceName,
		};
		const voiceWithPitchAndRate = await this.addRateAndPitchToSpecificVoice(voice);

		return this.startSpeakingTextInVoiceAction(text, voiceWithPitchAndRate);
	}

	async startSpeakingTextInLanguageWithOverridesAction(text: string, language: string): Promise<void> {
		const effectiveVoiceForLanguage = await this.voiceManager.getEffectiveVoiceForLanguage(language);

		if (!effectiveVoiceForLanguage) {
			throw new Error(`Could not get effective voice for language: ${JSON.stringify(language)}`);
		}

		return this.startSpeakingTextInVoiceWithOverridesAction(text, effectiveVoiceForLanguage.name);
	}

	async startSpeakingCustomTextDetectLanguage(text: string): Promise<void> {
		await this.talkieSpeaker.stopSpeaking();
		const canRun = await canTalkieRunInTab();

		let detectedPageLanguage = null;

		if (canRun) {
			detectedPageLanguage = await this.languageHelper.detectPageLanguage();
		} else {
			void logDebug("startSpeakingCustomTextDetectLanguage", "Did not detect a normal tab.", "Skipping page language detection.");
		}

		const selections = [
			{
				htmlTagLanguage: null,
				parentElementsLanguages: [],
				text,
			},
		];

		await this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
	}

	async onTabRemovedHandler(tabId: number, _removeInfo: Readonly<Tabs.OnRemovedRemoveInfoType>): Promise<void> {
		const isTabSpeaking = await this.speakingStatus.isSpeakingTabId(tabId);

		if (isTabSpeaking) {
			// TODO: user preference whether or not to stop speaking when a tab is removed/closed/updated.
			await this.talkieSpeaker.stopSpeaking();
		}
	}

	async onTabUpdatedHandler(tabId: number, changeInfo: ReadonlyDeep<Tabs.OnUpdatedChangeInfoType>): Promise<void> {
		const isTabSpeaking = await this.speakingStatus.isSpeakingTabId(tabId);

		// NOTE: changeInfo only has properties which have changed.
		// https://developer.chrome.com/extensions/tabs#event-onUpdated
		if (isTabSpeaking && changeInfo.url) {
			// TODO: user preference whether or not to stop speaking when a tab is removed/closed/updated.
			await this.talkieSpeaker.stopSpeaking();
		}
	}

	async onExtensionSuspendHandler(): Promise<void> {
		void logDebug("Start", "onExtensionSuspendHandler");

		const talkieIsSpeaking = await this.speakingStatus.isSpeaking();

		// NOTE: Clear all text if Talkie was speaking.
		if (talkieIsSpeaking) {
			await this.talkieSpeaker.stopSpeaking();
		}

		void logDebug("Done", "onExtensionSuspendHandler");
	}

	async executeGetFramesSelectionTextAndLanguage(): Promise<FramesSelectionTextAndLanguageCode[]> {
		const framesSelectionTextAndLanguage: Array<FramesSelectionTextAndLanguageCode | null> = await this.execute.scriptInAllFramesWithTimeout<FramesSelectionTextAndLanguageCode | null>(this.executeGetFramesSelectionTextAndLanguageCode, 1000);

		void logDebug("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

		if (!framesSelectionTextAndLanguage || !Array.isArray(framesSelectionTextAndLanguage)) {
			throw new Error("framesSelectionTextAndLanguage");
		}

		const nonEmptyFramesSelectionTextAndLanguage = framesSelectionTextAndLanguage
			.filter((t): t is NonNullable<FramesSelectionTextAndLanguageCode> => Boolean(t));

		return nonEmptyFramesSelectionTextAndLanguage;
	}

	async detectLanguagesAndSpeakAllSelections(selections: ReadonlyDeep<FramesSelectionTextAndLanguageCode[]>, detectedPageLanguage: string | null): Promise<void> {
		void logDebug("Start", "Speaking all selections");

		void logDebug("Variable", `selections (length ${(selections?.length) || 0})`, selections);

		const allVoices = await this.talkieSpeaker.getAllVoicesSafeObjects();
		const cleanedupSelections = await this.languageHelper.cleanupSelections(allVoices, detectedPageLanguage, selections);

		void logDebug("Variable", `cleanedupSelections (length ${(cleanedupSelections?.length) || 0})`, cleanedupSelections);

		await Promise.all(
			cleanedupSelections.map(
				async (selection) => {
					void logDebug("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

					return this.startSpeakingTextInLanguageWithOverridesAction(selection.text, selection.effectiveLanguage);
				},
			),
		);

		void logDebug("Done", "Speaking all selections");
	}

	async speakUserSelection(): Promise<void> {
		void logDebug("Start", "Speaking selection");

		const [
			framesSelectionTextAndLanguage,
			detectedPageLanguage,
		] = await Promise.all(
			[
				this.executeGetFramesSelectionTextAndLanguage(),
				this.languageHelper.detectPageLanguage(),
			],
		);

		await this.detectLanguagesAndSpeakAllSelections(framesSelectionTextAndLanguage, detectedPageLanguage);

		void logDebug("Done", "Speaking selection");
	}

	private async _enqueueSpeech(createSpeech: () => Promise<void>): Promise<void> {
		await this.talkieSpeaker.stopSpeaking();

		await this.speechChain.link(createSpeech)
			.catch(async (error) => {
				// NOTE: chain should be non-breaking, this _should_ never happen.
				void logError("Caught error on the speechChain. Swallowing. Resetting synthesizer just in case.", error);

				// TODO: handle internally in talkieSpeaker?
				return this.talkieSpeaker.resetSynthesizer();
			});
	}
}
