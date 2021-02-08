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

import React from "react";

import configurationObject from "../../configuration.json";
import Api from "../../split-environments/api";
import BroadcasterProvider from "../../split-environments/broadcaster-provider";
import LocaleProvider from "../../split-environments/locale-provider";
import ManifestProvider from "../../split-environments/manifest-provider";
import StorageProvider from "../../split-environments/storage-provider";
import StyletronProvider from "../../split-environments/styletron-provider";
import TranslatorProvider from "../../split-environments/translator-provider";
import Configuration from "../configuration";
import Root from "../containers/root.jsx";
import MetadataManager from "../metadata-manager";
import ReduxStoreProvider from "../redux-store-provider";
import SettingsManager from "../settings-manager";
import StorageManager from "../storage-manager";
import TalkieLocaleHelper from "../talkie-locale-helper";

const getRoot = async (store, translator, configuration, styletron, broadcaster, ChildComponent) => {
	const root = (
		<Root
			broadcaster={broadcaster}
			configuration={configuration}
			store={store}
			styletron={styletron}
			translator={translator}
		>
			<ChildComponent/>
		</Root>
	);

	return root;
};

const autoRoot = async (initialState, rootReducer, ChildComponent) => {
	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const settingsManager = new SettingsManager(storageManager);
	const manifestProvider = new ManifestProvider();
	const metadataManager = new MetadataManager(manifestProvider, settingsManager);
	const configuration = new Configuration(metadataManager, configurationObject);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const broadcasterProvider = new BroadcasterProvider();
	const talkieLocaleHelper = new TalkieLocaleHelper();
	const api = new Api(metadataManager, configuration, translatorProvider, broadcasterProvider, talkieLocaleHelper);

	const reduxStoreProvider = new ReduxStoreProvider();
	const store = reduxStoreProvider.createStore(initialState, rootReducer, api);

	const styletronProvider = new StyletronProvider();
	/* eslint-disable no-sync */
	const styletron = styletronProvider.getSync();
	/* eslint-enable no-sync */

	// TODO: create a generic static/default/render-time preloaded state action provider attached to the component hierarchy?
	const root = await getRoot(store, translatorProvider, configuration, styletron, broadcasterProvider, ChildComponent);
	const rootObject = {
		localeProvider,
		root,
		store,
		styletron,
	};

	return rootObject;
};

export default autoRoot;
