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

import type {
	IMessageBusProviderGetter,
	MessageBusRequest,
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	MessageBusAction,
	MessageBusActionHandler,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	JsonValue,
	Promisable,
} from "type-fest";

import {
	type UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";

import MessageBusBullhorn from "./message-bus-bullhorn.mjs";
import MessageBusCrowdee from "./message-bus-crowdee.mjs";
import MessageBusReactor from "./message-bus-reactor.mjs";
import MessageBusRequester from "./message-bus-requester.mjs";
import MessageBusResponder from "./message-bus-responder.mjs";
import MessageBusSimplexer from "./message-bus-simplexer.mjs";

export interface IMessageBusListenerHelpers {
	bullhorn: <T extends MessageBusRequest = MessageBusRequest>(action: MessageBusAction, message?: T) => Promisable<void>;
	betoken: <T extends MessageBusRequest = MessageBusRequest>(action: MessageBusAction, message?: T) => Promisable<typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE>;
	bespeak: <T extends MessageBusRequest = MessageBusRequest>(action: MessageBusAction, message?: T) => Promisable<JsonValue>;
	startReactor: <T extends MessageBusRequest = MessageBusRequest>(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerReactor<T>
	) => Promise<UninitializerCallback[]>;
	startResponder: <T extends MessageBusRequest = MessageBusRequest>(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerResponder<T>
	) => Promise<UninitializerCallback[]>;
	startCrowdee: <T extends MessageBusRequest = MessageBusRequest>(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>
	) => Promise<UninitializerCallback[]>;
}

export type FakeMessageBusActionHandlerCrowdee<T extends MessageBusRequest = MessageBusRequest> = (action: MessageBusAction, message: T) => Promisable<void>;
export type FakeMessageBusActionHandlerReactor<T extends MessageBusRequest = MessageBusRequest> = (action: MessageBusAction, message: T) => Promisable<typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE>;
export type FakeMessageBusActionHandlerResponder<T extends MessageBusRequest = MessageBusRequest> = (action: MessageBusAction, message: T) => Promisable<JsonValue>;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const bullhorn = async <T extends MessageBusRequest = MessageBusRequest>(messageBusProviderGetter: IMessageBusProviderGetter, action: MessageBusAction, message?: T): Promise<void> => {
	const messageBusBullhorn = new MessageBusBullhorn(action, messageBusProviderGetter);

	return messageBusBullhorn.bullhorn(message);
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const bespeak = async <T extends MessageBusRequest = MessageBusRequest>(messageBusProviderGetter: IMessageBusProviderGetter, action: MessageBusAction, message?: T): Promise<JsonValue> => {
	const messageBusRequester = new MessageBusRequester(action, messageBusProviderGetter);

	return messageBusRequester.bespeak(message);
};

export const betoken = async <T extends MessageBusRequest = MessageBusRequest>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
	action: MessageBusAction,
	message?: T,
): Promise<typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE> => {
	const messageBusSimplexer = new MessageBusSimplexer(action, messageBusProviderGetter);

	return messageBusSimplexer.betoken(message);
};

export const startReactor = async <T extends MessageBusRequest = MessageBusRequest>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	actions: MessageBusAction[] | MessageBusAction,
	messageHandler: FakeMessageBusActionHandlerReactor<T>,
): Promise<UninitializerCallback[]> => {
	const flattenedActions: MessageBusAction[] = [
		actions,
	].flat();

	return Promise.all(flattenedActions.map((async (action) => {
		const messageBusReactor = new MessageBusReactor(action, messageBusProviderGetter, messageHandler as MessageBusActionHandler);
		await messageBusReactor.start();

		return async () => messageBusReactor.stop();
	})));
};

export const startResponder = async <T extends MessageBusRequest = MessageBusRequest>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	actions: MessageBusAction[] | MessageBusAction,
	messageHandler: FakeMessageBusActionHandlerResponder<T>,
): Promise<UninitializerCallback[]> => {
	const flattenedActions: MessageBusAction[] = [
		actions,
	].flat();

	return Promise.all(flattenedActions.map((async (action) => {
		const messageBusResponder = new MessageBusResponder(action, messageBusProviderGetter, messageHandler as MessageBusActionHandler);
		await messageBusResponder.start();

		return async () => messageBusResponder.stop();
	})));
};

export const startCrowdee = async <T extends MessageBusRequest = MessageBusRequest>(
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	actions: MessageBusAction[] | MessageBusAction,
	messageHandler: FakeMessageBusActionHandlerCrowdee<T>,
): Promise<UninitializerCallback[]> => {
	const flattenedActions: MessageBusAction[] = [
		actions,
	].flat();

	return Promise.all(flattenedActions.map((async (action) => {
		const messageBusCrowdee = new MessageBusCrowdee(action, messageBusProviderGetter, messageHandler as MessageBusActionHandler);
		await messageBusCrowdee.start();

		return async () => messageBusCrowdee.stop();
	})));
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const createMessageBusListenerHelpers = (messageBusProviderGetter: IMessageBusProviderGetter): IMessageBusListenerHelpers => ({
	bespeak: bespeak.bind(undefined, messageBusProviderGetter),
	betoken: betoken.bind(undefined, messageBusProviderGetter),
	bullhorn: bullhorn.bind(undefined, messageBusProviderGetter),
	startCrowdee: startCrowdee.bind(undefined, messageBusProviderGetter) as IMessageBusListenerHelpers["startCrowdee"],
	startReactor: startReactor.bind(undefined, messageBusProviderGetter) as IMessageBusListenerHelpers["startReactor"],
	startResponder: startResponder.bind(undefined, messageBusProviderGetter) as IMessageBusListenerHelpers["startResponder"],
});

export default createMessageBusListenerHelpers;
