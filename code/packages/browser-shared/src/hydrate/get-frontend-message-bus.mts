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

// eslint-disable-next-line import-x/no-unassigned-import
import "@talkie/split-environment-webextension/browser-specific/global-window-talkie-shared-context.mjs";

import {
	getRandomTalkieContextIdentifierFromDocumentLocation,
	setGlobalTalkieContextIdentifier,
} from "@talkie/shared-application/message-bus/message-bus-helper.mjs";
import {
	type IMessageBusProvider,
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import {
	browserSupportsBackgroundPage,
} from "@talkie/split-environment-webextension/browser-specific/browser-capabilities.mjs";
import ChromeBrowserRuntimeMessageBusEventProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-event-provider.mjs";
import ChromeBrowserRuntimeMessageBusProvider from "@talkie/split-environment-webextension/message-bus/browser-runtime-chrome/chrome-browser-runtime-message-bus-provider.mjs";
import DynamicMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/dynamic-message-bus-provider-getter.mjs";
import MessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/message-bus-provider-getter.mjs";
import PredefinedMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/predefined-message-bus-provider-getter.mjs";

const getFrontendMessageBus = async (): Promise<IMessageBusProviderGetter> => {
	let otherContextsMessageBusProviderGetter: IMessageBusProviderGetter;

	if (browserSupportsBackgroundPage()) {
		const talkieContextIdentifier = getRandomTalkieContextIdentifierFromDocumentLocation();
		setGlobalTalkieContextIdentifier(talkieContextIdentifier);

		otherContextsMessageBusProviderGetter = new DynamicMessageBusProviderGetter(async () => {
			const backgroundPage = await chrome.runtime.getBackgroundPage();
			const sharedMessageBusProvider = backgroundPage.talkieSharedContext?.sharedMessageBusProvider;

			if (!sharedMessageBusProvider) {
				throw new Error("Could not access sharedMessageBusProvider.");
			}

			return sharedMessageBusProvider;
		});
	} else {
		const browserRuntimeMessageBusEventProvider = new ChromeBrowserRuntimeMessageBusEventProvider();
		const otherContextsMessageBusProvider: IMessageBusProvider = new ChromeBrowserRuntimeMessageBusProvider(browserRuntimeMessageBusEventProvider);
		otherContextsMessageBusProviderGetter = new PredefinedMessageBusProviderGetter(otherContextsMessageBusProvider);
	}

	const messageBusProviderGetter: IMessageBusProviderGetter = new MessageBusProviderGetter(otherContextsMessageBusProviderGetter);

	return messageBusProviderGetter;
};

export default getFrontendMessageBus;
