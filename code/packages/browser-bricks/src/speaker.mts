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

import type {
	JsonObject,
	ReadonlyDeep,
} from "type-fest";

import type NonBreakingChain from "./non-breaking-chain.mjs";
import type OnlyLastCaller from "./only-last-caller.mjs";

import {
	bespeak,
	betoken,
	bullhorn,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseFunctionSeries,
} from "@talkie/shared-application-helpers/promise.mjs";
import {
	type SpeakingEventData,
	type SpeakingEventPartData,
} from "@talkie/shared-interfaces/ispeaking-event.mjs";
import {
	type IVoiceNameAndRateAndPitch,
	type SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import TextHelper from "./text-helper.mjs";

export default class Speaker {
	private static get _maxUtteranceTextLength() {
		// TODO: break out to a setting.
		return 100;
	}

	// https://wicg.github.io/speech-api/#tts-section
	// https://wicg.github.io/speech-api/#examples-synthesis
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API#speech_synthesis
	constructor(
		private readonly messageBusProviderGetter: IMessageBusProviderGetter,
		private readonly shouldContinueSpeakingProvider: OnlyLastCaller,
		private readonly speechChain: NonBreakingChain,
	) {}

	public async stopSpeaking(): Promise<void> {
		void logDebug("Start", "stopSpeaking");

		await this._abortSpeaking();

		void logDebug("Done", "stopSpeaking");
	}

	public async speakTextInVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>, speakLongTexts: boolean): Promise<void> {
		// NOTE: there's a bit of a race condition between the (message bus propagating) events for stopping/resetting/starting speech; one slow handler (or side-effect rather, perhaps outside of the promise chain) for either event may affect the timing of later events.
		await this.stopSpeaking();

		const safeVoice = await bespeak(this.messageBusProviderGetter, "offscreen:synthesizer:resolveSafeVoiceObjectByName", voice.name) as SafeVoiceObject | null;

		if (safeVoice === null) {
			// TODO: recover to some fallback (voice, language, diplayed message, spoken message) instead?
			throw new TypeError(`No voice found for name: ${voice.name}`);
		}

		void logDebug(`Speaking text (length ${text.length}, ${JSON.stringify(safeVoice.name)}, ${JSON.stringify(safeVoice.lang)}}): ${JSON.stringify(text)}`);

		const createSpeech = async () => this._splitAndSpeak(text, safeVoice, voice.rate, voice.pitch, speakLongTexts);

		try {
			await this.speechChain.link(createSpeech);
		} catch (error: unknown) {
			// NOTE: chain should be non-breaking, this _should_ never happen.
			void logError("Caught error on the speechChain. Swallowing. Stopping speech.", error);

			return this.stopSpeaking();
		}

		void logDebug("Done", "speakTextInVoice", `Speak text (length ${text.length}, ${JSON.stringify(safeVoice.name)}, ${JSON.stringify(safeVoice.lang)}})`);
	}

	private async _abortSpeaking(): Promise<void> {
		void logDebug("Start", "abortSpeaking");

		// NOTE: may be used for a quick and relatively unclean extension unload/shutdown.
		// NOTE: ignoring whether talkie or some other software initiated speaking.
		await betoken(this.messageBusProviderGetter, "offscreen:synthesizer:resetSynthesizer");

		void logDebug("Done", "abortSpeaking");
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, max-params
	private async _splitAndSpeak(text: string, safeVoice: Readonly<SafeVoiceObject>, rate: number, pitch: number, speakLongTexts: boolean): Promise<void> {
		void logDebug("Start", "splitAndSpeak", `Speak text (length ${text.length}): "${text}"`);

		const paragraphs = TextHelper.splitTextToParagraphs(text);

		const textParts: string[] = speakLongTexts
			? paragraphs
			: paragraphs.flatMap((paragraph) => TextHelper.splitTextToSentencesOfMaxLength(paragraph, Speaker._maxUtteranceTextLength));

		void logDebug("Variable", "textParts.length", textParts.length);

		const speakingEventData: SpeakingEventData = {
			language: safeVoice.lang,
			text,
			textParts,
			voiceName: safeVoice.name,
		};

		try {
			await bullhorn(this.messageBusProviderGetter, "broadcaster:speaking:entire:before", speakingEventData);

			await this._speak(textParts, safeVoice, rate, pitch);
		} finally {
			await bullhorn(this.messageBusProviderGetter, "broadcaster:speaking:entire:after", speakingEventData);
		}
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	private async _speak(textParts: string[], safeVoice: Readonly<SafeVoiceObject>, rate: number, pitch: number): Promise<void> {
		const shouldContinueSpeaking = this.shouldContinueSpeakingProvider.getShouldContinueSpeakingProvider();

		// TODO: generator, yielding text parts?
		const textPartsPromiseFunctions = textParts
			.map(
				(textPart: string, index) => async () => {
					// NOTE: some voices, such as Fred (English) on macOS, have a tendency to crash.
					// TODO: add a timeout in case the speech synthesizer crashes.
					const continueSpeaking = await shouldContinueSpeaking();

					if (!continueSpeaking) {
						// TODO: generator/yield?
						// TODO: return value which indicates that speaking will not continue?
						// TODO: convert promise series to loop?
						return;
					}

					const speakingPartEventData: SpeakingEventPartData = {
						actualVoice: safeVoice,
						pitch,
						rate,
						textPart,
						textPartIndex: index,
					};

					// NOTE: trying to avoid sending object references to broadcastEvent.
					const speakingPartEventDataCopy = jsonClone(speakingPartEventData);
					await bullhorn(this.messageBusProviderGetter, "broadcaster:speaking:part:before", speakingPartEventDataCopy);

					const voice: IVoiceNameAndRateAndPitch = {
						name: safeVoice.name,
						pitch,
						rate,
					};

					// TODO: move speaking broadcast events closer to the actual in-browser speaking, at the other end of this message bus call?
					await betoken(this.messageBusProviderGetter, "offscreen:synthesizer:speakTextInVoice", {
						text: textPart,
						voice,
					} as unknown as JsonObject);

					await bullhorn(this.messageBusProviderGetter, "broadcaster:speaking:part:after", speakingPartEventDataCopy);
				},
			);

		return promiseFunctionSeries(textPartsPromiseFunctions);
	}
}
