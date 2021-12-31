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

import OnInstalledManager from "../on-installed-manager.mjs";

const addOnInstalledEventQueuePolling = async (onInstalledManager: Readonly<OnInstalledManager>): Promise<void> => {
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

	// TODO: clearTimeout/clearInterval at some point?
	const unusedIds = {
		onInstallListenerEventQueueHandlerIntervalId,
		onInstallListenerEventQueueHandlerTimeoutId,
	};

	void unusedIds;
};

export default addOnInstalledEventQueuePolling;
