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
	MessageBusDirectionPairing,
	MessageBusResponseMode,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	type JsonValue,
} from "type-fest";

import MessageBusSender from "./message-bus-sender.mjs";

export default class MessageBusRequester extends MessageBusSender {
	protected override get responseMode(): MessageBusResponseMode {
		return "response:required";
	}

	protected override get inboundDirection(): MessageBusDirectionPairing {
		return "direction:request:inbound:response";
	}

	protected override get outboundDirection(): MessageBusDirectionPairing {
		return "direction:request:outbound:request";
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async bespeak(data?: MessageBusRequest): Promise<JsonValue> {
		const response = await this._sendMessage(data);

		if (response !== undefined) {
			return response;
		}

		throw new Error(`bespeak only allows a defined response: ${JSON.stringify(data, null, 0)} ${JSON.stringify(response, null, 0)}`);
	}
}
