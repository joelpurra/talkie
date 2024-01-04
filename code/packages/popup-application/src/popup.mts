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

import DualLogger from "@talkie/browser-shared/dual-log.mjs";
import redundantlyTriggerLoadingVoices from "@talkie/browser-shared/redundantly-trigger-loading-voices.mjs";
import {
	eventToPromise,
	startReactFrontend,
	stopReactFrontend,
} from "@talkie/browser-shared/shared-frontend.mjs";
import {
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling.mjs";
import {
	getTalkieServices,
} from "@talkie/split-environment-webextension/browser-specific/tabs.mjs";

import hydrate from "./hydrate.mjs";

// NOTE: earliest possible voice load trigger.
void redundantlyTriggerLoadingVoices();

const dualLogger = new DualLogger("popup.js");

const passClickToBackground = async () => {
	void dualLogger.dualLogDebug("Start", "passClickToBackground");

	try {
		const talkieServices = await getTalkieServices();

		await talkieServices.iconClick();

		void dualLogger.dualLogDebug("Done", "passClickToBackground");
	} catch (error: unknown) {
		void dualLogger.dualLogError("passClickToBackground", error);

		throw error;
	}
};

const passClickToBackgroundOnLoad = async () => passClickToBackground();

const start = async () => {
	await startReactFrontend();
	await passClickToBackgroundOnLoad();
	await hydrate();
};

const stop = async () => {
	// NOTE: stopping probably won't be correctly executed as before/unload doesn't guarantee asynchronous calls.
	await stopReactFrontend();
};

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("beforeunload", eventToPromise.bind(null, stop));
