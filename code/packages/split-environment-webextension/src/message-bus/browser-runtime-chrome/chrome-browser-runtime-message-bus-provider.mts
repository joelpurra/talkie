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
	isNoListenersError,
} from "@talkie/shared-application/message-bus/message-bus-helper.mjs";
import {
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusEvent,
	IMessageBusProvider,
	MessageBusCallbackResponse,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

export default class ChromeBrowserRuntimeMessageBusProvider implements IMessageBusProvider {
	constructor(public readonly onMessage: IMessageBusEvent) {}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async sendMessage(rawMessage: JsonValue): Promise<MessageBusCallbackResponse> {
		try {
			// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
			const messageClone = jsonClone(rawMessage);

			// NOTE: chrome.runtime.sendMessage() is expected to internally disallow more than one response; other implementations need to adhere to this limitation.
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const rawResponse = await chrome.runtime.sendMessage(messageClone);

			// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const responseClone = rawResponse === undefined ? undefined : jsonClone(rawResponse);

			if (responseClone === null) {
				// NOTE: chrome's sendMessage() doesn't propagate "undefined" (strict JSON?) messages; treat a "null" message as "not defined".
				return undefined;
			}

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return responseClone;
		} catch (error: unknown) {
			if (isNoListenersError(error)) {
				// TODO: because of the cross-messaging implementation, which always sends messages everywhere, ignore missing other-context listeners.
				void logWarn(this.constructor.name, "Connection error in the message handler(s); swallowing.", rawMessage, error);

				return undefined;
			}

			void logWarn(this.constructor.name, "Error in the message handler(s); rethrowing.", rawMessage, error);

			throw error;
		}
	}
}
