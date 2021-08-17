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

import Configuration from "@talkie/shared-application/configuration/configuration";
import configurationObject from "@talkie/shared-application/configuration/configuration-object";
import MetadataManager from "@talkie/shared-application/metadata-manager";
import SettingsManager from "@talkie/shared-application/settings-manager";
import StorageManager from "@talkie/shared-application/storage-manager";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper";
import BroadcasterProvider from "@talkie/split-environment-webextension/broadcaster-provider";
import Api from "@talkie/split-environment-webextension/browser-specific/api";
import DynamicEnvironmentProvider from "@talkie/split-environment-webextension/dynamic-environment";
import LocaleProvider from "@talkie/split-environment-webextension/locale-provider";
import ManifestProvider from "@talkie/split-environment-webextension/manifest-provider";
import StorageProvider from "@talkie/split-environment-webextension/storage-provider";
import StyletronProvider from "@talkie/split-environment-webextension/styletron-provider";
import TranslatorProvider from "@talkie/split-environment-webextension/translator-provider";

export type BrowserDependencies = {
	api: Api;
	broadcasterProvider: BroadcasterProvider;
	configuration: Configuration;
	styletronProvider: StyletronProvider;
	translatorProvider: TranslatorProvider;
};

function getDependencies(): BrowserDependencies {
	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const broadcasterProvider = new BroadcasterProvider();
	const settingsManager = new SettingsManager(storageManager, broadcasterProvider);
	const manifestProvider = new ManifestProvider();
	const dynamicEnvironmentProvider = new DynamicEnvironmentProvider();
	const metadataManager = new MetadataManager(manifestProvider, dynamicEnvironmentProvider, settingsManager);
	const configuration = new Configuration(metadataManager, configurationObject);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const talkieLocaleHelper = new TalkieLocaleHelper();
	const styletronProvider = new StyletronProvider();
	const api = new Api(metadataManager, configuration, translatorProvider, broadcasterProvider, talkieLocaleHelper);

	// NOTE: using poor man's dependency injection. Instances should only be created once, and reused across the execution.
	return {
		api,
		broadcasterProvider,
		configuration,
		styletronProvider,
		translatorProvider,
	};
}

export default getDependencies;
