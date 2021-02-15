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

import DualLogger from "../frontend/dual-log";
import {
	eventToPromise,
	startReactFrontend,
	stopReactFrontend,
} from "../frontend/shared-frontend";
import {
	registerUnhandledRejectionHandler,
} from "../shared/error-handling";
import {
	getBackgroundPage,
} from "../shared/tabs";
import loadRoot from "./load-root.jsx";

const dualLogger = new DualLogger("popup.js");

const passClickToBackground = async () => {
	dualLogger.dualLogDebug("Start", "passClickToBackground");

	try {
		const background = await getBackgroundPage();

		await background.iconClick();

		dualLogger.dualLogDebug("Done", "passClickToBackground");
	} catch (error) {
		dualLogger.dualLogError("passClickToBackground", error);

		throw error;
	}
};

const shouldPassClickOnLoad = () => {
	const containsBlockerString = document.location
		&& typeof document.location.search === "string"
		&& document.location.search.length > 0
		&& document.location.search.includes("passclick=false");

	return !containsBlockerString;
};

const passClickToBackgroundOnLoad = async () => {
	// NOTE: provide a way to link to the popup without triggering the "click".
	if (!shouldPassClickOnLoad()) {
		dualLogger.dualLogDebug("Skipped", "passClickToBackgroundOnLoad");

		return;
	}

	return passClickToBackground();
};

const start = async () => {
	await startReactFrontend();
	await passClickToBackgroundOnLoad();
	await loadRoot();
};

const stop = async () => {
	// NOTE: stopping probably won't be correctly executed as before/unload doesn't guarantee asynchronous calls.
	await stopReactFrontend();
};

registerUnhandledRejectionHandler();

document.addEventListener("DOMContentLoaded", eventToPromise.bind(null, start));
window.addEventListener("beforeunload", eventToPromise.bind(null, stop));
