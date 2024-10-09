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
	errorMessageIncludes,
	getRandomInt,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	MessageBusContextIdentifier,
	MessageBusContextPlurals,
	MessageBusContextTag,
	MessageBusDirectionPairing,
	MessageBusMessage,
	MessageBusResponseMode,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import {
	MessageBusResponseModes,
	TALKIE_MESSAGE_BUS_IDENTIFIER,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	MessageBusCallback,
	MessageBusCallbackInContext,
	MessageBusCallbackResponse,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonObject,
	JsonValue,
} from "type-fest";

export function isValidMessageBusMessage(message: unknown, direction: MessageBusDirectionPairing, talkieMessageIdentifier?: string): message is MessageBusMessage {
	if (message === undefined || typeof message !== "object" || message === null) {
		return false;
	}

	const messageObject = message as Record<string, unknown>;
	const message__talkieIdentifier = messageObject._talkieIdentifier;

	if (typeof message__talkieIdentifier === "number" && message__talkieIdentifier !== TALKIE_MESSAGE_BUS_IDENTIFIER) {
		return false;
	}

	const message_direction = messageObject.direction;

	if (message_direction !== direction) {
		return false;
	}

	const message__talkieMessageIdentifier = messageObject._talkieMessageIdentifier;

	if (typeof talkieMessageIdentifier === "number" && message__talkieMessageIdentifier !== talkieMessageIdentifier) {
		return false;
	}

	// TODO: more generic <T> data verification?
	// TODO: disallow undefined messsage data?
	//const message_data = messageObject.data;
	//
	//if (message_data === undefined) {
	//    const _talkieMessageIdentifier = typeof message__talkieMessageIdentifier === "string" ? message__talkieMessageIdentifier : "(undefined _talkieMessageIdentifier)";
	//
	//    throw new TypeError(`Message data is undefined for ${_talkieMessageIdentifier}.`);
	//}

	return true;
}

export const isNoListenersError = (error: unknown): boolean =>
	// NOTE: error message specific to chrome.runtime.sendMessage() in firefox.
	// TODO: needs equivalent message check for chrome?
	errorMessageIncludes(error, "Could not establish connection. Receiving end does not exist.");

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const tagMessage = (talkieContext: MessageBusContextIdentifier, message: JsonObject): MessageBusContextTag =>
	Object.assign<JsonObject, MessageBusContextTag>(
		message,
		{
			talkieContext,
		},
	);

export function isInMessageBusContext(input: unknown): input is MessageBusContextTag {
	// NOTE: covering the two cases: message object and message handler (callback) function.
	const isInContext = (typeof input === "object" || typeof input === "function")
		&& input !== null
		&& "talkieContext" in input
		&& typeof input.talkieContext === "string";

	return isInContext;
}

export function assertIsInMessageBusContext(input: unknown): asserts input is MessageBusContextTag {
	if (!isInMessageBusContext(input)) {
		throw new TypeError(`A message context was not set: ${JSON.stringify(input, null, 0)}`);
	}
}

export function assertIsNotInMessageBusContext(input: unknown): asserts input is unknown {
	if (isInMessageBusContext(input)) {
		throw new TypeError(`A message context was unexpectedly already set: ${JSON.stringify(input, null, 0)}`);
	}
}

export const tagMessageBusCallbackFn = (talkieContext: MessageBusContextIdentifier, callback: MessageBusCallback): MessageBusCallbackInContext =>
	Object.assign<MessageBusCallback, MessageBusContextTag>(
		callback,
		{
			talkieContext,
		},
	);

export function isMessageBusCallbackInContext(callback: MessageBusCallback): callback is MessageBusCallbackInContext {
	return typeof callback === "function" && isInMessageBusContext(callback);
}

export const getRandomTalkieContextIdentifierFromDocumentLocation = (): MessageBusContextIdentifier => {
	if (!document.location) {
		throw new TypeError("Could not extract basename from document.location.");
	}

	if (typeof document.location.pathname !== "string") {
		throw new TypeError("Could not extract basename from document.location.path.");
	}

	const documentLocationBasename = document.location.pathname.split("/").reverse()[0];

	if (typeof documentLocationBasename !== "string") {
		throw new TypeError("Could not extract basename from document.location.path parts.");
	}

	// TODO: assert context name string.
	const documentLocationBasenameWithoutExtension: MessageBusContextPlurals = documentLocationBasename.replace(/(\.\w{2})?\.html$/, "") as MessageBusContextPlurals;
	const randomInt = getRandomInt(10_000, 99_999);
	const randomizedContextIdentifier: MessageBusContextIdentifier = `${documentLocationBasenameWithoutExtension}-${randomInt}`;

	return randomizedContextIdentifier;
};

export function isMessageBusContextIdentifier(input: unknown): input is MessageBusContextIdentifier {
	// TODO: enum type.
	const matchMessageBusContextIdentifier = /^background|((options|popup)-\d+)$/;

	return typeof input === "string" && matchMessageBusContextIdentifier.test(input);
}

export function assertIsMessageBusContextIdentifier(input: unknown): asserts input is MessageBusContextIdentifier {
	if (!isMessageBusContextIdentifier(input)) {
		throw new Error(`Not a valid MessageBusContextIdentifier: ${JSON.stringify(input, null, 0)}`);
	}
}

export const setGlobalTalkieContextIdentifier = (talkieContextIdentifier: MessageBusContextIdentifier): void => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if ((globalThis as any).talkieContextIdentifier !== undefined) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		throw new Error(`Wanted to set globalThis.talkieContextIdentifier to ${talkieContextIdentifier}, but it was already set to ${(globalThis as any).talkieContextIdentifier}.`);
	}

	assertIsMessageBusContextIdentifier(talkieContextIdentifier);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(globalThis as any).talkieContextIdentifier = talkieContextIdentifier;
};

export const getGlobalTalkieContextIdentifier = (): MessageBusContextIdentifier | void => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		talkieContextIdentifier,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} = (globalThis as unknown as any);

	if (isMessageBusContextIdentifier(talkieContextIdentifier)) {
		return talkieContextIdentifier;
	}

	return undefined;
};

export function isMessageBusResponseMode(input: unknown): input is MessageBusResponseMode {
	return typeof input === "string" && Object.keys(MessageBusResponseModes).includes(input);
}

export function assertMessageBusResponseMode(input: unknown): asserts input is MessageBusResponseMode {
	if (!isMessageBusResponseMode(input)) {
		throw new Error(`Not a valid MessageBusResponseMode: ${JSON.stringify(input, null, 0)}`);
	}
}

export const extractMessageBusResponseMode = (input: unknown): MessageBusResponseMode | undefined => {
	// NOTE: custom message property to indicate to chrome if an async response is coming.
	const extracted: string | undefined = typeof input === "object"
		&& input !== null
		&& "responseMode" in input
		&& typeof input.responseMode === "string"
		? input.responseMode
		: undefined;

	if (isMessageBusResponseMode(extracted)) {
		return extracted;
	}

	return undefined;
};

export const extractMessageBusAction = (input: unknown): string | undefined => {
	const extracted: string | undefined = typeof input === "object"
		&& input !== null
		&& "action" in input
		&& typeof input.action === "string"
		? input.action
		: undefined;

	return extracted;
};

export const extractMessageBusResponseDatum = (input: unknown): MessageBusCallbackResponse => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const extracted: MessageBusCallbackResponse = typeof input === "object"
		&& input !== null
		&& "datum" in input
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		? (input.datum as any)
		: undefined;

	return extracted;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const pickDefinedResponse = (message: JsonValue, responses: MessageBusCallbackResponse[]): MessageBusCallbackResponse => {
	let response: MessageBusCallbackResponse;

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	const definedResponses: JsonValue[] = responses.filter((response): response is JsonValue => response !== undefined);

	if (definedResponses.length === 0) {
		response = undefined;
	} else if (definedResponses.length === 1) {
		response = definedResponses[0];
	} else {
		response = definedResponses[0];

		// NOTE: chrome.runtime.sendMessage() is expected to internally disallow more than one response; other implementations need to adhere to this limitation.
		void logWarn("pickDefinedResponse", "Received more than one response; returning only the first array element.", message, response, definedResponses);
	}

	return response;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const pickRelevantResponse = (message: JsonValue, responses: MessageBusCallbackResponse[]): MessageBusCallbackResponse => {
	let response: MessageBusCallbackResponse;

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	const definedResponses: JsonValue[] = responses.filter((response): response is JsonValue => response !== undefined);

	if (definedResponses.length === 0) {
		response = undefined;
	} else if (definedResponses.length === 1) {
		response = definedResponses[0];
	} else {
		// NOTE: pick the first non-null response, otherwise -- since all values are null -- null.
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const firstNonNullOrNull = definedResponses.find((response) => response !== TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE)
			?? TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE;

		// NOTE: chrome.runtime.sendMessage() is expected to internally disallow more than one response; other implementations need to adhere to this limitation.
		void logWarn("pickRelevantResponse", "Received more than one response; returning only the first array element.", message, firstNonNullOrNull, definedResponses);

		response = firstNonNullOrNull;
	}

	return response;
};
