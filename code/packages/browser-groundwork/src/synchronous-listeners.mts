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

import type {
	OnInstallEvent,
} from "@talkie/browser-bricks/on-installed-manager-types.mjs";
import type {
	Runtime,
} from "webextension-polyfill";

export const synchronouslyRegisterOnInstallListener = (): OnInstallEvent[] => {
// NOTE: synchronous handling of the onInstall event through a separate, polled queue handled by the OnInstalledManager.
	const onInstallListenerEventQueue: OnInstallEvent[] = [];

	// NOTE: onInstall needs to be registered synchronously.
	const onInstallListener = (event: Readonly<Runtime.OnInstalledDetailsType>) => {
		const onInstallEvent: OnInstallEvent = {
			event,
			source: "event",
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	};

	if (chrome.runtime.onInstalled) {
		// NOTE: the onInstalled listener can't be added asynchronously
		chrome.runtime.onInstalled.addListener(onInstallListener);
	} else {
		const onInstallEvent: OnInstallEvent = {
			event: null,
			source: "fallback",
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	}

	return onInstallListenerEventQueue;
};
