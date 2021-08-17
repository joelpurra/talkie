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
	logInfo,
	logWarn,
} from "@talkie/shared-application-helpers/log";
import {
	ReadonlyDeep,
} from "type-fest";

const handleUnhandledRejection = (event: ReadonlyDeep<PromiseRejectionEvent>) => {
	void logWarn("Unhandled rejection", "Error", event.reason, event.promise, event);
	void logInfo("Starting debugger, if attached.");

	// eslint-disable-next-line no-debugger
	debugger;
};

export const registerUnhandledRejectionHandler = (): void => {
	// TODO: register handlers for additional error-like events on window?
	// TODO: are there any extension-specific error events?
	// "error"
	// "messageerror"
	// "securitypolicyviolation"
	window.addEventListener("unhandledrejection", handleUnhandledRejection);
};
