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
import {
	eventToPromise,
} from "@talkie/browser-shared/shared-frontend.mjs";

import SuspensionListenerManager from "./suspension-listener-manager.mjs";

const dualLogger = new DualLogger("stayalive.js");

const suspensionListenerManager = new SuspensionListenerManager();

const startStayAliveListener = async () => suspensionListenerManager.start();

const stopStayAliveListener = async () => {
	try {
		await suspensionListenerManager.stop();
	} catch (error: unknown) {
		// NOTE: swallowing errors.
		void dualLogger.dualLogError("stopStayAliveListener", "Swallowing error", error);
	}
};

export const redundantlyTriggerLoadingVoices = async (): Promise<SpeechSynthesisVoice[]> =>
	// HACK: trigger loading the voices from somewhere other than the background script, since the
	// background context in Chrome (on Linux) does not seem to load any voices (ever?) in some
	// cases (in particular noticeable during testing using a temporary browser profile).
	window.speechSynthesis.getVoices();
const start = async () => {
	void redundantlyTriggerLoadingVoices();
	await startStayAliveListener();
};

const stop = async () => {
	// NOTE: stopping probably won't be correctly executed as before/unload doesn't guarantee asynchronous calls.
	await stopStayAliveListener();
};

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("beforeunload", eventToPromise.bind(null, stop));
