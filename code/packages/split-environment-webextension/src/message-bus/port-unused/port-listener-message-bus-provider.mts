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
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusEvent,
	IMessageBusProvider,
	MessageBusCallbackResponse,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

import type RespondingPortListenerProvider from "./responding-port-listener-provider.mjs";

export default class PortListenerMessageBusProvider implements IMessageBusProvider {
	constructor(
		private readonly _respondingPortListenerProvider: RespondingPortListenerProvider,
		public readonly onMessage: IMessageBusEvent,
	) {}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async sendMessage(message: JsonValue): Promise<MessageBusCallbackResponse> {
		try {
			// NOTE: chrome.runtime.sendMessage() is expected to internally disallow more than one response; other implementations need to adhere to this limitation.
			return await this._respondingPortListenerProvider.postMessageAndAwaitResponse(message);
		} catch (error: unknown) {
			void logError(this.constructor.name, "Error in the message handler(s); caught and swallowed, returning undefined.", message, error);

			return undefined;
		}
	}
}
