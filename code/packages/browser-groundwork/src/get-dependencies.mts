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

import ButtonPopupManager from "@talkie/browser-bricks/button-popup-manager.mjs";
import CommandHandler from "@talkie/browser-bricks/command-handler.mjs";
import type {
	IBrowserCommandMap,
} from "@talkie/browser-bricks/command-handler-types.mjs";
import ContextMenuManager from "@talkie/browser-bricks/context-menu-manager.mjs";
import HistoryManager from "@talkie/browser-bricks/history-manager.mjs";
import IconManager from "@talkie/browser-bricks/icon-manager.mjs";
import LanguageHelper from "@talkie/browser-bricks/language-helper.mjs";
import NonBreakingChain from "@talkie/browser-bricks/non-breaking-chain.mjs";
import OnInstalledManager from "@talkie/browser-bricks/on-installed-manager.mjs";
import type {
	OnInstallEvent,
} from "@talkie/browser-bricks/on-installed-manager-types.mjs";
import OnTabEventHandlers from "@talkie/browser-bricks/on-tab-event-handlers.mjs";
import OnlyLastCaller from "@talkie/browser-bricks/only-last-caller.mjs";
import ShortcutKeyManager from "@talkie/browser-bricks/shortcut-key-manager.mjs";
import SpeakClipboardManager from "@talkie/browser-bricks/speak-clipboard-manager.mjs";
import Speaker from "@talkie/browser-bricks/speaker.mjs";
import SpeakerManager from "@talkie/browser-bricks/speaker-manager.mjs";
import SpeakerPageManager from "@talkie/browser-bricks/speaker-page-manager.mjs";
import SpeakingStatus from "@talkie/browser-bricks/speaking-status.mjs";
import UiManager from "@talkie/browser-bricks/ui-manager.mjs";
import VoiceLanguageManager from "@talkie/browser-bricks/voice-language-manager.mjs";
import VoiceManager from "@talkie/browser-bricks/voice-manager.mjs";
import VoicePitchManager from "@talkie/browser-bricks/voice-pitch-manager.mjs";
import VoiceRateManager from "@talkie/browser-bricks/voice-rate-manager.mjs";
import WelcomeManager from "@talkie/browser-bricks/welcome-manager.mjs";
import Execute from "@talkie/browser-shared/execute.mjs";
import PermissionsProvider from "@talkie/browser-shared/permissions-provider.mjs";
import ReadClipboardPermissionManager from "@talkie/browser-shared/read-clipboard-permission-manager.mjs";
import SelectedTextManager from "@talkie/browser-shared/selected-text-manager.mjs";
import Configuration from "@talkie/shared-application/configuration/configuration.mjs";
import configurationObject from "@talkie/shared-application/data/configuration/configuration.mjs";
import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import PremiumManager from "@talkie/shared-application/premium-manager.mjs";
import SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import StorageManager from "@talkie/shared-application/storage-manager.mjs";
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";
import TalkieProgress from "@talkie/shared-ui/talkie-progress.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import DynamicEnvironmentProvider from "@talkie/split-environment-webextension/dynamic-environment.mjs";
import InternalUrlProvider from "@talkie/split-environment-webextension/internal-url-provider.mjs";
import LocaleProvider from "@talkie/split-environment-webextension/locale-provider.mjs";
import ManifestProvider from "@talkie/split-environment-webextension/manifest-provider.mjs";
import PremiumProvider from "@talkie/split-environment-webextension/premium-provider.mjs";
import StorageProvider from "@talkie/split-environment-webextension/storage-provider.mjs";
import TranslatorProvider from "@talkie/split-environment-webextension/translator-provider.mjs";

import getCommandMap from "./get-command-map.mjs";

export interface BackgroundDependencies {
	buttonPopupManager: ButtonPopupManager;
	configuration: IConfiguration;
	contextMenuManager: ContextMenuManager;
	historyManager: HistoryManager;
	iconManager: IconManager;
	onInstalledManager: OnInstalledManager;
	onlyLastCaller: OnlyLastCaller;
	onTabEventHandlers: OnTabEventHandlers;
	premiumManager: IPremiumManager;
	progress: TalkieProgress;
	readClipboardManager: SpeakClipboardManager;
	settingsManager: SettingsManager;
	shortcutKeyManager: ShortcutKeyManager;
	speaker: Speaker;
	speakerManager: SpeakerManager;
	speakerPageManager: SpeakerPageManager;
	speakingStatus: SpeakingStatus;
	voiceManager: VoiceManager;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const getDependencies = (onInstallListenerEventQueue: OnInstallEvent[], messageBusProviderGetter: IMessageBusProviderGetter): BackgroundDependencies => {
	// TODO: systematic cleanup of classes and their side-effects.
	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const settingsManager = new SettingsManager(storageManager, messageBusProviderGetter);
	const premiumProvider = new PremiumProvider(settingsManager);
	const premiumManager = new PremiumManager(premiumProvider);
	const manifestProvider = new ManifestProvider();
	const dynamicEnvironmentProvider = new DynamicEnvironmentProvider();
	const metadataManager = new MetadataManager(manifestProvider, dynamicEnvironmentProvider);
	const internalUrlProvider = new InternalUrlProvider();
	const configuration = new Configuration(metadataManager, configurationObject);

	const onlyLastCaller = new OnlyLastCaller();
	const shouldContinueSpeakingProvider = onlyLastCaller;
	const execute = new Execute();
	const selectedTextManager = new SelectedTextManager(execute);

	// NOTE: using a chainer to be able to add user (click/shortcut key/context menu) initialized speech events one after another.
	const speechChain = new NonBreakingChain();
	const speaker = new Speaker(messageBusProviderGetter, shouldContinueSpeakingProvider, speechChain);
	const speakingStatus = new SpeakingStatus();

	const voiceLanguageManager = new VoiceLanguageManager(messageBusProviderGetter, storageManager, premiumManager);
	const voiceRateManager = new VoiceRateManager(storageManager, premiumManager);
	const voicePitchManager = new VoicePitchManager(storageManager, premiumManager);
	const voiceManager = new VoiceManager(voiceLanguageManager, voiceRateManager, voicePitchManager);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const languageHelper = new LanguageHelper(translatorProvider);

	const onTabEventHandlers = new OnTabEventHandlers(speaker, speakingStatus, settingsManager);
	const speakerManager = new SpeakerManager(
		speaker,
		voiceManager,
		settingsManager,
	);
	const speakerPageManager = new SpeakerPageManager(
		messageBusProviderGetter,
		speaker,
		speakerManager,
		languageHelper,
		translatorProvider,
		internalUrlProvider,
		selectedTextManager,
		speakingStatus,
	);
	const permissionsManager = new PermissionsProvider();
	const readClipboardPermissionManager = new ReadClipboardPermissionManager(permissionsManager);
	const readClipboardManager = new SpeakClipboardManager(
		messageBusProviderGetter,
		speakerPageManager,
		readClipboardPermissionManager,
		premiumManager,
		translatorProvider,
	);
	const historyManager = new HistoryManager(settingsManager, messageBusProviderGetter);

	const uiManager = new UiManager(configuration);
	const commandMap: IBrowserCommandMap = getCommandMap(readClipboardManager, uiManager, speakerPageManager);

	const commandHandler = new CommandHandler(commandMap);
	const contextMenuManager = new ContextMenuManager(commandHandler, metadataManager, premiumManager, translatorProvider);
	const shortcutKeyManager = new ShortcutKeyManager(commandHandler);

	const iconManager = new IconManager(premiumManager);
	const buttonPopupManager = new ButtonPopupManager(translatorProvider, premiumManager);

	const progress = new TalkieProgress(messageBusProviderGetter);

	const welcomeManager = new WelcomeManager(uiManager);
	const onInstalledManager = new OnInstalledManager(
		storageManager,
		settingsManager,
		metadataManager,
		contextMenuManager,
		welcomeManager,
		onInstallListenerEventQueue,
	);

	return {
		buttonPopupManager,
		configuration,
		contextMenuManager,
		historyManager,
		iconManager,
		onInstalledManager,
		onTabEventHandlers,
		onlyLastCaller,
		premiumManager,
		progress,
		readClipboardManager,
		settingsManager,
		shortcutKeyManager,
		speaker,
		speakerManager,
		speakerPageManager,
		speakingStatus,
		voiceManager,
	};
};

export default getDependencies;
