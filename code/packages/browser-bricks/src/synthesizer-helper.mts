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
	isPromiseTimeout,
	promiseTimeout,
} from "@talkie/shared-application-helpers/promise.mjs";
import type {
	IVoiceNameAndRateAndPitch,
	SafeSpeechSynthesisEventObject,
	SafeVoiceObject,
	SafeVoiceObjects,
} from "@talkie/shared-interfaces/ivoices.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	createSafeSpeechSynthesisEventObjectFromSpeechSynthesisEvent,
	createSafeVoiceObjectFromSpeechSynthesisVoice,
	resolveDefaultVoiceFromLanguage,
	resolveVoiceFromName,
} from "./speaker-helpers.mjs";

declare global {
	// eslint-disable-next-line no-var
	var talkieUtterance: SpeechSynthesisUtterance | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class SynthesizerHelper {
	// TODO: try longer timeout for slow systems and/or very many voices?
	private static get _synthesizerInitializationTimeout() {
		return 1000;
	}

	public static async getAllSafeVoiceObjects(): Promise<SafeVoiceObjects> {
		// NOTE: in the synthesizer class so it (plus the helper functions) is the only one to handle SpeechSynthesisVoice.
		const voices = await SynthesizerHelper._getAllVoices();

		// NOTE: the SpeechSynthesisVoice object reference cannot be transferred outside of the background page context, need to transform/copy the object properties.
		const copy = voices.map((voice) => createSafeVoiceObjectFromSpeechSynthesisVoice(voice));

		return copy;
	}

	public static async resolveSafeVoiceObjectByName(voiceName: string): Promise<SafeVoiceObject | null> {
		// TODO: simple voice filtering can be performed on SafeVoiceObjects in upper layers; move functionality elsewhere?
		const voices = await SynthesizerHelper._getAllVoices();
		const voice = await resolveVoiceFromName(voices, voiceName);

		if (!voice) {
			// TODO: throw instead?
			return null;
		}

		const safeVoiceObject = createSafeVoiceObjectFromSpeechSynthesisVoice(voice);

		return safeVoiceObject;
	}

	public static async resolveDefaultSafeVoiceObjectForLanguage(language: string): Promise<SafeVoiceObject | null> {
		// TODO: simple voice filtering can be performed on SafeVoiceObjects in upper layers; move functionality elsewhere?
		const voices = await SynthesizerHelper._getAllVoices();
		const voice = await resolveDefaultVoiceFromLanguage(voices, language);

		if (!voice) {
			// TODO: throw instead?
			return null;
		}

		const safeVoiceObject = createSafeVoiceObjectFromSpeechSynthesisVoice(voice);

		return safeVoiceObject;
	}

	public static async speakTextInVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		const resolvedVoice = await SynthesizerHelper._resolveSpeechSynthesisVoice(voice.name);

		await SynthesizerHelper._createAndSpeakUtterance(text, resolvedVoice, voice.rate, voice.pitch);
	}

	public static async resetSynthesizer(): Promise<void> {
		// NOTE: used for a quick and relatively unclean extension unload/shutdown.
		// NOTE: ignoring whether talkie or some other software initiated speaking.
		const synthesizer = await SynthesizerHelper._getSynthesizer();

		if (synthesizer.speaking) {
			// NOTE: attempting to not "cut" the voice/utterance too sharply, hopefully less abruptly than a plain cancellation (which may be a technical "kill").
			synthesizer.pause();
		}

		// NOTE: stop the utterance and remove all utterances (including pending) from the window.speechSynthesis queue.
		// TODO: help chrome recover from stopping/cancellations?
		synthesizer.cancel();
	}

	private static async _getSynthesizer(): Promise<SpeechSynthesis> {
		// https://wicg.github.io/speech-api/#tts-section
		// https://wicg.github.io/speech-api/#examples-synthesis
		// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#speech_synthesis
		const synthesizer = await SynthesizerHelper._getSynthesizerFromBrowser();

		return synthesizer;
	}

	private static async _getAllVoices(): Promise<SpeechSynthesisVoice[]> {
		const synthesizer = await SynthesizerHelper._getSynthesizer();
		const voices = synthesizer.getVoices();

		// TODO: check if there are any voices installed, alert user (the options page does this; also warn with "warning" Talkie icon, in popup) if not.
		if (!Array.isArray(voices)) {
			// NOTE: the list of voices could still be empty, either due to slow loading (cold cache) or that there actually are no voices loaded.
			throw new TypeError("Could not load list of voices from browser.");
		}

		return voices;
	}

	private static async _speakUtterance(utterance: ReadonlyDeep<SpeechSynthesisUtterance>): Promise<SafeSpeechSynthesisEventObject> {
		const synthesizer = await SynthesizerHelper._getSynthesizer();

		// NOTE: wraps the browser's speech synthesizer events to track progress.
		return new Promise<SafeSpeechSynthesisEventObject>(
			(resolve, reject) => {
				const handleEnd = (event: ReadonlyDeep<SpeechSynthesisEvent>) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleError);

					// NOTE: probably not necessary to expose the entire event object.
					const safeSpeechSynthesisEventObject = createSafeSpeechSynthesisEventObjectFromSpeechSynthesisEvent(event);

					resolve(safeSpeechSynthesisEventObject);
				};

				const handleError = (event: ReadonlyDeep<SpeechSynthesisErrorEvent>) => {
					utterance.removeEventListener("end", handleEnd);
					utterance.removeEventListener("error", handleError);

					// NOTE: the error code may be useful for callers.
					// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisErrorEvent
					reject(event.error);
				};

				try {
					// NOTE: some voices, such as Fred (English) on macOS, have a tendency to crash.
					// TODO: add a timeout in case the speech synthesizer crashes.
					// NOTE: consider a imposing a timeout for the "boundary" and/or "mark" events, since that might indicate an issue with the synthesizer/voice.
					utterance.addEventListener("end", handleEnd);
					utterance.addEventListener("error", handleError);

					// NOTE: the actual act of speaking the text.
					// TODO: check if speaking is (now) promisified in (at least) chrome (v127+).
					synthesizer.speak(utterance);

					// NOTE: pause/resume suggested (for longer texts) in Chrome bug reports, trying it for shorter texts as well.
					// https://issues.chromium.org/issues/41084789
					// https://issues.chromium.org/issues/41105085 (https://bugs.chromium.org/p/chromium/issues/detail?id=369472)
					// NOTE: speak/pause/resume (chrome v127) causes fairly generic warnings for using pause() media (<video />, <audio />) just after play().
					// > AbortError: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22
					// https://developer.chrome.com/blog/play-request-was-interrupted
					synthesizer.pause();
					synthesizer.resume();
				} catch (error: unknown) {
					reject(error);
				}
			},
		);
	}

	private static async _createAndSpeakUtterance(text: string, resolvedVoice: Readonly<SpeechSynthesisVoice>, rate: number, pitch: number) {
		const utterance = new globalThis.SpeechSynthesisUtterance(text);

		utterance.voice = resolvedVoice;
		utterance.rate = rate;
		utterance.pitch = pitch;

		// HACK: keep a reference to the utterance attached to globalThis; might prevent garbage collection.
		globalThis.talkieUtterance = utterance;

		try {
			await SynthesizerHelper._speakUtterance(utterance);
		} finally {
			// HACK: keep a reference to the utterance attached to globalThis; might prevent garbage collection.
			delete globalThis.talkieUtterance;
		}
	}

	private static async _resolveSpeechSynthesisVoice(voiceName: string): Promise<SpeechSynthesisVoice> {
		const voices = await SynthesizerHelper._getAllVoices();

		const resolvedVoice = await resolveVoiceFromName(voices, voiceName);

		if (!resolvedVoice) {
			throw new TypeError("resolvedVoice");
		}

		return resolvedVoice;
	}

	private static async _asyncSynthesizerInitialization(): Promise<void> {
		// NOTE: wraps the browser's speech synthesizer events to figure out when it is ready.
		return new Promise<void>(
			(resolve, reject) => {
				const handleVoicesChanged = () => {
					globalThis.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);

					resolve();
				};

				try {
					// NOTE: Chrome needs to wait for the onvoiceschanged event before using the synthesizer.
					// TODO: register listener before first call (in this "page" context? extension context? entire browser context?) to getVoices, to prevent race condition by ensuring that the event doesn't happen before listener registration?
					globalThis.speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

					// NOTE: attempt to trigger loading, or at least the event.
					globalThis.speechSynthesis.getVoices();
				} catch (error: unknown) {
					// NOTE: overly safe error handling due to browser differences.
					try {
						globalThis.speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
					} catch {
						// NOTE: ignored.
					}

					reject(error);
				}
			},
		);
	}

	private static async _getSynthesizerFromBrowser(): Promise<SpeechSynthesis> {
		if (!("speechSynthesis" in globalThis)) {
			throw new Error("The browser does not support speechSynthesis.");
		}

		if (typeof globalThis.speechSynthesis.getVoices !== "function") {
			throw new TypeError("The browser does not support speechSynthesis.getVoices().");
		}

		if (typeof globalThis.speechSynthesis.speak !== "function") {
			throw new TypeError("The browser does not support speechSynthesis.speak().");
		}

		if (!("SpeechSynthesisUtterance" in globalThis)) {
			throw new Error("The browser does not support SpeechSynthesisUtterance.");
		}

		// NOTE: the speech synthesizer can only be used in Chrome after the voices have been loaded.
		// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
		// NOTE: The synthesizer will work right away in Firefox.
		const preloadedVoices = globalThis.speechSynthesis.getVoices();

		if (Array.isArray(preloadedVoices) && preloadedVoices.length > 0) {
			return globalThis.speechSynthesis;
		}

		try {
			await promiseTimeout(SynthesizerHelper._asyncSynthesizerInitialization(), SynthesizerHelper._synthesizerInitializationTimeout);
		} catch (error: unknown) {
			// TODO: remove the specific listeners previously registered.
			if (isPromiseTimeout(error)) {
				// NOTE: assume the synthesizer has somehow been initialized without triggering the onvoiceschanged event and continue.
			} else {
				throw error;
			}
		}

		return globalThis.speechSynthesis;
	}
}
