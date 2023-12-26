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

import ContentLogger from "@talkie/browser-shared/content-logger.mjs";
import Execute from "@talkie/browser-shared/execute.mjs";
import Plug from "@talkie/browser-shared/plug.mjs";
import Broadcaster from "@talkie/shared-application/broadcaster.mjs";
import Configuration from "@talkie/shared-application/configuration/configuration.mjs";
import configurationObject from "@talkie/shared-application/data/configuration/configuration.mjs";
import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import StorageManager from "@talkie/shared-application/storage-manager.mjs";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import {
	type IMetadataManager,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import TalkieProgress from "@talkie/shared-ui/talkie-progress.mjs";
import DynamicEnvironmentProvider from "@talkie/split-environment-webextension/dynamic-environment.mjs";
import InternalUrlProvider from "@talkie/split-environment-webextension/internal-url-provider.mjs";
import LocaleProvider from "@talkie/split-environment-webextension/locale-provider.mjs";
import ManifestProvider from "@talkie/split-environment-webextension/manifest-provider.mjs";
import StorageProvider from "@talkie/split-environment-webextension/storage-provider.mjs";
import TranslatorProvider from "@talkie/split-environment-webextension/translator-provider.mjs";

import ButtonPopupManager from "../button-popup-manager.mjs";
import ClipboardManager from "../clipboard-manager.mjs";
import CommandHandler from "../command-handler.mjs";
import {
	type IBrowserCommandMap,
} from "../command-handler-types.mjs";
import ContextMenuManager from "../context-menu-manager.mjs";
import HistoryManager from "../history-manager.mjs";
import IconManager from "../icon-manager.mjs";
import LanguageHelper from "../language-helper.mjs";
import NonBreakingChain from "../non-breaking-chain.mjs";
import OnInstalledManager from "../on-installed-manager.mjs";
import {
	type OnInstallEvent,
} from "../on-installed-manager-types.mjs";
import OnlyLastCaller from "../only-last-caller.mjs";
import PermissionsManager from "../permissions-manager.mjs";
import ReadClipboardManager from "../read-clipboard-manager.mjs";
import ShortcutKeyManager from "../shortcut-key-manager.mjs";
import SpeakingStatus from "../speaking-status.mjs";
import SuspensionConnectorManager from "../suspension-connector-manager.mjs";
import SuspensionManager from "../suspension-manager.mjs";
import TalkieBackground from "../talkie-background.mjs";
import TalkieSpeaker from "../talkie-speaker.mjs";
import VoiceLanguageManager from "../voice-language-manager.mjs";
import VoiceManager from "../voice-manager.mjs";
import VoicePitchManager from "../voice-pitch-manager.mjs";
import VoiceRateManager from "../voice-rate-manager.mjs";
import WelcomeManager from "../welcome-manager.mjs";
import getCommandMap from "./get-command-map.mjs";

export interface BackgroundDependencies {
	broadcaster: Broadcaster;
	buttonPopupManager: ButtonPopupManager;
	configuration: IConfiguration;
	contextMenuManager: ContextMenuManager;
	historyManager: HistoryManager;
	iconManager: IconManager;
	metadataManager: IMetadataManager;
	onInstalledManager: OnInstalledManager;
	onlyLastCaller: OnlyLastCaller;
	plug: Plug;
	progress: TalkieProgress;
	settingsManager: SettingsManager;
	shortcutKeyManager: ShortcutKeyManager;
	speakingStatus: SpeakingStatus;
	storageManager: StorageManager;
	suspensionManager: SuspensionManager;
	talkieBackground: TalkieBackground;
	talkieSpeaker: TalkieSpeaker;
	voiceManager: VoiceManager;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const getDependencies = (onInstallListenerEventQueue: OnInstallEvent[]): BackgroundDependencies => {
	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const broadcaster = new Broadcaster();
	const settingsManager = new SettingsManager(storageManager, broadcaster);
	const manifestProvider = new ManifestProvider();
	const dynamicEnvironmentProvider = new DynamicEnvironmentProvider();
	const metadataManager = new MetadataManager(manifestProvider, dynamicEnvironmentProvider, settingsManager);
	const internalUrlProvider = new InternalUrlProvider();
	const configuration = new Configuration(metadataManager, configurationObject);

	const onlyLastCaller = new OnlyLastCaller();
	const shouldContinueSpeakingProvider = onlyLastCaller;
	const execute = new Execute();
	const contentLogger = new ContentLogger(execute);
	const talkieSpeaker = new TalkieSpeaker(broadcaster, shouldContinueSpeakingProvider, contentLogger, settingsManager);
	const speakingStatus = new SpeakingStatus();

	const voiceLanguageManager = new VoiceLanguageManager(storageManager, metadataManager, talkieSpeaker);
	const voiceRateManager = new VoiceRateManager(storageManager, metadataManager);
	const voicePitchManager = new VoicePitchManager(storageManager, metadataManager);
	const voiceManager = new VoiceManager(voiceLanguageManager, voiceRateManager, voicePitchManager);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const languageHelper = new LanguageHelper(contentLogger, translatorProvider);

	// NOTE: using a chainer to be able to add user (click/shortcut key/context menu) initialized speech events one after another.
	const speechChain = new NonBreakingChain();
	const talkieBackground = new TalkieBackground(
		speechChain,
		broadcaster,
		talkieSpeaker,
		speakingStatus,
		voiceManager,
		languageHelper,
		execute,
		translatorProvider,
		internalUrlProvider,
		settingsManager,
	);
	const permissionsManager = new PermissionsManager();
	const clipboardManager = new ClipboardManager(permissionsManager);
	const readClipboardManager = new ReadClipboardManager(
		clipboardManager,
		talkieBackground,
		permissionsManager,
		metadataManager,
		translatorProvider,
	);
	const historyManager = new HistoryManager(settingsManager);

	const commandMap: IBrowserCommandMap = getCommandMap(talkieBackground, readClipboardManager);

	const commandHandler = new CommandHandler(commandMap);
	const contextMenuManager = new ContextMenuManager(commandHandler, metadataManager, translatorProvider);
	const shortcutKeyManager = new ShortcutKeyManager(commandHandler);

	const suspensionConnectorManager = new SuspensionConnectorManager();
	const suspensionManager = new SuspensionManager(suspensionConnectorManager);
	const iconManager = new IconManager(metadataManager);
	const buttonPopupManager = new ButtonPopupManager(translatorProvider, metadataManager);

	const progress = new TalkieProgress(broadcaster);

	const plug = new Plug(contentLogger, execute);

	const welcomeManager = new WelcomeManager();
	const onInstalledManager = new OnInstalledManager(
		storageManager,
		settingsManager,
		metadataManager,
		contextMenuManager,
		welcomeManager,
		onInstallListenerEventQueue,
	);

	return {
		broadcaster,
		buttonPopupManager,
		configuration,
		contextMenuManager,
		historyManager,
		iconManager,
		metadataManager,
		onInstalledManager,
		onlyLastCaller,
		plug,
		progress,
		settingsManager,
		shortcutKeyManager,
		speakingStatus,
		storageManager,
		suspensionManager,
		talkieBackground,
		talkieSpeaker,
		voiceManager,
	};
};

export default getDependencies;
