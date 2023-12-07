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

import getFrontendMessageBus from "@talkie/browser-shared/hydrate/get-frontend-message-bus.mjs";
import redundantlyTriggerLoadingVoices from "@talkie/browser-shared/redundantly-trigger-loading-voices.mjs";
import {
	eventToPromiseSingle,
	startReactFrontend,
	stopReactFrontend,
} from "@talkie/browser-shared/shared-frontend.mjs";
import {
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling.mjs";
import {
	betoken,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import hydrate from "./hydrate.mjs";

// NOTE: earliest possible voice load trigger.
void redundantlyTriggerLoadingVoices();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const passClickToBackground = async (messageBusProviderGetter: IMessageBusProviderGetter) => {
	void logDebug("Start", "passClickToBackground");

	try {
		await betoken(messageBusProviderGetter, "extension:icon-click");

		void logDebug("Done", "passClickToBackground");
	} catch (error: unknown) {
		void logError("passClickToBackground", error);

		throw error;
	}
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const passClickToBackgroundOnLoad = async (messageBusProviderGetter: IMessageBusProviderGetter) => passClickToBackground(messageBusProviderGetter);

const start = async () => {
	await startReactFrontend();

	const messageBusProviderGetter = await getFrontendMessageBus();

	await passClickToBackgroundOnLoad(messageBusProviderGetter);
	await hydrate(messageBusProviderGetter);
};

const stop = async () => {
	// NOTE: stopping probably won't be correctly executed as before/unload doesn't guarantee asynchronous calls.
	await stopReactFrontend();
};

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromiseSingle.bind(null, start));
window.addEventListener("beforeunload", eventToPromiseSingle.bind(null, stop));
