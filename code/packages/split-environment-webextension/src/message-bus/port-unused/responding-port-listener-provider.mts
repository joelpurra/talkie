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
import type {
	MessageBusCallbackResponse,
	MessageBusRequest,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	Runtime,
} from "webextension-polyfill";

import PortListenerProvider from "./port-listener-provider.mjs";

export default class RespondingPortListenerProvider extends PortListenerProvider {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async postMessageAndAwaitResponse(rawMessage: MessageBusRequest): Promise<MessageBusCallbackResponse> {
		const singleResponse = new Promise<MessageBusCallbackResponse>((resolve, reject) => {
			let responded = false;

			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			const singleResponseListener = (rawResponse: MessageBusCallbackResponse, port: Runtime.Port) => {
			// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
				const responseClone = rawResponse === undefined ? undefined : jsonClone(rawResponse);

				if (responded) {
					// NOTE: too late to reject the promise; hopefully caught by general error handlers.
					throw new Error(`Only one response allowed per message: ${JSON.stringify(rawMessage, null, 0)}, discarded response: ${JSON.stringify(responseClone, null, 0)}`);
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

				if (responseClone !== undefined) {
					resolve(responseClone);
				}

				// NOTE: do not resolve with an undefined response; await and evaluate the next response(s).
			};

			for (const weakPort of this._weakPorts) {
				const storedPort = weakPort.deref();

				if (storedPort === undefined) {
					this._weakPorts.delete(weakPort);
				} else {
					storedPort.onMessage.addListener(singleResponseListener);

					// HACK: on the lowest transport level, explicitly serialize/deserialize data (in particular non-primitives) sent to/from (possibly) external contexts, to avoid references dying ("can't access dead object").
					const messageClone = rawMessage === undefined ? undefined : jsonClone(rawMessage);

					storedPort.postMessage(messageClone);
				}
			}
		});

		// TODO: timeout in case the other end disappears.
		//return promiseTimeout(singleResponse, timeoutMilliseconds);
		return singleResponse;
	}
}
