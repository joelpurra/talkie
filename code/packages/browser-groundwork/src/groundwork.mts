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

import {
	type OnInstallEvent,
} from "@talkie/browser-bricks/on-installed-manager-types.mjs";
import MessageBusInspector from "@talkie/shared-application/message-bus/message-bus-inspector.mjs";
import MessageBusRequester from "@talkie/shared-application/message-bus/message-bus-requester.mjs";
import {
	logDebug,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseDelay,
} from "@talkie/shared-application-helpers/promise.mjs";
import {
	isTalkieDevelopmentMode,
} from "@talkie/shared-application-helpers/talkie-build-mode.mjs";
import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import addOnInstalledEventQueuePolling from "./add-on-installed-event-queue-polling.mjs";
import createAndStartCommandListeners from "./create-and-start-command-listener.mjs";
import createAndStartPermissionListeners from "./create-and-start-permission-listeners.mjs";
import createAndStartTabListeners from "./create-and-start-tab-listeners.mjs";
import createMessageBusListeners from "./create-message-bus-listeners.mjs";
import getDependencies from "./get-dependencies.mjs";
import migrateStorageBackend from "./migrate-storage-backend.mjs";
import setupBroadcasterListeners from "./setup-broadcaster-listeners.mjs";

export const groundwork = async (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	uninitializers: UninitializerCallback[],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onInstallListenerEventQueue: OnInstallEvent[],
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	messageBusProviderGetter: IMessageBusProviderGetter,
): Promise<void> => {
	void logDebug("Start", "Main groundwork function");

	if (isTalkieDevelopmentMode()) {
		// NOTE: no cleanup; listen to the bitter end.
		const messageBusInspector = new MessageBusInspector(messageBusProviderGetter, logDebug.bind(undefined, "groundwork"));
		await messageBusInspector.start();

		// TODO DEBUG REMOVE
		void promiseDelay(1000)
			.then(async () => {
				const messageBusDummyMessageBusRequester = new MessageBusRequester("development:dummy:multiply-random", messageBusProviderGetter);

				for await (const i of [
					1,
					2,
					3,
				]) {
					await promiseDelay(10_000);

					void logWarn("messageBusDummyMessageBusRequester", i, await messageBusDummyMessageBusRequester.bespeak(i));
				}

				return null;
			});

		await createAndStartPermissionListeners();
	}

	// NOTE: performing storage backend migration early, before the storage provider is initialized.
	await migrateStorageBackend();

	const {
		buttonPopupManager,
		contextMenuManager,
		historyManager,
		iconManager,
		onInstalledManager,
		onlyLastCaller,
		onTabEventHandlers,
		premiumManager,
		progress,
		readClipboardManager,
		settingsManager,
		shortcutKeyManager,
		speaker,
		speakerManager,
		speakerPageManager,
		speakingStatus,
		stayAliveManager,
		voiceManager,
	} = getDependencies(onInstallListenerEventQueue, messageBusProviderGetter);

	// TODO: systematic cleanup of classes and their side-effects.
	uninitializers.unshift(await addOnInstalledEventQueuePolling(onInstalledManager));

	const tabChangeListeners = await createAndStartTabListeners(onTabEventHandlers);
	await setupBroadcasterListeners(
		uninitializers,
		messageBusProviderGetter,
		onlyLastCaller,
		speakingStatus,
		stayAliveManager,
		iconManager,
		buttonPopupManager,
		tabChangeListeners.onTabRemovedListener,
		tabChangeListeners.onTabUpdatedListener,
		progress,
		historyManager,
	);
	await createAndStartCommandListeners(contextMenuManager, shortcutKeyManager, speakerPageManager);

	uninitializers.unshift(...await createMessageBusListeners(
		messageBusProviderGetter,
		historyManager,
		premiumManager,
		settingsManager,
		voiceManager,
		speaker,
		speakerManager,
		speakerPageManager,
		readClipboardManager,
	));

	await buttonPopupManager.enablePopup();

	void logDebug("Done", "Main groundwork function");
};
