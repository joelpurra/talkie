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

import type SelectedTextManager from "@talkie/browser-shared/selected-text-manager.mjs";
import type {
	SelectedTextAndLanguageCodes,
	SelectedTextWithFocusTimestamp,
} from "@talkie/shared-ui/hocs/pass-selected-text-to-background-types.mjs";
import type IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider.mjs";
import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";

import type LanguageHelper from "./language-helper.mjs";
import type SpeakerManager from "./speaker-manager.mjs";
import type Speaker from "./speaker.mjs";
import type SpeakingStatus from "./speaking-status.mjs";

import {
	bespeak,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logDebug,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	type SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	canTalkieRunInTab,
	getCurrentActiveBrowserTabId,
	isCurrentPageInternalToTalkie,
} from "@talkie/split-environment-webextension/browser-specific/tabs.mjs";

export default class SpeakerPageManager {
	notAbleToSpeakTextFromThisSpecialTab: {
		effectiveLanguage: string;
		text: string;
	};

	// eslint-disable-next-line max-params
	constructor(
		private readonly messageBusProviderGetter: IMessageBusProviderGetter,
		private readonly speaker: Speaker,
		private readonly speakerManager: SpeakerManager,
		private readonly languageHelper: LanguageHelper,
		private readonly translator: ITranslatorProvider,
		private readonly internalUrlProvider: IInternalUrlProvider,
		private readonly selectedTextManager: SelectedTextManager,
		private readonly speakingStatus: SpeakingStatus,
	) {
		this.notAbleToSpeakTextFromThisSpecialTab = {
			// eslint-disable-next-line no-sync
			effectiveLanguage: this.translator.translateSync("extensionLocale"),
			// eslint-disable-next-line no-sync
			text: this.translator.translateSync("notAbleToSpeakTextFromThisSpecialTab"),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async detectLanguagesAndSpeakAllSelections(selections: readonly SelectedTextAndLanguageCodes[], detectedPageLanguage: string | null): Promise<void> {
		const allVoices = await bespeak(this.messageBusProviderGetter, "offscreen:synthesizer:getAllSafeVoiceObjects") as SafeVoiceObject[];
		const cleanedupSelections = await this.languageHelper.cleanupSelections(allVoices, detectedPageLanguage, selections);

		await Promise.all(
			cleanedupSelections.map(
				// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
				async (selection) => this.speakerManager.speakTextInLanguage(selection.text, selection.effectiveLanguage),
			),
		);
	}

	public async speakUserSelectionOnExternalPage(tabId: number): Promise<void> {
		const [
			framesSelectionTextAndLanguage,
			detectedPageLanguage,
		] = await Promise.all(
			[
				this.selectedTextManager.getFramesSelectionTextAndLanguage(tabId),
				this.languageHelper.detectPageLanguage(),
			],
		);

		return this.detectLanguagesAndSpeakAllSelections(framesSelectionTextAndLanguage, detectedPageLanguage);
	}

	public async speakUserSelectionOnCurrentExternalPage(): Promise<void> {
		const tabId = await getCurrentActiveBrowserTabId();

		if (tabId !== null) {
			return this.speakUserSelectionOnExternalPage(tabId);
		}

		void logWarn("speakUserSelectionOnCurrentExternalPage", "Could not retrieve the current tab id.");
	}

	public async speakSelectionOnCurrentPage(): Promise<void> {
		const [
			canRun,
			isInternalPage,
		] = await Promise.all([
			canTalkieRunInTab(),
			isCurrentPageInternalToTalkie(this.internalUrlProvider),
		]);

		// NOTE: can't perform (most) actions if it's not a "normal" tab.
		if (!canRun) {
			void logDebug("speakSelectionOnPage", "Did not detect a normal tab.");

			if (isInternalPage) {
				return this._speakUserSelectionOnCurrentInternalPage();
			}

			void logDebug("speakSelectionOnPage", "Skipping speaking selection.");

			const {
				text,
			} = this.notAbleToSpeakTextFromThisSpecialTab;
			const lang = this.notAbleToSpeakTextFromThisSpecialTab.effectiveLanguage;

			return this.speakerManager.speakTextInLanguage(text, lang);
		}

		return this.speakUserSelectionOnCurrentExternalPage();
	}

	public async startStopSpeakSelectionOnPage(): Promise<void> {
		const wasSpeaking = await this.speakingStatus.isSpeaking();

		await this.speaker.stopSpeaking();

		if (!wasSpeaking) {
			await this.speakSelectionOnCurrentPage();
		}
	}

	public async startSpeakingCustomTextDetectLanguage(text: string): Promise<void> {
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

		return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
	}

	private async _getMostRecentSelectedTextFromInternalPages(): Promise<SelectedTextWithFocusTimestamp | null> {
		const eventData = null;

		// NOTE: only being able receiving a single message bus response has different per-browser workarounds and effects.
		// - chrome: attempts to delay the text selection response of each internal page, based on mostRecentUse. This increases the chance that the most recently used page sends the first response, which is what chrome will use, and thus "wins the race".
		// - firefox/webextensions: all internal pages respond, and the message bus wrappers consistently picks the first "defined" (all selected text responses are "defined") and returns the response. This generic solution does not know about mostRecentUse. The first internal page which was opened, and thus registered the "oldest" selected text message handler, will always "win".
		// TODO: once again attempt to handle an array of per-frame selected texts?
		const selectedTextFromFrontend: SelectedTextWithFocusTimestamp | null
			= (await bespeak(this.messageBusProviderGetter, "dom:internal:passSelectedTextToBackground", eventData)) as SelectedTextWithFocusTimestamp | null;
		void logDebug("speakSelectionOnPage", "Received a single text selection from internal pages.", selectedTextFromFrontend);

		return selectedTextFromFrontend;
	}

	private async _speakUserSelectionOnCurrentInternalPage(): Promise<void> {
		void logDebug("speakSelectionOnPage", "Requesting text selection from internal page.");

		const selectedTextFromFrontend = await this._getMostRecentSelectedTextFromInternalPages();

		if (!selectedTextFromFrontend) {
			void logDebug("speakSelectionOnPage", "Did not receive text selection from internal page, doing nothing.");

			return;
		}

		const selections = [
			selectedTextFromFrontend.selectionTextAndLanguageCode,
		];

		// NOTE: assumes that internal pages have at least proper <html lang=""> attributes.
		const detectedPageLanguage = null;

		return this.detectLanguagesAndSpeakAllSelections(selections, detectedPageLanguage);
	}
}
