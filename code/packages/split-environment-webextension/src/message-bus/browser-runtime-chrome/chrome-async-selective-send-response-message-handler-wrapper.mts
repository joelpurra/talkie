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

import type {
	MessageBusCallback,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonValue,
} from "type-fest";
import type {
	Runtime,
} from "webextension-polyfill";

import chromeSelectiveSendResponseMessageHandler from "./chrome-selective-send-response-message-bus-handler-wrapper.mjs";

// NOTE: cannot be an async function due to a chrome bug (2024-07-07); the bug has been replicated in firefox (2024-07-07).
// https://crbug.com/1185241
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
// NOTE: handling the workaround in the "bound" handler.
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export default function chromeAsyncSelectiveSendResponseMessageHandlerWrapper(this: MessageBusCallback, rawMessage: unknown, _sender: Runtime.MessageSender, sendResponse: (response: unknown) => void): true {
	// HACK: passing the original callback as the context, to avoid having to define the callback/wrapper types.
	// eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
	const callback: MessageBusCallback = this;

	if (typeof callback !== "function") {
		throw new TypeError("Function not bound to another \"this\" function.");
	}

	// NOTE: not awaiting the handler; responses will be sent async via sendResponse().
	void chromeSelectiveSendResponseMessageHandler(callback, rawMessage as JsonValue, sendResponse);

	// NOTE: in order to consistently "await sendMessage()" in this non-promisified callback handler, tell chrome to always expect an async callback and then (try to) make sure one comes -- whether a response was expected or not.
	// https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
	// > If multiple pages are listening for onMessage events, only the first to call sendResponse() for a particular event will succeed in sending the response. All other responses to that event will be ignored.
	return true;
}
