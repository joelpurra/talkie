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
import SynthesizerHelper from "@talkie/browser-bricks/synthesizer-helper.mjs";
import ClipboardManager from "@talkie/browser-shared/clipboard-manager.mjs";
import PermissionsManager from "@talkie/browser-shared/permissions-manager.mjs";
import MessageBusInspector from "@talkie/shared-application/message-bus/message-bus-inspector.mjs";
import createMessageBusListenerHelpers from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logDebug,
	logError,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";
import {
	isTalkieDevelopmentMode,
} from "@talkie/shared-application-helpers/talkie-build-mode.mjs";
import {
	type IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";
import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import {
	type IMessageBusProviderGetter,
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const mason = async (uninitializers: UninitializerCallback[], messageBusProviderGetter: IMessageBusProviderGetter): Promise<void> => {
	void logDebug("Start", "Main mason function");

	if (isTalkieDevelopmentMode()) {
	// NOTE: no cleanup; listen to the bitter end.
		const messageBusInspector = new MessageBusInspector(messageBusProviderGetter, logDebug.bind(undefined, "mason"));
		await messageBusInspector.start();
	}

	// TODO: break out listener creation to separate function/file.
	{
		const {
			bullhorn,
			startReactor,
			startResponder,
		} = createMessageBusListenerHelpers(messageBusProviderGetter);

		if (isTalkieDevelopmentMode()) {
			uninitializers.unshift(
				// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
				...await startResponder("development:dummy:multiply-random", async (_action, i): Promise<string> => {
					if (typeof i !== "number") {
						throw new TypeError(`NaN ${JSON.stringify(i, null, 0)}`);
					}

					const random = Math.random();
					const result = i * random;

					return `Dummy response ${i}*${random}=${result}`;
				}),

			);
		}

		const _resetSynthesizerHelper = async () => {
			// NOTE: need to funnel talkie's speech reset/abort/stop through this event helper.
			await SynthesizerHelper.resetSynthesizer();

			// HACK: cannot listen to a synthesizer event, as the "stop" event is not on the global synthesizer, but on each utterance instance.
			// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisEvent
			// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisErrorEvent
			// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/end_event
			// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/error_event
			{
				const eventData = {};

				// NOTE: not awaiting the response, which is not allowed anyhow.
				void bullhorn("broadcaster:synthesizer:reset", eventData);
			}
		};

		const t = [
			startReactor("offscreen:synthesizer:resetSynthesizer", async () => {
				await _resetSynthesizerHelper();

				return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
			}),

			startReactor("offscreen:synthesizer:speakTextInVoice", async (
				_action,
				// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
				{
					text, voice,
				}: {
					text: string;
					voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>;
				},
			) => {
				try {
					await SynthesizerHelper.speakTextInVoice(text, voice);
				} catch (error: unknown) {
					// NOTE: hoping a reset helps, also for unknown errors.
					await promiseDelay(100);
					await _resetSynthesizerHelper();

					if (typeof error === "string" && error === "interrupted") {
						// NOTE: an "interrupted" error (rejected from string primitive SpeechSynthesisErrorEvent.error) may occur if stopping in the middle of speech in chrome.
						// NOTE: ignoring the error as "handled".
						void logWarn("Ignoring/swallowing known error:", "SpeechSynthesisErrorEvent.error", error);
					} else {
						throw error;
					}
				}

				return TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;
			}),

			startResponder("offscreen:synthesizer:getAllSafeVoiceObjects", async () => SynthesizerHelper.getAllSafeVoiceObjects()),

			startResponder("offscreen:synthesizer:resolveSafeVoiceObjectByName", async (_action, voiceName: string) => SynthesizerHelper.resolveSafeVoiceObjectByName(voiceName)),

			startResponder("offscreen:synthesizer:resolveDefaultSafeVoiceObjectForLanguage", async (_action, language: string) => SynthesizerHelper.resolveDefaultSafeVoiceObjectForLanguage(language)),

			startResponder("offscreen:clipboard:read", async (action): Promise<string | null> => {
				try {
					// NOTE: include all clipboard/permission handling in the event handler, in case it needs a user interaction trigger.
					const permissionsManager = new PermissionsManager();

					if (await permissionsManager.browserHasPermissionsFeature()) {
						const clipboardManager = new ClipboardManager(permissionsManager);
						await clipboardManager.initialize();
						const clipboardValue = await clipboardManager.getClipboardText();
						await clipboardManager.uninitialize();

						return clipboardValue;
					}

					void logWarn(`messageBus["${action}"]`, "Could not access the browser permissions system to check/request clipboard permissions.");
				} catch (error: unknown) {
					void logError(`messageBus["${action}"]`, "swallowing error", error);
				}

				return null;
			}),
		];

		const u = await Promise.all(t.flat());

		uninitializers.unshift(...u.flat());
	}

	void logDebug("Done", "Main mason function");
};
