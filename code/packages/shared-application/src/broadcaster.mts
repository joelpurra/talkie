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
	logError,
	logTrace,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	knownEventNames,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	ListeningActionHandler,
} from "@talkie/shared-interfaces/listening-action-handler.mjs";
import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";

import {
	isDeadWrapper,
} from "./utils/is-dead-wrapper.mjs";
import {
	JsonValue,
} from "type-fest";

export default class Broadcaster implements IBroadcasterProvider {
	// TODO: the broadcaster is working with several types of listeners, so the types can't be generic on the class level.
	// This causes issues. Split broadcaster and listeners to separate classes?
	// TODO: hardcode all array types?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	actionListeningMap: Record<knownEventNames, Array<ListeningActionHandler<any, any, any>>> = {
		addProgress: [],
		afterSpeaking: [],
		afterSpeakingPart: [],
		beforeSpeaking: [],
		beforeSpeakingPart: [],
		finishProgress: [],
		passSelectedTextToBackground: [],
		resetProgress: [],
		settingChanged: [],
		stopSpeaking: [],
		updateProgress: [],
	};

	private readonly _knownDeadErrorMessages = [
		"access dead object",
		"<unavailable>",
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async unregisterListeningAction<TEvent extends knownEventNames>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, any, any>): Promise<void> {
		const actions = this.actionListeningMap[actionName];

		if (!Array.isArray(actions) || actions.length === 0) {
			throw new Error(`No listening action(s) registered for action: ${typeof actionName} ${JSON.stringify(actionName)}`);
		}

		const filteredActions = actions.filter((registeredListeningActionHandler) => registeredListeningActionHandler !== listeningActionHandler);

		if (actions.length === filteredActions.length) {
			throw new Error(`The specific listening action handler was not registered for action: ${typeof actionName} ${JSON.stringify(actionName)}`);
		}

		this.actionListeningMap[actionName] = filteredActions;
	}

	async registerListeningAction<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		this.actionListeningMap[actionName] = this.actionListeningMap[actionName].concat(listeningActionHandler);

		const killSwitch = async () =>
			// NOTE: the promise chain probably won't be completed (by the caller, outside of this function), as the kill switch might be executed during the "onunload" event.
			this.unregisterListeningAction(actionName, listeningActionHandler);
		return killSwitch;
	}

	async broadcastEvent<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, actionData: Readonly<TData>): Promise<Array<TReturn | null>> {
		void logTrace("Start", "Sending message", actionName, actionData);

		const listeningActions = this.actionListeningMap[actionName];

		if (!listeningActions || listeningActions.length === 0) {
			void logTrace("Skipping", "Sending message", actionName, actionData);

			return [];
		}

		try {
			const responses = await Promise.all(
				listeningActions.map(
					async (action) => {
						try {
							// NOTE: check for dead objects from cross-page (background, popup, options, ...) memory leaks.
							// NOTE: this is just in case the killSwitch hasn't been called.
							// https://developer.mozilla.org/en-US/docs/Extensions/Common_causes_of_memory_leaks_in_extensions#Failing_to_clean_up_event_listeners
							// TODO: throw error instead of cleaning up?
							// TODO: clean up code to avoid memory leaks, primarily in Firefox as it doesn't have onSuspend at the moment.
							if (isDeadWrapper(action)) {
								void logWarn("Dead wrapper (detected)", "Sending message", actionName, actionData);

								await this.unregisterListeningAction(actionName, action);

								return null;
							}

							// NOTE: typing information lost.
							// eslint-disable-next-line @typescript-eslint/no-unsafe-return
							return action(actionName, actionData);
						} catch (error: unknown) {
							try {
								// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
								const wasDead = error
									&& (
										(
											typeof error === "string"
											&& this._includesKnownDeadErrorMessage(error)
										)
										|| this._includesKnownDeadErrorMessage(String(error))
										|| (
											typeof error === "object"
											&& typeof (error as Error).message === "string"
											&& this._includesKnownDeadErrorMessage((error as Error).message)
										)
									);

								if (wasDead) {
									// NOTE: it's a dead wrapper, but it wasn't detected by isDeadWrapper() above. Ignore.
									void logWarn("Dead wrapper (caught)", "Sending message", actionName, actionData);

									await this.unregisterListeningAction(actionName, action);

									return null;
								}
							} catch {
								// NOTE: ignore error thrown during the fallback dead wrapper detection process.
								void logWarn("Dead wrapper (failed)", "Sending message", actionName, actionData);
							}

							throw error;
						}
					},
				),
			);

			void logTrace("Done", "Sending message", actionName, actionData, responses);

			return responses;
		} catch (error: unknown) {
			// NOTE: logging stringified error as dead wrapped errors would otherwise not contain any useful information.
			void logError("Sending message", actionName, actionData, error, JSON.stringify(error));

			throw error;
		}
	}

	private _includesKnownDeadErrorMessage(string_: string): boolean {
		return this._knownDeadErrorMessages.some((knownDeadErrorMessage) => string_.includes(knownDeadErrorMessage));
	}
}
