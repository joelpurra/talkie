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
	IMessageBusEventProvider,
	IMessageBusProvider,
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import InternalMessageBusProvider from "@talkie/shared-application/message-bus/internal-message-bus-provider.mjs";
import SameContextMessageBusEventProvider from "@talkie/shared-application/message-bus/same-context-message-bus-event-provider.mjs";
import SplitContextMessageBusProvider from "@talkie/shared-application/message-bus/split-context-message-bus-provider.mjs";

// eslint-disable-next-line import-x/no-unassigned-import
import "../../browser-specific/global-window-talkie-shared-context.mjs";

export default class MessageBusProviderGetter implements IMessageBusProviderGetter {
	private readonly _messageBusProviderPromise: Promise<IMessageBusProvider>;

	public get messageBusProvider(): Promise<IMessageBusProvider> {
		return this._messageBusProviderPromise;
	}

	constructor(private readonly otherContextsMessageBusProviderGetter: IMessageBusProviderGetter) {
		// NOTE: kicking off singleton setup early, but will (can) not await.
		// TODO: implement IStartStop to cleanly handle setup/teardown?
		this._messageBusProviderPromise = this._createAndStartMessageBus();
	}

	private async _createAndStartMessageBus(): Promise<IMessageBusProvider> {
		// TODO: move instantiation out of the class?
		// NOTE: responsible for intra-context messages.
		const sameContextMessageBusEventProvider: IMessageBusEventProvider = new SameContextMessageBusEventProvider();
		const sameContextMessageBusProvider: IMessageBusProvider = new InternalMessageBusProvider(sameContextMessageBusEventProvider);

		// NOTE: The Best of Both Worlds<TM>: capable of both intra- and inter-context communication.
		const splitContextMessageBusProvider = new SplitContextMessageBusProvider(
			sameContextMessageBusProvider,
			// NOTE: responsible for inter-context messages.
			this.otherContextsMessageBusProviderGetter,
		);

		// TODO: implement IStartStop.stop() to cleanly handle teardown.
		await splitContextMessageBusProvider.start();

		return splitContextMessageBusProvider;
	}
}
