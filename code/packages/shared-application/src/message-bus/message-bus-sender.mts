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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import type {
	MessageBusMessage,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	MessageBusCallbackResponse,
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import MessageBusBase from "./message-bus-base.mjs";

export default abstract class MessageBusSender extends MessageBusBase {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	protected async _sendMessage(messageDatum?: MessageBusRequest): Promise<MessageBusCallbackResponse> {
		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		const messsageDatumClone = messageDatum === undefined ? undefined : jsonClone(messageDatum);

		const messageBusMessage: MessageBusMessage = this._assembleMessage(messsageDatumClone);
		const messageBusProvider = await this.messageBusProviderGetter.messageBusProvider;
		const assembledResponse = await messageBusProvider.sendMessage(messageBusMessage);
		const rawResponseDatum = this._disassembleMessage(assembledResponse);

		// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
		const responseDatumClone = rawResponseDatum === undefined ? undefined : jsonClone(rawResponseDatum);

		return responseDatumClone;
	}
}
