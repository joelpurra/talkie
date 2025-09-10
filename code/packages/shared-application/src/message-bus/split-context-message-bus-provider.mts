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
	IMessageBusProvider,
	IMessageBusProviderGetter,
	MessageBusCallbackResponse,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	IStartStop,
} from "@talkie/split-environment-interfaces/istart-stop.mjs";
import type {
	JsonObject,
	JsonValue,
} from "type-fest";

import {
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logInfo,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";

import {
	assertIsNotInMessageBusContext,
	getGlobalTalkieContextIdentifier,
	isNoListenersError,
	pickDefinedResponse,
	tagMessage,
	tagMessageBusCallbackFn,
} from "./message-bus-helper.mjs";

export default class SplitContextMessageBusProvider implements IMessageBusProvider, IStartStop {
	public readonly onMessage: IMessageBusEvent;

	private _forwardMessagesFromOtherContextsBound: typeof this._forwardMessagesFromOtherContexts | null = null;

	constructor(
		private readonly sameContextMessageBusProvider: IMessageBusProvider,
		private readonly otherContextsMessageBusProviderGetter: IMessageBusProviderGetter,
	) {
		// NOTE: regular listeners register only to the same-context event.
		this.onMessage = this.sameContextMessageBusProvider.onMessage;
	}

	async start(): Promise<void> {
		this._assertIsStopped();

		const talkieContextIdentifier = getGlobalTalkieContextIdentifier();

		this._forwardMessagesFromOtherContextsBound = typeof talkieContextIdentifier === "string"
			? tagMessageBusCallbackFn(talkieContextIdentifier, this._forwardMessagesFromOtherContexts.bind(this))
			: this._forwardMessagesFromOtherContexts.bind(this);

		await this._registerListener();
	}

	async stop(): Promise<void> {
		this._assertIsStarted();

		const otherContextsMessageBusProvider = await this.otherContextsMessageBusProviderGetter.messageBusProvider;

		// NOTE: forward messages from "other" contexts to the internal context.
		otherContextsMessageBusProvider.onMessage.removeListener(this._forwardMessagesFromOtherContextsBound!);

		this._forwardMessagesFromOtherContextsBound = null;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async sendMessage(rawMessage: JsonValue): Promise<MessageBusCallbackResponse> {
		if (rawMessage === undefined) {
			throw new TypeError("rawMessage is undefined");
		}

		this._assertIsStarted();
		await this._ensureListenerIsRegistered();

		const otherContextsMessageBusProvider = await this.otherContextsMessageBusProviderGetter.messageBusProvider;

		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		// TODO: reduce jsonClone() use in message bus.
		const messageClone = jsonClone(rawMessage);

		if (typeof messageClone === "object" && messageClone !== null) {
			// HACK: modify the message to include sender context.
			assertIsNotInMessageBusContext(messageClone);

			const talkieContextIdentifier = getGlobalTalkieContextIdentifier();

			if (talkieContextIdentifier) {
				tagMessage(talkieContextIdentifier, messageClone as JsonObject);
			}
		}

		const rawResponses: MessageBusCallbackResponse[] = await Promise.all([
			// TODO: there may only be internal or only external listeners (endpoints); check first, since the builtin message systems (may) throw.
			this.sameContextMessageBusProvider.sendMessage(messageClone),
			otherContextsMessageBusProvider.sendMessage(messageClone),
		]);

		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		// TODO: reduce jsonClone() use in message bus.
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const clonedResponses: MessageBusCallbackResponse[] = rawResponses.map((response) => response === undefined ? undefined : jsonClone(response));

		return pickDefinedResponse(messageClone, clonedResponses);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	private async _forwardMessagesFromOtherContexts(message: JsonValue): Promise<MessageBusCallbackResponse> {
		this._assertIsStarted();

		try {
			return await this.sameContextMessageBusProvider.sendMessage(message);
		} catch (error: unknown) {
			if (isNoListenersError(error)) {
				// TODO: because of the cross-messaging implementation, which always sends messages everywhere, ignore missing other-context listeners.
				void logWarn(this.constructor.name, "Connection error in the message handler(s); swallowing.", message, error);

				return undefined;
			}

			throw error;
		}
	}

	private _assertIsStarted() {
		if (this._forwardMessagesFromOtherContextsBound === null) {
			throw new Error("Instance was not started.");
		}
	}

	private _assertIsStopped() {
		if (this._forwardMessagesFromOtherContextsBound !== null) {
			throw new Error("Instance was already started.");
		}
	}

	private async _registerListener() {
		const otherContextsMessageBusProvider = await this.otherContextsMessageBusProviderGetter.messageBusProvider;

		// NOTE: propagate messages from "other" contexts to the internal context listeners.
		otherContextsMessageBusProvider.onMessage.addListener(this._forwardMessagesFromOtherContextsBound!);
	}

	private async _ensureListenerIsRegistered(): Promise<void> {
		const otherContextsMessageBusProvider = await this.otherContextsMessageBusProviderGetter.messageBusProvider;

		// NOTE: may need to re-register in case the "other" contexts has disappeared.
		if (!otherContextsMessageBusProvider.onMessage.hasListener(this._forwardMessagesFromOtherContextsBound!)) {
			void logInfo("Could not find previous listener; re-registering the messsage listener for other contexts.");

			await this._registerListener();
		}
	}
}
