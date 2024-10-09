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

import Configuration from "@talkie/shared-application/configuration/configuration.mjs";
import configurationObject from "@talkie/shared-application/data/configuration/configuration.mjs";
import InternalMessageBusProvider from "@talkie/shared-application/message-bus/internal-message-bus-provider.mjs";
import SameContextMessageBusEventProvider from "@talkie/shared-application/message-bus/same-context-message-bus-event-provider.mjs";
import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import PremiumManager from "@talkie/shared-application/premium-manager.mjs";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper.mjs";
import type {
	IMessageBusProvider,
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import DynamicEnvironmentProvider from "@talkie/split-environment-node/dynamic-environment.mjs";
import LocaleProvider from "@talkie/split-environment-node/locale-provider.mjs";
import ManifestProvider from "@talkie/split-environment-node/manifest-provider.mjs";
import PremiumProvider from "@talkie/split-environment-node/premium-provider.mjs";
import RenderingApi from "@talkie/split-environment-node/server-specific/rendering-api.mjs";
import RenderingCoating from "@talkie/split-environment-node/server-specific/rendering-coating.mjs";
import RenderingCoatingLocale from "@talkie/split-environment-node/server-specific/rendering-coating-locale.mjs";
import RenderingCoatingMetadata from "@talkie/split-environment-node/server-specific/rendering-coating-metadata.mjs";
import RenderingCoatingPremium from "@talkie/split-environment-node/server-specific/rendering-coating-premium.mjs";
import RenderingCoatingTalkieLocale from "@talkie/split-environment-node/server-specific/rendering-coating-talkie-locale.mjs";
import StyletronProvider from "@talkie/split-environment-node/styletron-provider.mjs";
import TranslatorProvider from "@talkie/split-environment-node/translator-provider.mjs";
import MessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/message-bus-provider-getter.mjs";
import PredefinedMessageBusProviderGetter from "@talkie/split-environment-webextension/message-bus/getter/predefined-message-bus-provider-getter.mjs";

export interface ServerSideDependencies {
	api: RenderingApi;
	configuration: IConfiguration;
	localeProvider: LocaleProvider;
	messageBusProviderGetter: IMessageBusProviderGetter;
	styletronProvider: StyletronProvider;
	translatorProvider: TranslatorProvider;
}

const getDependencies = async (): Promise<ServerSideDependencies> => {
	// TODO: systematic cleanup of classes and their side-effects.
	// NOTE: fake "other contexts", since there are none.
	const browserRuntimeMessageBusEventProvider = new SameContextMessageBusEventProvider();
	const otherContextsMessageBusProvider: IMessageBusProvider = new InternalMessageBusProvider(browserRuntimeMessageBusEventProvider);
	const otherContextsMessageBusProviderGetter: IMessageBusProviderGetter = new PredefinedMessageBusProviderGetter(otherContextsMessageBusProvider);
	const messageBusProviderGetter: IMessageBusProviderGetter = new MessageBusProviderGetter(otherContextsMessageBusProviderGetter);

	const premiumProvider = new PremiumProvider();
	const premiumManager = new PremiumManager(premiumProvider);
	const manifestProvider = new ManifestProvider();
	const dynamicEnvironmentProvider = new DynamicEnvironmentProvider();
	const metadataManager = new MetadataManager(manifestProvider, dynamicEnvironmentProvider);
	const configuration = new Configuration(metadataManager, configurationObject);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const talkieLocaleHelper = new TalkieLocaleHelper();

	const apiCoatingLocale = new RenderingCoatingLocale(localeProvider);
	const apiCoatingMetadata = new RenderingCoatingMetadata(metadataManager);
	const apiCoatingPremium = new RenderingCoatingPremium(premiumManager);
	const apiCoatingTalkieLocale = new RenderingCoatingTalkieLocale(talkieLocaleHelper);
	const apiCoating = new RenderingCoating(apiCoatingLocale, apiCoatingMetadata, apiCoatingPremium, apiCoatingTalkieLocale);
	const renderingApi = new RenderingApi(apiCoating);

	const styletronProvider = new StyletronProvider();

	// NOTE: using poor man's dependency injection. Instances should only be created once, and reused across the execution.
	return {
		api: renderingApi,
		configuration,
		localeProvider,
		messageBusProviderGetter,
		styletronProvider,
		translatorProvider,
	};
};

export default getDependencies;
