/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type OnInstalledManager from "@talkie/browser-bricks/on-installed-manager.mjs";

const addOnInstalledEventQueuePolling = async (onInstalledManager: Readonly<OnInstalledManager>): Promise<() => Promise<void>> => {
	// NOTE: run the function once first, to allow for a very long interval.
	const ONE_SECOND_IN_MILLISECONDS = 1 * 1000;
	const ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_TIMEOUT = ONE_SECOND_IN_MILLISECONDS;

	const onInstallListenerEventQueueHandlerTimeoutId = setTimeout(
		async () => onInstalledManager.onInstallListenerEventQueueHandler(),
		ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_TIMEOUT,
	);

	// NOTE: run the function with a very long interval.
	const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
	const ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_INTERVAL = ONE_HOUR_IN_MILLISECONDS;

	const onInstallListenerEventQueueHandlerIntervalId = setInterval(
		async () => onInstalledManager.onInstallListenerEventQueueHandler(),
		ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_INTERVAL,
	);

	const ids = [
		onInstallListenerEventQueueHandlerIntervalId,
		onInstallListenerEventQueueHandlerTimeoutId,
	];

	const cleanup: () => Promise<void> = async () => {
		for (const id of ids) {
			// NOTE: no separation of timeout/interval ids; clearTimeout/clearInterval may be used interchangeably.
			// https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout
			clearTimeout(id);
		}
	};

	// NOTE: delegate clearing the ids to the caller.
	return cleanup;
};

export default addOnInstalledEventQueuePolling;
