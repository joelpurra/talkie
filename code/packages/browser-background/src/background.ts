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
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling";
import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log";
import {
	Runtime,
} from "webextension-polyfill";

import addOnInstalledEventQueuePolling from "./background/add-on-installed-event-queue-polling";
import createAndStartCommandListeners from "./background/create-and-start-command-listener";
import createAndStartSuspensionListener from "./background/create-and-start-suspension-listener";
import createAndStartTabListeners from "./background/create-and-start-tab-listeners";
import createTalkieServices from "./background/create-talkie-services";
import getDependencies from "./background/get-dependencies";
import setupBroadcasterListenersAndKillswitches from "./background/setup-broadcaster-listeners-and-killswitches";
import {
	OnInstallEvent,
} from "./on-installed-manager-types";

// NOTE: synchronous handling of the onInstall event through a separate, polled queue handled by the OnInstalledManager.
const onInstallListenerEventQueue: OnInstallEvent[] = [];

const synchronouslyRegisterOnInstallListener = () => {
	// NOTE: onInstall needs to be registered synchronously.
	const onInstallListener = (event: Readonly<Runtime.OnInstalledDetailsType>) => {
		const onInstallEvent: OnInstallEvent = {
			event,
			source: "event",
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	};

	// NOTE: "This event is not triggered for temporarily installed add-ons."
	// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled#Compatibility_notes
	// NOTE: When using the WebExtensions polyfill, this check doesn't seem to work as browser.runtime.onInstalled always exists.
	// https://github.com/mozilla/webextension-polyfill
	if (browser.runtime.onInstalled) {
		// NOTE: the onInstalled listener can't be added asynchronously
		browser.runtime.onInstalled.addListener(onInstallListener);
	} else {
		const onInstallEvent: OnInstallEvent = {
			event: null,
			source: "fallback",
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	}
};

const main = async () => {
	void logDebug("Start", "Main background function");

	const {
		onInstalledManager,
		suspensionManager,
		talkieBackground,
		broadcaster,
		onlyLastCaller,
		plug,
		speakingStatus,
		iconManager,
		buttonPopupManager,
		progress,
		contextMenuManager,
		shortcutKeyManager,
		talkieSpeaker,
		metadataManager,
		settingsManager,
		voiceManager,
		configuration,
		storageManager,
	} = getDependencies(onInstallListenerEventQueue);

	await addOnInstalledEventQueuePolling(onInstalledManager);

	// TODO: put initialization promise on the root chain?
	await suspensionManager.initialize();

	const tabChangeListeners = await createAndStartTabListeners(talkieBackground);
	await setupBroadcasterListenersAndKillswitches(broadcaster, onlyLastCaller, plug, speakingStatus, iconManager, buttonPopupManager, suspensionManager, tabChangeListeners.onTabRemovedListener, tabChangeListeners.onTabUpdatedListener, progress);
	await createAndStartSuspensionListener(talkieBackground);
	await createAndStartCommandListeners(talkieBackground, contextMenuManager, shortcutKeyManager);

	window.talkieServices = await createTalkieServices(broadcaster, talkieSpeaker, talkieBackground, metadataManager, settingsManager, voiceManager, configuration, storageManager);

	await buttonPopupManager.enablePopup();

	void logDebug("Done", "Main background function");
};

try {
	registerUnhandledRejectionHandler();
	synchronouslyRegisterOnInstallListener();

	void main();
} catch (error: unknown) {
	void logError("background", error);
}
