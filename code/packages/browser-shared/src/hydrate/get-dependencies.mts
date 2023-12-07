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

import Configuration from "@talkie/shared-application/configuration/configuration.mjs";
import configurationObject from "@talkie/shared-application/data/configuration/configuration.mjs";
import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import PremiumManager from "@talkie/shared-application/premium-manager.mjs";
import SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import StorageManager from "@talkie/shared-application/storage-manager.mjs";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import BrowserApi from "@talkie/split-environment-webextension/browser-specific/api/browser-api.mjs";
import BrowserCoating from "@talkie/split-environment-webextension/browser-specific/api/browser-coating.mjs";
import BrowserCoatingBrowser from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-browser.mjs";
import BrowserCoatingLocale from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-locale.mjs";
import BrowserCoatingMetadata from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-metadata.mjs";
import BrowserCoatingPremium from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-premium.mjs";
import BrowserCoatingTalkieLocale from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-talkie-locale.mjs";
import MessageBusGroundwork from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork.mjs";
import MessageBusGroundworkConfiguration from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-configuration.mjs";
import MessageBusGroundworkHistory from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-history.mjs";
import MessageBusGroundworkSpeaking from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-speaking.mjs";
import MessageBusGroundworkUi from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-ui.mjs";
import MessageBusGroundworkVoices from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-voices.mjs";
import DynamicEnvironmentProvider from "@talkie/split-environment-webextension/dynamic-environment.mjs";
import LocaleProvider from "@talkie/split-environment-webextension/locale-provider.mjs";
import ManifestProvider from "@talkie/split-environment-webextension/manifest-provider.mjs";
import PremiumProvider from "@talkie/split-environment-webextension/premium-provider.mjs";
import StorageProvider from "@talkie/split-environment-webextension/storage-provider.mjs";
import StyletronProvider from "@talkie/split-environment-webextension/styletron-provider.mjs";
import TranslatorProvider from "@talkie/split-environment-webextension/translator-provider.mjs";

export interface BrowserDependencies {
	api: BrowserApi;
	configuration: IConfiguration;
	styletronProvider: StyletronProvider;
	translatorProvider: TranslatorProvider;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
function getDependencies(messageBusProviderGetter: IMessageBusProviderGetter): BrowserDependencies {
	// TODO: systematic cleanup of classes and their side-effects.
	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const settingsManager = new SettingsManager(storageManager, messageBusProviderGetter);
	const premiumProvider = new PremiumProvider(settingsManager);
	const premiumManager = new PremiumManager(premiumProvider);
	const manifestProvider = new ManifestProvider();
	const dynamicEnvironmentProvider = new DynamicEnvironmentProvider();
	const metadataManager = new MetadataManager(manifestProvider, dynamicEnvironmentProvider);
	const configuration = new Configuration(metadataManager, configurationObject);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const talkieLocaleHelper = new TalkieLocaleHelper();
	const styletronProvider = new StyletronProvider();

	const browserCoatingBrowser = new BrowserCoatingBrowser();
	const browserCoatingLocale = new BrowserCoatingLocale(localeProvider);
	const browserCoatingMetadata = new BrowserCoatingMetadata(metadataManager);
	const browserCoatingPremium = new BrowserCoatingPremium(premiumManager);
	const browserCoatingTalkieLocale = new BrowserCoatingTalkieLocale(talkieLocaleHelper);
	const browserCoating = new BrowserCoating(browserCoatingBrowser, browserCoatingLocale, browserCoatingMetadata, browserCoatingPremium, browserCoatingTalkieLocale);

	const apiGroundworkConfiguration = new MessageBusGroundworkConfiguration(messageBusProviderGetter);
	const apiGroundworkHistory = new MessageBusGroundworkHistory(messageBusProviderGetter);
	const apiGroundworkSpeaking = new MessageBusGroundworkSpeaking(messageBusProviderGetter);
	const apiGroundworkVoices = new MessageBusGroundworkVoices(messageBusProviderGetter);
	const apiGroundworkUi = new MessageBusGroundworkUi(messageBusProviderGetter);
	const apiGroundwork = new MessageBusGroundwork(apiGroundworkConfiguration, apiGroundworkHistory, apiGroundworkSpeaking, apiGroundworkUi, apiGroundworkVoices);

	const browserApi = new BrowserApi(browserCoating, apiGroundwork);

	// NOTE: using poor man's dependency injection. Instances should only be created once, and reused across the execution.
	return {
		api: browserApi,
		configuration,
		styletronProvider,
		translatorProvider,
	};
}

export default getDependencies;
