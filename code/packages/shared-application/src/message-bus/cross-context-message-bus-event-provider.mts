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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logDebug,
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusEventProvider,
	MessageBusCallback,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	type JsonValue,
} from "type-fest";

import {
	isDeadObjectError,
} from "../utils/is-dead-wrapper.mjs";
import CrossContextMessageBusEvent from "./cross-context-message-bus-event.mjs";
import {
	isMessageBusCallbackInContext,
} from "./message-bus-helper.mjs";

export default class CrossContextMessageBusEventProvider extends CrossContextMessageBusEvent implements IMessageBusEventProvider {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public dispatch(rawMessage: JsonValue): Array<ReturnType<MessageBusCallback>> {
		this._pruneDeadListeners();

		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		// TODO: reduce jsonClone() use in message bus.
		const messageClone = jsonClone(rawMessage);

		const callbacks = [
			...this._listeners.values(),
		];

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
		const excludeContextIdentifier = (messageClone as any).talkieContext ?? undefined;

		const otherContextsCallbacks = excludeContextIdentifier === undefined
			? callbacks
			: callbacks
				.filter((callback) => {
					if (isMessageBusCallbackInContext(callback)) {
						// NOTE: skip background callbacks to avoid looping background-originating messages back to background callbacks.
						return callback.talkieContext !== excludeContextIdentifier;
					}

					return true;
				});

		{
			const callbacksDiff = callbacks.length - otherContextsCallbacks.length;

			// NOTE: assuming that one callback is remove -- the one from the own context.
			if (callbacksDiff !== 1) {
				void logDebug(
					`Filtered out ${callbacksDiff} callbacks from ${excludeContextIdentifier ?? "(undefined current context)"}, out of a total of ${callbacks.length} callbacks.`,
					callbacks.map((callback) => (isMessageBusCallbackInContext(callback) && callback.talkieContext) || undefined),
					messageClone,
				);
			}
		}

		return otherContextsCallbacks
			.map(async (callback) => {
				try {
					const rawResponse = await callback(messageClone);

					// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
					// TODO: reduce jsonClone() use in message bus.
					const responseClone = rawResponse === undefined ? undefined : jsonClone(rawResponse);

					return responseClone;
				} catch (error: unknown) {
					if (isDeadObjectError(error)) {
						void logInfo("Failed to call dead callback for message.", messageClone);

						return;
					}

					throw error;
				}
			});
	}
}
