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

import ContentLogger from "@talkie/browser-shared/content-logger";
import Broadcaster from "@talkie/shared-application/broadcaster";
import SettingsManager from "@talkie/shared-application/settings-manager";
import {
	flatten,
	jsonClone,
} from "@talkie/shared-application-helpers/basic";
import {
	logDebug,
	logError,
	logInfo,
} from "@talkie/shared-application-helpers/log";
import {
	isPromiseTimeout,
	promiseFunctionSeries,
	promiseTimeout,
} from "@talkie/shared-application-helpers/promise";
import {
	IVoiceLanguage,
	IVoiceName,
	IVoiceNameAndRateAndPitch,
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import {
	knownEvents,
} from "@talkie/split-environment-interfaces/moved-here/known-events";
import {
	ReadonlyDeep,
} from "type-fest";

import OnlyLastCaller from "./only-last-caller";
import {
	createSafeVoiceObjectFromSpeechSynthesisVoice,
	resolveDefaultVoiceFromLanguage,
	resolveVoice,
	resolveVoiceFromName,
} from "./talkie-speaker-helpers";
import TextHelper from "./text-helper";

declare global{
	interface Window {
		talkieUtterance?: SpeechSynthesisUtterance;
	}
}

// TODO: merge SpeakingEventData and SpeakingEventPartData?
export type SpeakingEventData = {
	language: string | null;
	text: string;
	voice: string | null;
};

export type SpeakingEventPartData = {
	textPart: string;
	actualVoice: SpeechSynthesisVoice;
	rate: number;
	pitch: number;
};

export default class TalkieSpeaker {
	MAX_UTTERANCE_TEXT_LENGTH = 100;

	// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
	// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
	constructor(private readonly broadcaster: Broadcaster, private readonly shouldContinueSpeakingProvider: OnlyLastCaller, private readonly contentLogger: ContentLogger, private readonly settingsManager: SettingsManager) {}

	static async _asyncSynthesizerInitialization(): Promise<void> {
		// NOTE: wraps the browser's speech synthesizer events to figure out when it is ready.
		return new Promise<void>(
			// TODO: register listener before first call to getVoices, to prevent race condition by ensuring that the event doesn't happen before listener registration?
			(resolve, reject) => {
				const handleVoicesChanged = () => {
					window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);

					void logDebug("Variable", "window.speechSynthesis", window.speechSynthesis);

					void logDebug("Done", "getSynthesizerFromBrowser (event-based)");

					resolve();
				};

				try {
					void logDebug("Start", "getSynthesizerFromBrowser (event-based)");

					// NOTE: Chrome needs to wait for the onvoiceschanged event before using the synthesizer.
					window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
				} catch (error: unknown) {
					void logError("getSynthesizerFromBrowser", error);

					reject(error);
				}
			},
		);
	}

	async resetSynthesizer(): Promise<void> {
		void logDebug("Start", "resetSynthesizer");

		try {
			const synthesizer = await this.getSynthesizer();

			synthesizer.cancel();

			// NOTE: reset the system to resume playback, just to be nice to the world.
			synthesizer.resume();
		} catch (error: unknown) {
			void logError("resetSynthesizer", "Swallowing synthesizer error.", error);
		}

		void logDebug("Done", "resetSynthesizer");
	}

	async getSynthesizer(): Promise<SpeechSynthesis> {
		const synthesizer = await this._getSynthesizerFromBrowser();

		return synthesizer;
	}

	async getAllVoicesSafeObjects(): Promise<SafeVoiceObject[]> {
		// NOTE: in the TalkieSpeaker class so it (plus the helper functions) is the only one to handle SpeechSynthesisVoice.
		const voices = await this._getAllVoices();

		// NOTE: the SpeechSynthesisVoice object reference cannot be transferred outside of the background page context, need to transform/copy the object properties.
		const copy = voices.map((voice) => createSafeVoiceObjectFromSpeechSynthesisVoice(voice));

		return copy;
	}

	async resolveVoiceSafeObject(voiceName: string): Promise<SafeVoiceObject | null> {
		const voices = await this._getAllVoices();
		const voice = await resolveVoiceFromName(voices, voiceName);

		if (!voice) {
			// TODO: throw instead?
			return null;
		}

		const safeVoiceObject = createSafeVoiceObjectFromSpeechSynthesisVoice(voice);

		return safeVoiceObject;
	}

	async resolveDefaultVoiceSafeObjectForLanguage(language: string): Promise<SafeVoiceObject | null> {
		const voices = await this._getAllVoices();
		const voice = await resolveDefaultVoiceFromLanguage(voices, language);

		if (!voice) {
			// TODO: throw instead?
			return null;
		}

		const safeVoiceObject = createSafeVoiceObjectFromSpeechSynthesisVoice(voice);

		return safeVoiceObject;
	}

	async stopSpeaking(): Promise<void> {
		void logDebug("Start", "stopSpeaking");

		const eventData = {};

		await this.broadcaster.broadcastEvent(knownEvents.stopSpeaking, eventData);
		await this.resetSynthesizer();

		void logDebug("Done", "stopSpeaking");
	}

	async speakTextInVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		const resolvedVoice = await this._resolveSpeechSynthesisVoice({
			name: voice.name,
		});

		await this.speakTextInResolvedVoice(text, resolvedVoice, voice.rate, voice.pitch);
	}

	async _getAllVoices(): Promise<SpeechSynthesisVoice[]> {
		const synthesizer = await this.getSynthesizer();
		const voices = synthesizer.getVoices();

		// TODO: check if there are any voices installed, alert user if not.
		if (!Array.isArray(voices)) {
			// NOTE: the list of voices could still be empty, either due to slow loading (cold cache) or that there actually are no voices loaded.
			throw new TypeError("Could not load list of voices from browser.");
		}

		return voices;
	}

	private async speakPartOfText(utterance: ReadonlyDeep<SpeechSynthesisUtterance>): Promise<void> {
		const synthesizer = await this.getSynthesizer();

		// NOTE: wraps the browser's speech synthesizer events to track progress.
		return new Promise<void>(
			(resolve, reject) => {
				const handleEnd = (event: ReadonlyDeep<SpeechSynthesisEvent>) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleEnd);

					void logDebug("End", "speakPartOfText", `Speak text part (length ${utterance.text.length}) spoken in ${event.elapsedTime} milliseconds.`);

					resolve();
				};

				const handleError = (event: ReadonlyDeep<SpeechSynthesisErrorEvent>) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleEnd);

					void logError("speakPartOfText", `Speak text part (length ${utterance.text.length})`, event);

					reject(event.error);
				};

				try {
					void logDebug("Start", "speakPartOfText", `Speak text part (length ${utterance.text.length}): "${utterance.text}"`);

					utterance.addEventListener("end", handleEnd);
					utterance.addEventListener("error", handleError);

					// The actual act of speaking the text.
					synthesizer.speak(utterance);

					// NOTE: pause/resume suggested (for longer texts) in Chrome bug reports, trying it for shorter texts as well.
					// https://bugs.chromium.org/p/chromium/issues/detail?id=335907
					// https://bugs.chromium.org/p/chromium/issues/detail?id=369472
					synthesizer.pause();
					synthesizer.resume();

					void logDebug("Done", "speakPartOfText", `Speak text part (length ${utterance.text.length})`);
				} catch (error: unknown) {
					reject(error);
				}
			},
		);
	}

	private async splitAndSpeak(text: string, resolvedVoice: SpeechSynthesisVoice, rate: number, pitch: number): Promise<void> {
		void logDebug("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

		const speakingEventData: SpeakingEventData = {
			language: resolvedVoice.lang,
			text,
			voice: resolvedVoice.name,
		};

		// NOTE: trying to avoid sending object references to broadcastEvent.
		const speakingEventDataCopy = jsonClone(speakingEventData);

		await this.broadcaster.broadcastEvent(knownEvents.beforeSpeaking, speakingEventDataCopy);

		// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
		delete window.talkieUtterance;

		const speakLongTexts = await this.settingsManager.getSpeakLongTexts();
		const paragraphs = TextHelper.splitTextToParagraphs(text);

		let textParts: string[] | null = null;

		if (speakLongTexts) {
			textParts = paragraphs;
		} else {
			const cleanTextParts = paragraphs.map((paragraph) => TextHelper.splitTextToSentencesOfMaxLength(paragraph, this.MAX_UTTERANCE_TEXT_LENGTH));
			textParts = flatten<string>(cleanTextParts);
		}

		void logDebug("Variable", "textParts.length", textParts?.length);

		const shouldContinueSpeaking = this.shouldContinueSpeakingProvider.getShouldContinueSpeakingProvider();

		// TODO: generator, yielding text parts?
		const textPartsPromiseFunctions = textParts
			.map(
				(textPart: string) => async () => {
					const speakingPartEventData: SpeakingEventPartData = {
						actualVoice: resolvedVoice,
						pitch,
						rate,
						textPart,
					};

					// NOTE: trying to avoid sending object references to broadcastEvent.
					const speakingPartEventDataCopy = jsonClone({
						...speakingPartEventData,
						actualVoice: createSafeVoiceObjectFromSpeechSynthesisVoice(resolvedVoice),
					});

					// TODO: add a timeout in case the speech synthesizer crashes.
					// Seems to be the case for some voices, such as Fred (English) on macOS.
					const continueSpeaking = await shouldContinueSpeaking();

					if (continueSpeaking) {
						await this.broadcaster.broadcastEvent(knownEvents.beforeSpeakingPart, speakingPartEventDataCopy);

						const utterance = new window.SpeechSynthesisUtterance(textPart);

						utterance.voice = resolvedVoice;
						utterance.rate = rate;
						utterance.pitch = pitch;

						// void logDebug("Variable", "utterance", utterance);

						// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
						window.talkieUtterance = utterance;

						await this.speakPartOfText(utterance);

						// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
						delete window.talkieUtterance;

						await this.broadcaster.broadcastEvent(knownEvents.afterSpeakingPart, speakingPartEventDataCopy);
					}
				},
			);

		try {
			await promiseFunctionSeries(textPartsPromiseFunctions);
		} finally {
			await this.broadcaster.broadcastEvent(knownEvents.afterSpeaking, speakingEventDataCopy);
		}
	}

	private async speakTextInResolvedVoice(text: string, voice: SpeechSynthesisVoice, rate: number, pitch: number): Promise<void> {
		void (async () => {
			// NOTE: logging outside of promise chain.
			try {
				await this.contentLogger.logToPage(`Speaking text (length ${text.length}, ${JSON.stringify(voice.name)}, ${JSON.stringify(voice.lang)}}): ${JSON.stringify(text)}`);
			} catch (error: unknown) {
				// NOTE: swallowing any logToPage() errors.
				// NOTE: reduced logging for known tab/page access problems.
				// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
				if (error && typeof error === "object" && typeof (error as Error).message === "string" && (error as Error).message.startsWith("Cannot access")) {
					void logDebug("speakTextInResolvedVoice", "Error", typeof error, JSON.stringify(error), error);
				} else {
					void logInfo("speakTextInResolvedVoice", "Error", typeof error, JSON.stringify(error), error);
				}
			}
		})();

		await this.splitAndSpeak(text, voice, rate, pitch);

		void logDebug("Done", "speakTextInResolvedVoice", `Speak text (length ${text.length}, ${JSON.stringify(voice.name)}, ${JSON.stringify(voice.lang)}})`);
	}

	private async _resolveSpeechSynthesisVoice<T extends IVoiceName | IVoiceLanguage>(mappedVoice: T): Promise<SpeechSynthesisVoice> {
		const voices = await this._getAllVoices();

		const resolvedVoice = await resolveVoice(voices, mappedVoice);

		if (!resolvedVoice) {
			throw new TypeError("resolvedVoice");
		}

		return resolvedVoice;
	}

	private async _getSynthesizerFromBrowser(): Promise<SpeechSynthesis> {
		void logDebug("Start", "getSynthesizerFromBrowser", "Pre-requisites check");

		if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function" || typeof window.speechSynthesis.speak !== "function") {
			throw new Error("The browser does not support speechSynthesis.");
		}

		if (!("SpeechSynthesisUtterance" in window)) {
			throw new Error("The browser does not support SpeechSynthesisUtterance.");
		}

		void logDebug("Done", "getSynthesizerFromBrowser", "Pre-requisites check");

		void logDebug("Start", "getSynthesizerFromBrowser");

		// NOTE: the speech synthesizer can only be used in Chrome after the voices have been loaded.
		// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
		// NOTE: The synthesizer will work right away in Firefox.
		const preloadedVoices = window.speechSynthesis.getVoices();

		if (Array.isArray(preloadedVoices) && preloadedVoices.length > 0) {
			void logDebug("Done", "getSynthesizerFromBrowser (direct)");

			return window.speechSynthesis;
		}

		try {
			await promiseTimeout(TalkieSpeaker._asyncSynthesizerInitialization(), 1000);
		} catch (error: unknown) {
			// TODO: remove the specific listeners previously registered.
			if (isPromiseTimeout(error)) {
				// NOTE: assume the synthesizer has somehow been initialized without triggering the onvoiceschanged event and continue.
				void logDebug("Done", "getSynthesizerFromBrowser (timeout)", "_asyncSynthesizerInitialization", error);
			} else {
				void logError("getSynthesizerFromBrowser", "_asyncSynthesizerInitialization", error);

				throw error;
			}
		}

		// NOTE: only for logging purposes.
		// const voices = window.speechSynthesis.getVoices();
		//
		// void logDebug("Variable", "getSynthesizerFromBrowser", "voices[]", voices.length, voices);

		return window.speechSynthesis;
	}
}
