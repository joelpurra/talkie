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

import ContentLogger from "@talkie/browser-shared/content-logger";
import Execute from "@talkie/browser-shared/execute";
import Plug from "@talkie/browser-shared/plug";
import Broadcaster from "@talkie/shared-application/broadcaster";
import Configuration from "@talkie/shared-application/configuration/configuration";
import configurationObject from "@talkie/shared-application/configuration/configuration-object";
import MetadataManager from "@talkie/shared-application/metadata-manager";
import SettingsManager from "@talkie/shared-application/settings-manager";
import StorageManager from "@talkie/shared-application/storage-manager";
import TalkieProgress from "@talkie/shared-application/talkie-progress";
import DynamicEnvironmentProvider from "@talkie/split-environment/dynamic-environment";
import InternalUrlProvider from "@talkie/split-environment/internal-url-provider";
import LocaleProvider from "@talkie/split-environment/locale-provider";
import ManifestProvider from "@talkie/split-environment/manifest-provider";
import StorageProvider from "@talkie/split-environment/storage-provider";
import TranslatorProvider from "@talkie/split-environment/translator-provider";

import ButtonPopupManager from "../button-popup-manager";
import ClipboardManager from "../clipboard-manager";
import CommandHandler from "../command-handler";
import {
	IBrowserCommandMap,
} from "../command-handler-types";
import ContextMenuManager from "../context-menu-manager";
import IconManager from "../icon-manager";
import LanguageHelper from "../language-helper";
import NonBreakingChain from "../non-breaking-chain";
import OnInstalledManager from "../on-installed-manager";
import {
	OnInstallEvent,
} from "../on-installed-manager-types";
import OnlyLastCaller from "../only-last-caller";
import PermissionsManager from "../permissions-manager";
import ReadClipboardManager from "../read-clipboard-manager";
import ShortcutKeyManager from "../shortcut-key-manager";
import SpeakingStatus from "../speaking-status";
import SuspensionConnectorManager from "../suspension-connector-manager";
import SuspensionManager from "../suspension-manager";
import TalkieBackground from "../talkie-background";
import TalkieSpeaker from "../talkie-speaker";
import VoiceLanguageManager from "../voice-language-manager";
import VoiceManager from "../voice-manager";
import VoicePitchManager from "../voice-pitch-manager";
import VoiceRateManager from "../voice-rate-manager";
import WelcomeManager from "../welcome-manager";
import getCommandMap from "./get-command-map";

export interface BackgroundDependencies{
	broadcaster: Broadcaster;
	buttonPopupManager: ButtonPopupManager;
	configuration: Configuration;
	contextMenuManager: ContextMenuManager;
	iconManager: IconManager;
	metadataManager: MetadataManager;
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
	const talkieBackground = new TalkieBackground(speechChain, broadcaster, talkieSpeaker, speakingStatus, voiceManager, languageHelper, execute, translatorProvider, internalUrlProvider);
	const permissionsManager = new PermissionsManager();
	const clipboardManager = new ClipboardManager(permissionsManager);
	const readClipboardManager = new ReadClipboardManager(clipboardManager, talkieBackground, permissionsManager, metadataManager, translatorProvider);

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
	const onInstalledManager = new OnInstalledManager(storageManager, settingsManager, metadataManager, contextMenuManager, welcomeManager, onInstallListenerEventQueue);

	return {
		broadcaster,
		buttonPopupManager,
		configuration,
		contextMenuManager,
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
