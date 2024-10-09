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
	mason,
} from "@talkie/browser-mason/mason.mjs";
import redundantlyTriggerLoadingVoices from "@talkie/browser-shared/redundantly-trigger-loading-voices.mjs";
import {
	eventToPromiseSingle,
} from "@talkie/browser-shared/shared-frontend.mjs";
import {
	registerUnhandledRejectionHandler,
} from "@talkie/shared-application/error-handling.mjs";
import {
	registerUninitializerHandlerSynchronously,
} from "@talkie/shared-application-helpers/uninitializer-handler.mjs";
import type {
	IMessageBusProvider,
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import ChromeBrowserRuntimeMessageBusEventProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-event-provider.mjs";
import ChromeBrowserRuntimeMessageBusProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-provider.mjs";
import MessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/message-bus-provider-getter.mjs";
import PredefinedMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/predefined-message-bus-provider-getter.mjs";

const start = async () => {
	const browserRuntimeMessageBusEventProvider = new ChromeBrowserRuntimeMessageBusEventProvider();
	const otherContextsMessageBusProvider: IMessageBusProvider = new ChromeBrowserRuntimeMessageBusProvider(browserRuntimeMessageBusEventProvider);
	const otherContextsMessageBusProviderGetter: IMessageBusProviderGetter = new PredefinedMessageBusProviderGetter(otherContextsMessageBusProvider);
	const messageBusProviderGetter: IMessageBusProviderGetter = new MessageBusProviderGetter(otherContextsMessageBusProviderGetter);

	await mason(uninitializers, messageBusProviderGetter);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const stop = async () => {};

// NOTE: earliest possible voice load trigger.
void redundantlyTriggerLoadingVoices();

registerUnhandledRejectionHandler();

const uninitializers = registerUninitializerHandlerSynchronously();

// NOTE: registering event handlers synchronously.
document.addEventListener("DOMContentLoaded", eventToPromiseSingle.bind(null, start));
window.addEventListener("beforeunload", eventToPromiseSingle.bind(null, stop));
