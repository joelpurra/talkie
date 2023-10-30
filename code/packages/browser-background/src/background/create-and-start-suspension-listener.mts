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
	loggedPromiseCallback,
} from "@talkie/shared-application/promise-logging.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import type TalkieBackground from "../talkie-background.mjs";

const createAndStartSuspensionListener = async (talkieBackground: ReadonlyDeep<TalkieBackground>): Promise<void> => {
	// NOTE: enabled but non-functional in Firefox v100, supported in Firefox v106+.
	// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
	if ("onSuspend" in browser.runtime) {
		browser.runtime.onSuspend.addListener(
			loggedPromiseCallback(
				async () => talkieBackground.onExtensionSuspendHandler(),
				"onSuspend",
			),
		);
		/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */

		// browser.runtime.onSuspend.addListener(loggedPromise(
		// "onSuspend",
		// () => suspensionManager.uninitialize())
		// );
	}

	// NOTE: not supported in Firefox (2017-04-28).
	// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
	// if ("onSuspendCanceled" in browser.runtime) {
	// browser.runtime.onSuspendCanceled.addListener(loggedPromise(
	// "onSuspendCanceled",
	// async () => suspensionManager.initialize()),
	//  );
	// }
};

export default createAndStartSuspensionListener;
