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

import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import Configuration from "@talkie/shared-application/configuration/configuration.mjs";
import configurationObject from "@talkie/shared-application/data/configuration/configuration.mjs";
import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import PremiumManager from "@talkie/shared-application/premium-manager.mjs";
import SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import DefaultStorageManager from "@talkie/shared-application/storage/default-storage-manager.mjs";
import StorageHelper from "@talkie/shared-application/storage/storage-helper.mjs";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper.mjs";
import BrowserApi from "@talkie/split-environment-webextension/browser-specific/api/browser-api.mjs";
import BrowserCoatingBrowser from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-browser.mjs";
import BrowserCoatingClipboard from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-clipboard.mjs";
import BrowserCoatingLocale from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-locale.mjs";
import BrowserCoatingMetadata from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-metadata.mjs";
import BrowserCoatingPremium from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-premium.mjs";
import BrowserCoatingTalkieLocale from "@talkie/split-environment-webextension/browser-specific/api/browser-coating-talkie-locale.mjs";
import BrowserCoating from "@talkie/split-environment-webextension/browser-specific/api/browser-coating.mjs";
import MessageBusGroundworkClipboard from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-clipboard.mjs";
import MessageBusGroundworkConfiguration from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-configuration.mjs";
import MessageBusGroundworkHistory from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-history.mjs";
import MessageBusGroundworkSpeaking from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-speaking.mjs";
import MessageBusGroundworkUi from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-ui.mjs";
import MessageBusGroundworkVoices from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork-voices.mjs";
import MessageBusGroundwork from "@talkie/split-environment-webextension/browser-specific/api/message-bus-groundwork.mjs";
import DynamicEnvironmentProvider from "@talkie/split-environment-webextension/dynamic-environment.mjs";
import LocaleProvider from "@talkie/split-environment-webextension/locale-provider.mjs";
import ManifestProvider from "@talkie/split-environment-webextension/manifest-provider.mjs";
import PremiumProvider from "@talkie/split-environment-webextension/premium-provider.mjs";
import StorageProvider from "@talkie/split-environment-webextension/storage-provider.mjs";
import StyletronProvider from "@talkie/split-environment-webextension/styletron-provider.mjs";
import TranslatorProvider from "@talkie/split-environment-webextension/translator-provider.mjs";

import PermissionsProvider from "../permissions-provider.mjs";
import ReadClipboardPermissionManager from "../read-clipboard-permission-manager.mjs";

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
	const storageHelper = new StorageHelper(storageProvider);
	const storageManager = new DefaultStorageManager(storageHelper);
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
	const permissionsManager = new PermissionsProvider();
	const readClipboardPermissionManager = new ReadClipboardPermissionManager(permissionsManager);

	const browserCoatingBrowser = new BrowserCoatingBrowser();
	const browserCoatingClipboard = new BrowserCoatingClipboard(readClipboardPermissionManager);
	const browserCoatingLocale = new BrowserCoatingLocale(localeProvider);
	const browserCoatingMetadata = new BrowserCoatingMetadata(metadataManager);
	const browserCoatingPremium = new BrowserCoatingPremium(premiumManager);
	const browserCoatingTalkieLocale = new BrowserCoatingTalkieLocale(talkieLocaleHelper);
	const browserCoating = new BrowserCoating(browserCoatingBrowser, browserCoatingClipboard, browserCoatingLocale, browserCoatingMetadata, browserCoatingPremium, browserCoatingTalkieLocale);

	const apiGroundworkClipboard = new MessageBusGroundworkClipboard(messageBusProviderGetter);
	const apiGroundworkConfiguration = new MessageBusGroundworkConfiguration(messageBusProviderGetter);
	const apiGroundworkHistory = new MessageBusGroundworkHistory(messageBusProviderGetter);
	const apiGroundworkSpeaking = new MessageBusGroundworkSpeaking(messageBusProviderGetter);
	const apiGroundworkUi = new MessageBusGroundworkUi(messageBusProviderGetter);
	const apiGroundworkVoices = new MessageBusGroundworkVoices(messageBusProviderGetter);
	const apiGroundwork = new MessageBusGroundwork(apiGroundworkClipboard, apiGroundworkConfiguration, apiGroundworkHistory, apiGroundworkSpeaking, apiGroundworkUi, apiGroundworkVoices);

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
