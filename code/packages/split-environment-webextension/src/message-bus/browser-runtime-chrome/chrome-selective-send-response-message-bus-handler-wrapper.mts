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

import {
	extractMessageBusResponseDatum,
	extractMessageBusResponseMode,
} from "@talkie/shared-application/message-bus/message-bus-helper.mjs";
import {
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import type {
	MessageBusResponseMode,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	MessageBusCallback,
	MessageBusCallbackResponse,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const chromeSelectiveSendResponseMessageHandler = async (callback: MessageBusCallback, rawMessage: JsonValue, sendResponse: (response: unknown) => void): Promise<void> => {
	// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
	const messageClone = jsonClone(rawMessage);

	// HACK: inspect the message, which is supposed to be opaque, to be able to make transport-level decisions.
	const messageBusResponseMode: MessageBusResponseMode | undefined = extractMessageBusResponseMode(messageClone);

	const rawResponse: MessageBusCallbackResponse = await callback(messageClone);

	// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
	const responseClone = rawResponse === undefined ? undefined : jsonClone(rawResponse);

	// TODO: investigate if "undefined" responses can be passed by all message bus implementations (chrome, webextension/firefox, same-context/set).
	const responseIsDefined = responseClone !== undefined;

	// NOTE: "null" datum counts as a "defined" value here, because it is a JsonValue; use as an explicit "no proper response value" to signal that message processing is done.
	// TODO: consider a special "response was handled" message, instead of the more generally useful "null".
	const datum: MessageBusCallbackResponse = extractMessageBusResponseDatum(responseClone);
	const responseIndicatesHandlerDone = datum === TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;

	// NOTE: might be cleaner with a multi-value switch-case; possible to use arrays?
	switch (messageBusResponseMode) {
		case "response:disallowed": {
			if (responseIsDefined) {
				throw new TypeError(`Received a response, despite expecting none. Message was ${JSON.stringify(messageClone, null, 0)}, received ${JSON.stringify(responseClone, null, 0)}.`);
			}

			// NOTE: propagating an undefined "response" (not a full message) means that (at least) one message handler has had a chance to react, including possibly asynchronously performing work, and the calling "await sendMessage()" can finish.
			// NOTE: this "undefined" response will show up as "null" on the await chrome.runtime.sendMessage(...) side.
			sendResponse(undefined);

			break;
		}

		case "response:acknowledgment": {
			if (responseIndicatesHandlerDone) {
				// NOTE: allowing "null" as a "non-response" by an "actual" message handler to signal that the "action" has been performed; propagate the full "null" message.
				sendResponse(responseClone);

				break;
			}

			if (responseIsDefined) {
				throw new TypeError(`Should only receive undefined/null from the message ${JSON.stringify(messageClone, null, 0)}, but received: ${JSON.stringify(responseClone, null, 0)}.`);
			}

			// NOTE: ignore all "undefined" responses -- both before and after a "proper" "null" response -- to ensure the message has a change to get processed.
			// NOTE: choosing *not* to send a response works in chrome.
			// NOTE: check in-browser logs for missing responses (timeouts), indicating missing or broken message handlers (which actually perform processing) for that message.
			break;
		}

		case "response:required": {
			if (!responseIsDefined) {
				// NOTE: a message-forwarding listener is registered for each context, so "undefined" responses from "irrelevant" (as in technically required but non-responding) listeners are expected.
				// NOTE: choosing *not* to send a response works in chrome.
				// NOTE: known firefox bug (from 2020-06-03, still open 2024-08-10) where sendMessage() fails-fast if one (async) message handler "decides" to not reply, ignoring further replies.
				// > Error: Promised response from onMessage listener went out of scope
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1643186
				break;
			}

			// NOTE: propagate the full response.
			sendResponse(responseClone);

			break;
		}

		default: {
			throw new TypeError(`Unhandled MessageBusResponseMode case "${messageBusResponseMode}". Message was ${JSON.stringify(messageClone, null, 0)}, received ${JSON.stringify(responseClone, null, 0)}.`);
		}
	}

	// NOTE: the return value from this wrapper is ignored.
	return undefined;
};

export default chromeSelectiveSendResponseMessageHandler;
