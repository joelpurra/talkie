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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	promiseTimeout,
} from "@talkie/shared-application-helpers/promise.mjs";
import type {
	MessageBusCallbackResponse,
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	Runtime,
} from "webextension-polyfill";

import CountingPortConnectorProvider from "./counting-port-connector-provider.mjs";

export default class RespondingPortConnectorProvider extends CountingPortConnectorProvider {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async postMessageAndAwaitResponse(rawMessage: MessageBusRequest, timeoutMilliseconds = 1000): Promise<MessageBusCallbackResponse> {
		await this.assertIsConnected();

		const singleResponse = new Promise<MessageBusCallbackResponse>((resolve, reject) => {
			let responded = false;

			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			const singleResponseListener = (response: MessageBusCallbackResponse, port: Runtime.Port) => {
				if (responded) {
					// NOTE: too late to reject the promise; hopefully caught by general error handlers.
					throw new Error(`Only one response allowed per message: ${JSON.stringify(rawMessage, null, 0)}, discarded response: ${JSON.stringify(response, null, 0)}`);
				}

				responded = true;

				if (port.name !== this.portName) {
					reject(new Error(`Port did not match by name: expected ${JSON.stringify(this.portName, null, 0)}, received ${JSON.stringify(port.name, null, 0)}.`));

					return;
				}

				if (!port.onMessage.hasListener(singleResponseListener)) {
					reject(new Error(`The response listener was not registered on the port: ${port.name}`));

					return;
				}

				port.onMessage.removeListener(singleResponseListener);

				resolve(response);
			};

			this._port!.onMessage.addListener(singleResponseListener);

			// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
			const messageClone = rawMessage === undefined ? undefined : jsonClone(rawMessage);

			this._port!.postMessage(messageClone);
		});

		return promiseTimeout(singleResponse, timeoutMilliseconds);
	}
}
