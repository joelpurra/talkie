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
	bespeak,
	betoken,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";
import type {
	MessageBusAction,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	IMessageBusProviderGetter,
	TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

export default abstract class MessageBusGroundworkBase {
	constructor(protected readonly messageBusProviderGetter: IMessageBusProviderGetter) {}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async betoken(action: MessageBusAction, message?: JsonValue): Promise<typeof TALKIE_MESSAGE_BUS_HANDLER_DONE_RESPONSE> {
		// HACK: assuming that errors are due to message bus issues; retrying from the frontend;
		for (let attempt = 1; attempt <= 10; attempt++) {
			try {
				// NOTE: awaiting handling also for the case when there will be no response, because it can easily be avoided by the caller.
				// eslint-disable-next-line no-await-in-loop
				return await betoken(this.messageBusProviderGetter, action, message);
			} catch (error: unknown) {
				void logError(`Failed to betoken() on attempt ${attempt}; assuming it was temporary.`, message, error);
			} finally {
				// HACK: always wait for "all" listeners to register.
				// eslint-disable-next-line no-await-in-loop
				await promiseDelay(100);
			}
		}

		throw new Error(`Failed to betoken(); giving up. ${JSON.stringify(message, null, 0)}`);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	public async bespeak<Response extends JsonValue = JsonValue>(action: MessageBusAction, message?: JsonValue): Promise<Response> {
		// HACK: assuming that errors are due to message bus issues; retrying from the frontend;
		for (let attempt = 1; attempt <= 10; attempt++) {
			try {
				// NOTE: awaiting handling also for the case when there will be no response, because it can easily be avoided by the caller.
				// eslint-disable-next-line no-await-in-loop
				return await (bespeak(this.messageBusProviderGetter, action, message) as Promise<Response>);
			} catch (error: unknown) {
				void logError(`Failed to bespeak() on attempt ${attempt}; assuming it was temporary.`, message, error);
			} finally {
				// HACK: always wait for "all" listeners to register.
				// eslint-disable-next-line no-await-in-loop
				await promiseDelay(100);
			}
		}

		throw new Error(`Failed to bespeak(); giving up. ${JSON.stringify(message, null, 0)}`);
	}
}
