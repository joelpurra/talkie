/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
import type IInternalUrlProvider from "@talkie/split-environment-interfaces/iinternal-url-provider.mjs";
import type {
	IMessageBusProvider,
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import {
	groundwork,
} from "@talkie/browser-groundwork/groundwork.mjs";
import {
	synchronouslyRegisterOnInstallListener,
} from "@talkie/browser-groundwork/synchronous-listeners.mjs";
import {
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling.mjs";
import OffscreenDocumentManager from "@talkie/shared-application/offscreen-document-manager.mjs";
import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	registerUninitializerHandlerSynchronously,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import WebExtensionEnvironmentInternalUrlProvider from "@talkie/split-environment-webextension/internal-url-provider.mjs";
import ChromeBrowserRuntimeMessageBusEventProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-event-provider.mjs";
import BrowserRuntimeMessageBusProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-provider.mjs";
import MessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/message-bus-provider-getter.mjs";
import PredefinedMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/predefined-message-bus-provider-getter.mjs";

import OffscreenDocumentProvider from "./serviceworker/offscreen-document-provider.mjs";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const main = async (onInstallListenerEventQueue: OnInstallEvent[]) => {
	void logDebug("Start", "Main serviceworker function");

	const browserRuntimeMessageBusEventProvider = new ChromeBrowserRuntimeMessageBusEventProvider();
	const otherContextsMessageBusProvider: IMessageBusProvider = new BrowserRuntimeMessageBusProvider(browserRuntimeMessageBusEventProvider);
	const otherContextsMessageBusProviderGetter: IMessageBusProviderGetter = new PredefinedMessageBusProviderGetter(otherContextsMessageBusProvider);
	const messageBusProviderGetter: IMessageBusProviderGetter = new MessageBusProviderGetter(otherContextsMessageBusProviderGetter);

	const internalUrlProvider: IInternalUrlProvider = new WebExtensionEnvironmentInternalUrlProvider();
	const offscreenDocumentProvider = new OffscreenDocumentProvider(internalUrlProvider, OffscreenDocumentManager.internalHtmlPath);
	const offscreenDocumentManager = new OffscreenDocumentManager(offscreenDocumentProvider);

	await offscreenDocumentManager.ensureOpen();
	uninitializers.unshift(offscreenDocumentManager.ensureClosed);

	// NOTE: load groundwork after the offscreen document has opened.
	await groundwork(uninitializers, onInstallListenerEventQueue, messageBusProviderGetter);

	void logDebug("Done", "Main serviceworker function");
};

registerUnhandledRejectionHandler();

const uninitializers = registerUninitializerHandlerSynchronously();
const onInstallListenerEventQueue = synchronouslyRegisterOnInstallListener();

void main(onInstallListenerEventQueue);
