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
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	IStartStop,
} from "@talkie/split-environment-interfaces/istart-stop.mjs";
import {
	type JsonValue,
} from "type-fest";

import {
	extractMessageBusAction,
} from "./message-bus-helper.mjs";

export default class MessageBusInspector implements IStartStop {
	private readonly _onMessageHandlerBound: typeof this._onMessageHandler;

	private readonly _ignoredActions = [
		// NOTE: skip logging for noisy actions.
		"broadcaster:progress:update",
	];

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	constructor(private readonly messageBusProviderGetter: IMessageBusProviderGetter, private readonly logger: (...args: unknown[]) => Promise<void> | void = logDebug) {
		this._onMessageHandlerBound = this._onMessageHandler.bind(this);
	}

	public async start(): Promise<void> {
		const messageBusProvider = await this.messageBusProviderGetter.messageBusProvider;
		messageBusProvider.onMessage.addListener(this._onMessageHandlerBound);
	}

	public async stop(): Promise<void> {
		const messageBusProvider = await this.messageBusProviderGetter.messageBusProvider;
		messageBusProvider.onMessage.removeListener(this._onMessageHandlerBound);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	private async _onMessageHandler(message: JsonValue): Promise<undefined> {
		const messageAction = extractMessageBusAction(message);

		if (typeof messageAction === "string" && this._ignoredActions.includes(messageAction)) {
			return;
		}

		void this.logger("MessageBusInspector", JSON.stringify(message, null, 0));

		return undefined;
	}
}
