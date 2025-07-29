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
	type JsonValue,
} from "type-fest";

import {
	type MessageBusContextTag,
} from "./imessage-bus.mjs";

/**
 * Use as an intent marker instead of literal null.
 */
export const TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE = null;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type MessageBusNotification = (message: JsonValue) => void;

export type MessageBusRequest = JsonValue | typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE | undefined;
export type MessageBusCallbackResponse = JsonValue | typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE | undefined;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export type MessageBusCallback = (message: JsonValue) => Promise<MessageBusCallbackResponse>;

export interface MessageBusCallbackInContext extends MessageBusCallback, MessageBusContextTag {}

export interface IMessageBusEvent<
	Message extends JsonValue = JsonValue,
	Response extends MessageBusCallbackResponse = MessageBusCallbackResponse,
	Callback extends (message: Message) => Promise<Response> = (message: Message) => Promise<Response>,
> {
	// TODO: include message filtering?
	addListener(callback: Callback): void;
	removeListener(callback: Callback): void;
	hasListener(callback: Callback): boolean;

	// NOTE: firefox does not seem to support chrome.runtime.onMessage.hasListeners(), despite seemingly using standardized typing for browser events and references to being implemented in chrome?
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
	// https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
	// https://developer.chrome.com/docs/extensions/reference/api/events#method-Event-hasListeners
	// NOTE: keeping current implementations, but with an underscore prefix.
	// eslint-disable-next-line @typescript-eslint/member-ordering
	hasListeners: undefined;
	_hasListeners(): boolean;
}

export interface IMessageBusEventProvider<
	Message extends JsonValue = JsonValue,
	Response extends MessageBusCallbackResponse = MessageBusCallbackResponse,
	Callback extends (message: Message) => Promise<Response> = (message: Message) => Promise<Response>,
> extends IMessageBusEvent<Message, Response, Callback> {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	dispatch(message: Readonly<JsonValue>): Array<ReturnType<MessageBusCallback>>;
}

export type IMessageBusProviderConstructor = new() => IMessageBusProvider;

export interface IMessageBusProvider {
	// TODO: include message filtering?
	onMessage: IMessageBusEvent;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	sendMessage(message: JsonValue): Promise<MessageBusCallbackResponse>;
}

export interface IMessageBusProviderGetter {
	messageBusProvider: Promise<IMessageBusProvider>;
}
