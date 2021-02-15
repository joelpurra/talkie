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

import {
	shallowCopy,
} from "../shared/basic";
import {
	knownEvents,
} from "../shared/events";
import {
	logDebug,
	logError,
} from "../shared/log";
import {
	canTalkieRunInTab,
	isCurrentPageInternalToTalkie,
} from "../shared/tabs";
import {
	getVoices,
} from "../shared/voices";

export default class TalkieBackground {
	// eslint-disable-next-line max-params
	constructor(speechChain, broadcaster, talkieSpeaker, speakingStatus, voiceManager, languageHelper, configuration, execute, translator, internalUrlProvider) {
		this.speechChain = speechChain;
		this.broadcaster = broadcaster;
		this.talkieSpeaker = talkieSpeaker;
		this.speakingStatus = speakingStatus;
		this.voiceManager = voiceManager;
		this.languageHelper = languageHelper;
		this.configuration = configuration;
		this.execute = execute;
		this.translator = translator;
		this.internalUrlProvider = internalUrlProvider;

		this.notAbleToSpeakTextFromThisSpecialTab = {
			effectiveLanguage: this.translator.translate("extensionLocale"),
			text: this.translator.translate("notAbleToSpeakTextFromThisSpecialTab"),
		};

		// NOTE: duplicated elsewhere in the codebase.
		this.executeGetFramesSelectionTextAndLanguageCode = `
			(function() {
				try {
					function talkieGetParentElementLanguages(element) {
						return []
							.concat((element || null) && element.getAttribute && element.getAttribute("lang"))
							.concat((element || null) && element.parentElement && talkieGetParentElementLanguages(element.parentElement));
					};

					var talkieSelectionData = {
						text: ((document || null) && (document.getSelection || null) && (document.getSelection() || null) && document.getSelection().toString()),
						htmlTagLanguage: ((document || null) && (document.getElementsByTagName || null) && (document.getElementsByTagName("html") || null) && (document.getElementsByTagName("html").length > 0 || null) && (document.getElementsByTagName("html")[0].getAttribute("lang") || null)),
						parentElementsLanguages: (talkieGetParentElementLanguages((document || null) && (document.getSelection || null) && (document.getSelection() || null) && (document.getSelection().rangeCount > 0 || null) && (document.getSelection().getRangeAt || null) && (document.getSelection().getRangeAt(0) || null) && (document.getSelection().getRangeAt(0).startContainer || null))),
					};

					return talkieSelectionData;
				} catch (error) {
					return null;
				}
			}());`
			.replace(/\n/g, "")
			.replace(/\s{2,}/g, " ");
	}

	async speakSelectionOnPage() {
		const [
			canRun,
			isInternalPage,
		] = await Promise.all([
			canTalkieRunInTab(),
			isCurrentPageInternalToTalkie(this.internalUrlProvider),
		]);

		// NOTE: can't perform (most) actions if it's not a "normal" tab.
		if (!canRun) {
			logDebug("iconClickAction", "Did not detect a normal tab.");

			if (isInternalPage) {
				logDebug("iconClickAction", "Requesting text selection from internal page.");

				const eventData = null;

				const selectedTextsFromFrontend = await this.broadcaster.broadcastEvent(knownEvents.passSelectedTextToBackground, eventData);

				logDebug("iconClickAction", "Received text selections from internal pages.", selectedTextsFromFrontend);

				const filteredSelectedTextsFromFrontend = selectedTextsFromFrontend
					.filter((selectedTextWithFocusTimestamp) => selectedTextWithFocusTimestamp !== null);

				const selectedTextFromFrontend = filteredSelectedTextsFromFrontend
				// eslint-disable-next-line unicorn/no-reduce
					.reduce(
						(previous, selectedTextWithFocusTimestamp) => {
							if (previous === null || previous.mostRecentUse < selectedTextWithFocusTimestamp.mostRecentUse) {
								return selectedTextWithFocusTimestamp;
							}

							return previous;
						},
						null,
					);

				if (selectedTextFromFrontend === null) {
					logDebug("iconClickAction", "Did not receive text selection from internal page, doing nothing.");

					return;
				}

				const selections = [
					selectedTextFromFrontend.selectionTextAndLanguageCode,
				];

				// NOTE: assumes that internal pages have at least proper <html lang=""> attributes.
				const detectedPageLanguage = null;

				return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
			}

			logDebug("iconClickAction", "Skipping speaking selection.");

			const text = this.notAbleToSpeakTextFromThisSpecialTab.text;
			const lang = this.notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage;

			return this.startSpeakingTextInLanguageWithOverridesAction(text, lang);
		}

		return this.speakUserSelection();
	}

	async startStopSpeakSelectionOnPage() {
		const wasSpeaking = await this.speakingStatus.isSpeaking();
		await this.talkieSpeaker.stopSpeaking();

		if (!wasSpeaking) {
			return this.speakSelectionOnPage();
		}
	}

	async stopSpeakingAction() {
		return this.talkieSpeaker.stopSpeaking();
	}

	async startSpeakingTextInVoiceAction(text, voice) {
		await this.talkieSpeaker.stopSpeaking();

		// NOTE: keeping the root chain separate from this chain.
		this.speechChain.link(() => this.talkieSpeaker.speakTextInVoice(text, voice))
			.catch((error) => {
				logError("Caught error on the speechChain. Swallowing. Resetting synthesizer just in case.", error);

				// TODO: handle internally in talkieSpeaker?
				return this.talkieSpeaker.resetSynthesizer();
			});
	}

	async addRateAndPitchToSpecificVoice(voice) {
		const [
			effectiveRateForVoice,
			effectivePitchForVoice,
		] = await Promise.all([
			this.voiceManager.getEffectiveRateForVoice(voice.name),
			this.voiceManager.getEffectivePitchForVoice(voice.name),
		]);

		const voiceWithPitchAndRate = shallowCopy(
			voice,
			{
				pitch: effectivePitchForVoice,
				rate: effectiveRateForVoice,
			},
		);

		return voiceWithPitchAndRate;
	}

	async startSpeakingTextInVoiceWithOverridesAction(text, voice) {
		const voiceWithPitchAndRate = await this.addRateAndPitchToSpecificVoice(voice);

		return this.startSpeakingTextInVoiceAction(text, voiceWithPitchAndRate);
	}

	async startSpeakingTextInLanguageAction(text, language) {
		await this.talkieSpeaker.stopSpeaking();

		// NOTE: keeping the root chain separate from this chain.
		this.speechChain.link(() => this.talkieSpeaker.speakTextInLanguage(text, language))
			.catch((error) => {
				logError("Caught error on the speechChain. Swallowing. Resetting synthesizer just in case.", error);

				// TODO: handle internally in talkieSpeaker?
				return this.talkieSpeaker.resetSynthesizer();
			});
	}

	async startSpeakingTextInLanguageWithOverridesAction(text, language) {
		const effectiveVoiceForLanguage = await this.voiceManager.getEffectiveVoiceForLanguage(language);

		return this.startSpeakingTextInVoiceWithOverridesAction(text, effectiveVoiceForLanguage);
	}

	async startSpeakingCustomTextDetectLanguage(text) {
		await this.talkieSpeaker.stopSpeaking();
		const canRun = await canTalkieRunInTab();

		let detectedPageLanguage = null;

		if (canRun) {
			detectedPageLanguage = await this.languageHelper.detectPageLanguage();
		} else {
			logDebug("startSpeakingCustomTextDetectLanguage", "Did not detect a normal tab.", "Skipping page language detection.");
		}

		const selections = [
			{
				htmlTagLanguage: null,
				parentElementsLanguages: [],
				text,
			},
		];

		return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
	}

	async onTabRemovedHandler(tabId) {
		const isTabSpeaking = await this.speakingStatus.isSpeakingTabId(tabId);

		if (isTabSpeaking) {
			await this.talkieSpeaker.stopSpeaking();
		}
	}

	async onTabUpdatedHandler(tabId, changeInfo) {
		const isTabSpeaking = await this.speakingStatus.isSpeakingTabId(tabId);

		// NOTE: changeInfo only has properties which have changed.
		// https://developer.browser.com/extensions/tabs#event-onUpdated
		if (isTabSpeaking && changeInfo.url) {
			await this.talkieSpeaker.stopSpeaking();
		}
	}

	async onExtensionSuspendHandler() {
		logDebug("Start", "onExtensionSuspendHandler");

		const talkieIsSpeaking = await this.speakingStatus.isSpeaking();

		// NOTE: Clear all text if Talkie was speaking.
		if (talkieIsSpeaking) {
			await this.talkieSpeaker.stopSpeaking();
		}

		logDebug("Done", "onExtensionSuspendHandler");
	}

	async executeGetFramesSelectionTextAndLanguage() {
		const framesSelectionTextAndLanguage = await this.execute.scriptInAllFramesWithTimeout(this.executeGetFramesSelectionTextAndLanguageCode, 1000);

		logDebug("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

		if (!framesSelectionTextAndLanguage || !Array.isArray(framesSelectionTextAndLanguage)) {
			throw new Error("framesSelectionTextAndLanguage");
		}

		return framesSelectionTextAndLanguage;
	}

	async detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage) {
		logDebug("Start", "Speaking all selections");

		logDebug("Variable", `selections (length ${(selections && selections.length) || 0})`, selections);

		const allVoices = await getVoices();
		const cleanedupSelections = await this.languageHelper.cleanupSelections(allVoices, detectedPageLanguage, selections);

		logDebug("Variable", `cleanedupSelections (length ${(cleanedupSelections && cleanedupSelections.length) || 0})`, cleanedupSelections);

		// TODO: switch to bluebird for async/promise mapping, also for the browser?
		const speakPromises = cleanedupSelections.map((selection) => (async () => {
			logDebug("Text", `Speaking selection (length ${selection.text.length}, effectiveLanguage ${selection.effectiveLanguage})`, selection);

			return this.startSpeakingTextInLanguageWithOverridesAction(selection.text, selection.effectiveLanguage);
		})());

		logDebug("Done", "Speaking all selections");

		return Promise.all(speakPromises);
	}

	async speakUserSelection() {
		logDebug("Start", "Speaking selection");

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

		logDebug("Done", "Speaking selection");
	}
}
