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

import type {
	OnInstallEvent,
} from "@talkie/browser-bricks/on-installed-manager-types.mjs";
import WindowLocalStorageProvider from "@talkie/browser-bricks/storage/window-local-storage-provider.mjs";
import {
	groundwork,
} from "@talkie/browser-groundwork/groundwork.mjs";
import {
	synchronouslyRegisterOnInstallListener,
} from "@talkie/browser-groundwork/synchronous-listeners.mjs";
import {
	mason,
} from "@talkie/browser-mason/mason.mjs";
import {
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling.mjs";
import CrossContextMessageBusEventProvider from "@talkie/shared-application/message-bus/cross-context-message-bus-event-provider.mjs";
import InternalMessageBusProvider from "@talkie/shared-application/message-bus/internal-message-bus-provider.mjs";
import {
	setGlobalTalkieContextIdentifier,
} from "@talkie/shared-application/message-bus/message-bus-helper.mjs";
import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	registerUninitializerHandlerSynchronously,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import type {
	IMessageBusEventProvider,
	IMessageBusProvider,
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import MessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/message-bus-provider-getter.mjs";
import PredefinedMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/predefined-message-bus-provider-getter.mjs";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const main = async (onInstallListenerEventQueue: OnInstallEvent[]) => {
	void logDebug("Start", "Main background function");

	const onMessageEventProvider: IMessageBusEventProvider = new CrossContextMessageBusEventProvider();
	const messageBusProvider: IMessageBusProvider = new InternalMessageBusProvider(onMessageEventProvider);

	globalThis.talkieSharedContext = {
		// NOTE: provides "cross-context" communication in firefox, which still allows getBackgroundPage().
		sharedMessageBusProvider: messageBusProvider,
	};

	const otherContextsMessageBusProviderGetter: IMessageBusProviderGetter = new PredefinedMessageBusProviderGetter(messageBusProvider);
	setGlobalTalkieContextIdentifier("background");
	const messageBusProviderGetter: IMessageBusProviderGetter = new MessageBusProviderGetter(otherContextsMessageBusProviderGetter);

	const windowLocalStorageProvider = new WindowLocalStorageProvider();

	// TODO DEBUG REMOVE
	//const offscreenIframeManager = new IframeManager(OffscreenDocumentManager.internalHtmlPath, OffscreenDocumentManager.identifier);
	//const offscreenDocumentProvider = new OffscreenDocumentProvider(offscreenIframeManager);
	//const offscreenDocumentManager = new OffscreenDocumentManager(offscreenDocumentProvider);
	//
	//// TODO: systematic cleanup.
	//await offscreenDocumentManager.ensureOpen();

	await groundwork(uninitializers, onInstallListenerEventQueue, messageBusProviderGetter);

	//await startSuspensionManager(broadcaster);

	await mason(uninitializers, messageBusProviderGetter, windowLocalStorageProvider);

	void logDebug("Done", "Main background function");
};

registerUnhandledRejectionHandler();

const uninitializers = registerUninitializerHandlerSynchronously();
const onInstallListenerEventQueue = synchronouslyRegisterOnInstallListener();

void main(onInstallListenerEventQueue);
