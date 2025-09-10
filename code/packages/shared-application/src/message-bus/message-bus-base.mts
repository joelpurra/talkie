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
	IMessageBusProviderGetter,
	MessageBusCallbackResponse,
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import {
	getRandomInt,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	type MessageBusAction,
	type MessageBusDirectionPairing,
	type MessageBusMessage,
	type MessageBusResponseMode,
	TALKIE_MESSAGE_BUS_IDENTIFIER,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";

import {
	isValidMessageBusMessage,
} from "./message-bus-helper.mjs";

export default abstract class MessageBusBase {
	private outgoingMessageCounter = 0;

	protected get _talkieMessageIncrementer(): number {
		// TODO: monotonically increasing value.
		// NOTE: the value is incremented each time it is being *read*, but not only here.
		return this._talkieMessageIdentifierBase + this.outgoingMessageCounter++;
	}

	// TODO: randomized starting value shifted by 10^N to make it human-readable.
	private readonly _talkieMessageIdentifierBase: number = getRandomInt(1000, 10_000) * (10 ** 6);

	protected abstract get responseMode(): MessageBusResponseMode;
	protected abstract get inboundDirection(): MessageBusDirectionPairing;
	protected abstract get outboundDirection(): MessageBusDirectionPairing;

	constructor(protected readonly action: MessageBusAction, protected readonly messageBusProviderGetter: IMessageBusProviderGetter) {}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	protected _assembleMessage(datum?: MessageBusRequest): MessageBusMessage {
		let messageBusMessage: MessageBusMessage = {
			_talkieIdentifier: TALKIE_MESSAGE_BUS_IDENTIFIER,
			_talkieMessageIdentifier: this._talkieMessageIncrementer,
			action: this.action,
			direction: this.outboundDirection,
			responseMode: this.responseMode,
		};

		if (datum !== undefined) {
			messageBusMessage = {
				datum,
				...messageBusMessage,
			};
		}

		return messageBusMessage;
	}

	protected _disassembleMessage(assembledResponse: unknown): MessageBusCallbackResponse {
		// NOTE: accepting "completely undefined" messages as "valid", since they are technically required to be able to handle message bus quirks for each browser.
		if (assembledResponse === undefined) {
			return undefined;
		}

		// TODO: more specific errors for empty messages, mismatching direction/identifiers, etcetera.
		const isValid = isValidMessageBusMessage(assembledResponse, this.inboundDirection);

		if (!isValid) {
			throw new Error(`Received an invalid response to ${this.action} message: ${JSON.stringify(assembledResponse, null, 0)}.`);
		}

		if (assembledResponse.action !== this.action) {
			throw new Error(`Expected a response to ${this.action} but did not: ${JSON.stringify(assembledResponse, null, 0)}.`);
		}

		const {
			datum,
		} = assembledResponse;

		if (datum === undefined) {
			throw new Error(`Expected a response to ${this.action} but received undefined or non-existent datum: ${JSON.stringify(assembledResponse, null, 0)}.`);
		}

		return datum;
	}
}
