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
	flatten,
} from "../shared/basic";
import {
	knownEvents,
} from "../shared/events";
import {
	logDebug,
	logError,
	logInfo,
} from "../shared/log";
import {
	promiseSeries,
	promiseTimeout,
} from "../shared/promise";
import {
	pitchRange,
	rateRange,
	resolveVoice,
} from "../shared/voices";
import TextHelper from "./text-helper";

export default class TalkieSpeaker {
	// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section
	// https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#examples-synthesis
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#Speech_synthesis
	constructor(broadcaster, shouldContinueSpeakingProvider, contentLogger, settingsManager) {
		this.broadcaster = broadcaster;
		this.shouldContinueSpeakingProvider = shouldContinueSpeakingProvider;
		this.contentLogger = contentLogger;
		this.settingsManager = settingsManager;

		this.resetSynthesizer();

		this.MAX_UTTERANCE_TEXT_LENGTH = 100;
	}

	static _asyncSynthesizerInitialization() {
		// NOTE: wraps the browser's speech synthesizer events to figure out when it is ready.
		return new Promise(
			(resolve, reject) => {
				const handleVoicesChanged = () => {
					window.speechSynthesis.removeEventListener("error", handleError);
					window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);

					logDebug("Variable", "window.speechSynthesis", window.speechSynthesis);

					logDebug("Done", "getSynthesizerFromBrowser (event-based)");

					return resolve();
				};

				const handleError = (event) => {
					window.speechSynthesis.removeEventListener("error", handleError);
					window.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);

					logError("getSynthesizerFromBrowser", event);

					return reject(event.error);
				};

				try {
					logDebug("Start", "getSynthesizerFromBrowser (event-based)");

					// NOTE: Chrome needs to wait for the onvoiceschanged event before using the synthesizer.
					window.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
					window.speechSynthesis.addEventListener("error", handleError);
				} catch (error) {
					logError("getSynthesizerFromBrowser", error);

					reject(error);
				}
			},
		);
	}

	async getSynthesizerFromBrowser() {
		logDebug("Start", "getSynthesizerFromBrowser", "Pre-requisites check");

		if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function" || typeof window.speechSynthesis.speak !== "function") {
			throw new Error("The browser does not support speechSynthesis.");
		}

		if (!("SpeechSynthesisUtterance" in window)) {
			throw new Error("The browser does not support SpeechSynthesisUtterance.");
		}

		logDebug("Done", "getSynthesizerFromBrowser", "Pre-requisites check");

		logDebug("Start", "getSynthesizerFromBrowser");

		// NOTE: the speech synthesizer can only be used in Chrome after the voices have been loaded.
		// https://github.com/mdn/web-speech-api/blob/gh-pages/speak-easy-synthesis/script.js#L33-L36
		// NOTE: The synthesizer will work right away in Firefox.
		const preloadedVoices = window.speechSynthesis.getVoices();

		if (Array.isArray(preloadedVoices) && preloadedVoices.length > 0) {
			logDebug("Done", "getSynthesizerFromBrowser (direct)");

			return window.speechSynthesis;
		}

		try {
			await promiseTimeout(TalkieSpeaker._asyncSynthesizerInitialization(), 1000);
		} catch (error) {
			// TODO: remove the specific listeners previously registered.
			if (error && error.name === "PromiseTimeout") {
				// NOTE: assume the synthesizer has somehow been initialized without triggering the onvoiceschanged event and continue.
				logDebug("Done", "getSynthesizerFromBrowser (timeout)", "_asyncSynthesizerInitialization", error);
			} else {
				logError("getSynthesizerFromBrowser", "_asyncSynthesizerInitialization", error);

				throw error;
			}
		}

		// NOTE: only for logging purposes.
		const voices = window.speechSynthesis.getVoices();

		logDebug("Variable", "getSynthesizerFromBrowser", "voices[]", voices.length, voices);

		return window.speechSynthesis;
	}

	async resetSynthesizer() {
		delete this.cachedSynthesizer;
		this.cachedSynthesizer = null;
	}

	async getSynthesizer() {
		// TODO: measure impact of caching versus always fetching from the browser.
		if (this.cachedSynthesizer !== null) {
			return this.cachedSynthesizer;
		}

		const synthesizer = await this.getSynthesizerFromBrowser();

		this.cachedSynthesizer = synthesizer;

		return this.cachedSynthesizer;
	}

	async getAllVoices() {
		const synthesizer = await this.getSynthesizer();

		return synthesizer.getVoices();
	}

	async stopSpeaking() {
		logDebug("Start", "stopSpeaking");

		const synthesizer = await this.getSynthesizer();

		const eventData = {};

		await this.broadcaster.broadcastEvent(knownEvents.stopSpeaking, eventData);

		synthesizer.cancel();

		// NOTE: reset the system to resume playback, just to be nice to the world.
		synthesizer.resume();

		logDebug("Done", "stopSpeaking");
	}

	async speakPartOfText(utterance) {
		const synthesizer = await this.getSynthesizer();

		// NOTE: wraps the browser's speech synthesizer events to track progress.
		return new Promise(
			(resolve, reject) => {
				const handleEnd = (event) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleEnd);

					logDebug("End", "speakPartOfText", `Speak text part (length ${utterance.text.length}) spoken in ${event.elapsedTime} milliseconds.`);

					return resolve();
				};

				const handleError = (event) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleEnd);

					logError("speakPartOfText", `Speak text part (length ${utterance.text.length})`, event);

					return reject(event.error);
				};

				try {
					logDebug("Start", "speakPartOfText", `Speak text part (length ${utterance.text.length}): "${utterance.text}"`);

					utterance.addEventListener("end", handleEnd);
					utterance.addEventListener("error", handleError);

					// The actual act of speaking the text.
					synthesizer.speak(utterance);

					// NOTE: pause/resume suggested (for longer texts) in Chrome bug reports, trying it for shorter texts as well.
					// https://bugs.chromium.org/p/chromium/issues/detail?id=335907
					// https://bugs.chromium.org/p/chromium/issues/detail?id=369472
					synthesizer.pause();
					synthesizer.resume();

					logDebug("Variable", "synthesizer", synthesizer);

					logDebug("Done", "speakPartOfText", `Speak text part (length ${utterance.text.length})`);
				} catch (error) {
					reject(error);
				}
			},
		);
	}

	async getActualVoice(mappedVoice) {
		try {
			logDebug("Start", "getActualVoice", mappedVoice);

			const actualVoice = await resolveVoice(mappedVoice);

			logDebug("Done", "getActualVoice", mappedVoice, actualVoice);

			return actualVoice;
		} catch (error) {
			logError("getActualVoice", mappedVoice, error);

			throw error;
		}
	}

	async splitAndSpeak(text, voice) {
		logDebug("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

		const speakingEventData = {
			language: voice.lang,
			text,
			voice: voice.name,
		};

		await this.broadcaster.broadcastEvent(knownEvents.beforeSpeaking, speakingEventData);

		// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
		delete window.talkieUtterance;

		const [
			actualVoice,
			speakLongTexts,
		] = await Promise.all([
			this.getActualVoice(voice),
			this.settingsManager.getSpeakLongTexts(),
		]);

		const paragraphs = TextHelper.splitTextToParagraphs(text);

		let textParts = null;

		if (speakLongTexts === true) {
			textParts = paragraphs;
		} else {
			const cleanTextParts = paragraphs.map((paragraph) => TextHelper.splitTextToSentencesOfMaxLength(paragraph, this.MAX_UTTERANCE_TEXT_LENGTH));
			textParts = flatten(cleanTextParts);
		}

		logDebug("Variable", "textParts.length", textParts.length);

		const shouldContinueSpeaking = this.shouldContinueSpeakingProvider.getShouldContinueSpeakingProvider();

		// TODO: switch to bluebird for async/promise mapping, also for the browser?
		const textPartsPromises = textParts
			.map((textPart) => async () => {
				const speakingPartEventData = {
					language: voice.lang,
					textPart,
					voice: voice.name,
				};

				const continueSpeaking = await shouldContinueSpeaking();

				if (continueSpeaking) {
					await this.broadcaster.broadcastEvent(knownEvents.beforeSpeakingPart, speakingPartEventData);

					const utterance = new window.SpeechSynthesisUtterance(textPart);

					utterance.voice = actualVoice;
					utterance.rate = voice.rate || rateRange.default;
					utterance.pitch = voice.pitch || pitchRange.default;

					logDebug("Variable", "utterance", utterance);

					// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
					window.talkieUtterance = utterance;
					await this.speakPartOfText(utterance);
					await this.broadcaster.broadcastEvent(knownEvents.afterSpeakingPart, speakingPartEventData);
				}
			});

		await promiseSeries(textPartsPromises);

		// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
		delete window.talkieUtterance;

		await this.broadcaster.broadcastEvent(knownEvents.afterSpeaking, speakingEventData);
	}

	async speakTextInVoice(text, voice) {
		try {
			await this.contentLogger.logToPage(`Speaking text (length ${text.length}, ${voice.name}, ${voice.lang}): ${text}`);
		} catch (error) {
			// NOTE: swallowing any logToPage() errors.
			// NOTE: reduced logging for known tab/page access problems.
			if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
				logDebug("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
			} else {
				logInfo("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
			}
		}

		await this.splitAndSpeak(text, voice);

		logDebug("Done", "speakTextInVoice", `Speak text (length ${text.length}, ${voice.name}, ${voice.lang})`);
	}

	async speakTextInLanguage(text, language) {
		const voice = {
			lang: language,
			name: null,
		};

		await this.speakTextInVoice(text, voice);

		logDebug("Done", "speakTextInLanguage", `Speak text (length ${text.length}, ${language})`);
	}
}
