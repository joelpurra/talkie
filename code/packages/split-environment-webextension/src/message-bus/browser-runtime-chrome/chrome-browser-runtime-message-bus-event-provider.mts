/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	IMessageBusEvent,
	MessageBusCallback,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import chromeAsyncSelectiveSendResponseMessageHandlerWrapper from "./chrome-async-selective-send-response-message-handler-wrapper.mjs";

export default class ChromeBrowserRuntimeMessageBusEventProvider implements IMessageBusEvent {
	public readonly hasListeners: undefined = undefined;

	private readonly _listenerWrapperMap = new Map<MessageBusCallback, typeof chromeAsyncSelectiveSendResponseMessageHandlerWrapper>();

	public addListener(callback: MessageBusCallback): void {
		const wrapper = chromeAsyncSelectiveSendResponseMessageHandlerWrapper.bind(callback);
		this._listenerWrapperMap.set(callback, wrapper);
		chrome.runtime.onMessage.addListener(wrapper);
	}

	public removeListener(callback: MessageBusCallback): void {
		const wrapper = this._listenerWrapperMap.get(callback);

		if (wrapper) {
			chrome.runtime.onMessage.removeListener(wrapper);
		}

		this._listenerWrapperMap.delete(callback);
	}

	public hasListener(callback: MessageBusCallback): boolean {
		const wrapper = this._listenerWrapperMap.get(callback);

		if (!wrapper) {
			return false;
		}

		return chrome.runtime.onMessage.hasListener(wrapper);
	}

	public _hasListeners(): boolean {
		// NOTE: firefox does not seem to support chrome.runtime.onMessage.hasListeners(), despite seemingly using standardized typing for browser events and references to being implemented in chrome?
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage
		// https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
		// https://developer.chrome.com/docs/extensions/reference/api/events#method-Event-hasListeners
		// NOTE: keeping current implementations, but with an underscore prefix.
		//return chrome.runtime.onMessage.hasListener();
		throw new Error("chrome.runtime.onMessage.hasListener() has not been consistently implemented by browsers.");
	}
}
