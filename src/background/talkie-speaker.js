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
	promiseTry,
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

	getSynthesizerFromBrowser() {
		return promiseTry(
			() => {
				logDebug("Start", "getSynthesizerFromBrowser", "Pre-requisites check");

				if (!("speechSynthesis" in window) || typeof window.speechSynthesis.getVoices !== "function" || typeof window.speechSynthesis.speak !== "function") {
					throw new Error("The browser does not support speechSynthesis.");
				}

				if (!("SpeechSynthesisUtterance" in window)) {
					throw new Error("The browser does not support SpeechSynthesisUtterance.");
				}

				logDebug("Done", "getSynthesizerFromBrowser", "Pre-requisites check");
			})
			.then(() => {
				logDebug("Start", "getSynthesizerFromBrowser");

				// NOTE: the speech synthesizer can only be used in Chrome after the voices have been loaded.
				const synthesizer = window.speechSynthesis;

				// https://github.com/mdn/web-speech-api/blob/gh-pages/speak-easy-synthesis/script.js#L33-L36
				// NOTE: The synthesizer will work right away in Firefox.
				const voices = synthesizer.getVoices();

				if (Array.isArray(voices) && voices.length > 0) {
					logDebug("Done", "getSynthesizerFromBrowser (direct)");

					return synthesizer;
				}

				const asyncSynthesizerInitialization = new Promise(
					(resolve, reject) => {
						try {
							logDebug("Start", "getSynthesizerFromBrowser (event-based)");

							const handleVoicesChanged = () => {
								synthesizer.removeEventListener("error", handleError);
								synthesizer.removeEventListener("voiceschanged", handleVoicesChanged);

								logDebug("Variable", "synthesizer", synthesizer);

								logDebug("Done", "getSynthesizerFromBrowser (event-based)");

								return resolve(synthesizer);
							};

							const handleError = (event) => {
								synthesizer.removeEventListener("error", handleError);
								synthesizer.removeEventListener("voiceschanged", handleVoicesChanged);

								logError("getSynthesizerFromBrowser", event);

								return reject(event.error);
							};

							// NOTE: Chrome needs to wait for the onvoiceschanged event before using the synthesizer.
							synthesizer.addEventListener("voiceschanged", handleVoicesChanged);
							synthesizer.addEventListener("error", handleError);
						} catch (error) {
							reject(error);
						}
					},
				);

				return promiseTimeout(asyncSynthesizerInitialization, 1000)
					.catch((error) => {
						// TODO: remove the specific listeners previously registered.
						if (error && error.name === "PromiseTimeout") {
							logDebug("Done", "getSynthesizerFromBrowser (timeout)", "asyncSynthesizerInitialization", error);

							// NOTE: assume the synthesizer has somehow been initialized without triggering the onvoiceschanged event.
							return synthesizer;
						}

						logError("getSynthesizerFromBrowser", "asyncSynthesizerInitialization", error);

						throw error;
					});
			})
			.then((synthesizer) => {
				// NOTE: only for logging purposes.
				const voices = synthesizer.getVoices();

				logDebug("Variable", "getSynthesizerFromBrowser", "voices[]", voices.length, voices);

				return synthesizer;
			});
	}

	resetSynthesizer() {
		return promiseTry(
			() => {
				delete this.cachedSynthesizer;
				this.cachedSynthesizer = null;

				return undefined;
			},
		);
	}

	getSynthesizer() {
		return promiseTry(
			() => {
				if (this.cachedSynthesizer !== null) {
					return this.cachedSynthesizer;
				}

				return this.getSynthesizerFromBrowser()
					.then((synthesizer) => {
						this.cachedSynthesizer = synthesizer;

						return this.cachedSynthesizer;
					});
			},
		);
	}

	getAllVoices() {
		return promiseTry(
			() => this.getSynthesizer()
				.then((synthesizer) => {
					return synthesizer.getVoices();
				}),
		);
	}

	stopSpeaking() {
		return promiseTry(
			() => {
				logDebug("Start", "stopSpeaking");

				return this.getSynthesizer()
					.then((synthesizer) => {
						const eventData = {};

						return Promise.resolve()
							.then(() => this.broadcaster.broadcastEvent(knownEvents.stopSpeaking, eventData))
							.then(() => {
								synthesizer.cancel();

								// NOTE: reset the system to resume playback, just to be nice to the world.
								synthesizer.resume();

								logDebug("Done", "stopSpeaking");

								return undefined;
							});
					});
			},
		);
	}

	speakPartOfText(utterance) {
		return this.getSynthesizer()
			.then((synthesizer) => new Promise(
				(resolve, reject) => {
					try {
						logDebug("Start", "speakPartOfText", `Speak text part (length ${utterance.text.length}): "${utterance.text}"`);

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
			),
			);
	}

	getActualVoice(mappedVoice) {
		return promiseTry(
			() => {
				logDebug("Start", "getActualVoice", mappedVoice);

				return resolveVoice(mappedVoice)
					.then((actualVoice) => {
						logDebug("Done", "getActualVoice", mappedVoice, actualVoice);

						return actualVoice;
					})
					.catch((error) => {
						logError("getActualVoice", mappedVoice, error);

						throw error;
					});
			},
		);
	}

	splitAndSpeak(text, voice) {
		return promiseTry(
			() => {
				logDebug("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

				const speakingEventData = {
					language: voice.lang,
					text,
					voice: voice.name,
				};

				return Promise.resolve()
					.then(() => this.broadcaster.broadcastEvent(knownEvents.beforeSpeaking, speakingEventData))
					.then(() => {
						// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
						delete window.talkieUtterance;

						return undefined;
					})
					.then(() => Promise.all([
						this.getActualVoice(voice),
						this.settingsManager.getSpeakLongTexts(),
					]))
					.then(([
						actualVoice,
						speakLongTexts,
					]) => {
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

						const textPartsPromises = textParts
							.map((textPart) => () => {
								const speakingPartEventData = {
									language: voice.lang,
									textPart,
									voice: voice.name,
								};

								return shouldContinueSpeaking()
									.then((continueSpeaking) => {
										if (continueSpeaking) {
											return Promise.resolve()
												.then(() => this.broadcaster.broadcastEvent(knownEvents.beforeSpeakingPart, speakingPartEventData))
												.then(() => {
													const utterance = new window.SpeechSynthesisUtterance(textPart);

													utterance.voice = actualVoice;
													utterance.rate = voice.rate || rateRange.default;
													utterance.pitch = voice.pitch || pitchRange.default;

													logDebug("Variable", "utterance", utterance);

													// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
													window.talkieUtterance = utterance;

													return utterance;
												})
												.then((utterance) => this.speakPartOfText(utterance))
												.then(() => this.broadcaster.broadcastEvent(knownEvents.afterSpeakingPart, speakingPartEventData));
										}

										return undefined;
									});
							});

						return promiseSeries(textPartsPromises);
					})
					.then(() => {
						// HACK: keep a reference to the utterance attached to the window. Not sure why this helps, but might prevent garbage collection or something.
						delete window.talkieUtterance;

						return undefined;
					})
					.then(() => this.broadcaster.broadcastEvent(knownEvents.afterSpeaking, speakingEventData));
			},
		);
	}

	speakTextInVoice(text, voice) {
		return promiseTry(
			() => Promise.resolve()
				.then(() => {
					this.contentLogger.logToPage(`Speaking text (length ${text.length}, ${voice.name}, ${voice.lang}): ${text}`)
						.catch((error) => {
							// NOTE: swallowing any logToPage() errors.
							// NOTE: reduced logging for known tab/page access problems.
							if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
								logDebug("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
							} else {
								logInfo("getSelectionsWithValidTextAndDetectedLanguageAndEffectiveLanguage", "Error", error);
							}

							return undefined;
						});

					return this.splitAndSpeak(text, voice);
				})
				.then(() => {
					logDebug("Done", "speakTextInVoice", `Speak text (length ${text.length}, ${voice.name}, ${voice.lang})`);

					return undefined;
				}),
		);
	}

	speakTextInLanguage(text, language) {
		return promiseTry(
			() => {
				const voice = {
					lang: language,
					name: null,
				};

				return Promise.resolve()
					.then(() => {
						return this.speakTextInVoice(text, voice);
					})
					.then(() => logDebug("Done", "speakTextInLanguage", `Speak text (length ${text.length}, ${language})`));
			},
		);
	}
}
