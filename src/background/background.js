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

import configurationObject from "../configuration.json";
import Broadcaster from "../shared/broadcaster";
import Configuration from "../shared/configuration";
import ContentLogger from "../shared/content-logger";
import {
	registerUnhandledRejectionHandler,
} from "../shared/error-handling";
import {
	knownEvents,
} from "../shared/events";
import Execute from "../shared/execute";
import {
	logDebug,
	logError,
	logInfo,
	logTrace,
	logWarn,
	setLevel,
	setStringOnlyOutput,
} from "../shared/log";
import MetadataManager from "../shared/metadata-manager";
import Plug from "../shared/plug";
import {
	promiseSleep,
} from "../shared/promise";
import {
	loggedPromise,
} from "../shared/promise-logging";
import SettingsManager from "../shared/settings-manager";
import StorageManager from "../shared/storage-manager";
import TalkieProgress from "../shared/talkie-progress";
import {
	openUrlFromConfigurationInNewTab,
} from "../shared/urls";
import InternalUrlProvider from "../split-environments/internal-url-provider";
import LocaleProvider from "../split-environments/locale-provider";
import ManifestProvider from "../split-environments/manifest-provider";
import StorageProvider from "../split-environments/storage-provider";
import TranslatorProvider from "../split-environments/translator-provider";
import ButtonPopupManager from "./button-popup-manager";
import Chain from "./chain";
import ClipboardManager from "./clipboard-manager";
import CommandHandler from "./command-handler";
import ContextMenuManager from "./context-menu-manager";
import IconManager from "./icon-manager";
import LanguageHelper from "./language-helper";
import OnInstalledManager from "./on-installed-manager";
import OnlyLastCaller from "./only-last-caller";
import PermissionsManager from "./permissions-manager";
import ReadClipboardManager from "./read-clipboard-manager";
import ShortcutKeyManager from "./shortcut-key-manager";
import SpeakingStatus from "./speaking-status";
import SuspensionConnectorManager from "./suspension-connector-manager";
import SuspensionManager from "./suspension-manager";
import TalkieBackground from "./talkie-background";
import TalkieSpeaker from "./talkie-speaker";
import VoiceLanguageManager from "./voice-language-manager";
import VoiceManager from "./voice-manager";
import VoicePitchManager from "./voice-pitch-manager";
import VoiceRateManager from "./voice-rate-manager";
import WelcomeManager from "./welcome-manager";

registerUnhandledRejectionHandler();

// NOTE: synchronous handling of the onInstall event through a separate, polled queue handled by the OnInstalledManager.
const onInstallListenerEventQueue = [];

const startOnInstallListener = () => {
	const onInstallListener = (event) => {
		const onInstallEvent = {
			source: "event",
			event,
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	};

	// NOTE: "This event is not triggered for temporarily installed add-ons."
	// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled#Compatibility_notes
	// NOTE: When using the WebExtensions polyfill, this check doesn't seem to work as browser.runtime.onInstalled always exists.
	// https://github.com/mozilla/webextension-polyfill
	if (browser.runtime.onInstalled) {
		// NOTE: the onInstalled listener can't be added asynchronously
		browser.runtime.onInstalled.addListener(onInstallListener);
	} else {
		const onInstallEvent = {
			source: "fallback",
			event: null,
		};

		onInstallListenerEventQueue.push(onInstallEvent);
	}
};

function main() {
	logDebug("Start", "Main background function");

	const storageProvider = new StorageProvider();
	const storageManager = new StorageManager(storageProvider);
	const settingsManager = new SettingsManager(storageManager);
	const manifestProvider = new ManifestProvider();
	const metadataManager = new MetadataManager(manifestProvider, settingsManager);
	const internalUrlProvider = new InternalUrlProvider();
	const configuration = new Configuration(metadataManager, configurationObject);

	const broadcaster = new Broadcaster();

	const onlyLastCaller = new OnlyLastCaller();
	const shouldContinueSpeakingProvider = onlyLastCaller;
	const execute = new Execute();
	const contentLogger = new ContentLogger(execute, configuration);
	const talkieSpeaker = new TalkieSpeaker(broadcaster, shouldContinueSpeakingProvider, contentLogger, settingsManager);
	const speakingStatus = new SpeakingStatus();

	const voiceLanguageManager = new VoiceLanguageManager(storageManager, metadataManager);
	const voiceRateManager = new VoiceRateManager(storageManager, metadataManager);
	const voicePitchManager = new VoicePitchManager(storageManager, metadataManager);
	const voiceManager = new VoiceManager(voiceLanguageManager, voiceRateManager, voicePitchManager);
	const localeProvider = new LocaleProvider();
	const translatorProvider = new TranslatorProvider(localeProvider);
	const languageHelper = new LanguageHelper(contentLogger, configuration, translatorProvider);

	// NOTE: using a chainer to be able to add user (click/shortcut key/context menu) initialized speech events one after another.
	const speechChain = new Chain();
	const talkieBackground = new TalkieBackground(speechChain, broadcaster, talkieSpeaker, speakingStatus, voiceManager, languageHelper, configuration, execute, translatorProvider, internalUrlProvider);
	const permissionsManager = new PermissionsManager();
	const clipboardManager = new ClipboardManager(talkieBackground, permissionsManager);
	const readClipboardManager = new ReadClipboardManager(clipboardManager, talkieBackground, permissionsManager, metadataManager, translatorProvider);

	const commandMap = {
		// NOTE: implicitly set by the browser, and actually "clicks" the Talkie icon.
		// Handled by the popup handler (popup contents) and icon click handler.
		// "_execute_browser_action": talkieBackground.startStopSpeakSelectionOnPage(),
		"start-stop": () => talkieBackground.startStopSpeakSelectionOnPage(),
		"start-text": (text) => talkieBackground.startSpeakingCustomTextDetectLanguage(text),
		"read-clipboard": () => readClipboardManager.startSpeaking(),
		"open-website-main": () => openUrlFromConfigurationInNewTab("main"),
		"open-website-upgrade": () => openUrlFromConfigurationInNewTab("upgrade"),
	};

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

	(function addOnInstalledEventQueuePolling() {
		// NOTE: run the function once first, to allow for a very long interval.
		const ONE_SECOND_IN_MILLISECONDS = 1 * 1000;
		const ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_TIMEOUT = ONE_SECOND_IN_MILLISECONDS;

		/* eslint-disable no-unused-vars */
		const onInstallListenerEventQueueHandlerTimeoutId = setTimeout(
			() => onInstalledManager.onInstallListenerEventQueueHandler(),
			ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_TIMEOUT,
		);
		/* eslint-enable no-unused-vars */

		// NOTE: run the function with a very long interval.
		const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000;
		const ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_INTERVAL = ONE_HOUR_IN_MILLISECONDS;

		/* eslint-disable no-unused-vars */
		const onInstallListenerEventQueueHandlerIntervalId = setInterval(
			() => onInstalledManager.onInstallListenerEventQueueHandler(),
			ON_INSTALL_LISTENER_EVENT_QUEUE_HANDLER_INTERVAL,
		);
		/* eslint-enable no-unused-vars */
	})();

	// NOTE: cache listeners so they can be added and removed by reference before/after speaking.
	const onTabRemovedListener = loggedPromise("onRemoved", () => talkieBackground.onTabRemovedHandler());
	const onTabUpdatedListener = loggedPromise("onUpdated", () => talkieBackground.onTabUpdatedHandler());

	// TODO: put initialization promise on the root chain?
	return Promise.resolve()
		.then(() => suspensionManager.initialize())
		.then(() => {
			const killSwitches = [];

			const executeKillSwitches = () => {
				// NOTE: expected to have only synchronous methods for the relevant parts.
				killSwitches.forEach((killSwitch) => {
					try {
						killSwitch();
					} catch (error) {
						logError("executeKillSwitches", error);
					}
				});
			};

			// NOTE: synchronous version.
			window.addEventListener("beforeunload", () => {
				executeKillSwitches();
			});

			return Promise.all([
				broadcaster.registerListeningAction(knownEvents.stopSpeaking, () => onlyLastCaller.incrementCallerId()),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => onlyLastCaller.incrementCallerId()),

				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => plug.once()
					.catch((error) => {
						// NOTE: swallowing any plug.once() errors.
						// NOTE: reduced logging for known tab/page access problems.
						if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
							logDebug("plug.once", "Error swallowed", error);
						} else {
							logInfo("plug.once", "Error swallowed", error);
						}

						return undefined;
					})),

				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => speakingStatus.setActiveTabAsSpeaking()),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => speakingStatus.setDoneSpeaking()),

				// NOTE: setting icons async.
				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => promiseSleep(() => iconManager.setIconModePlaying(), 10)),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => promiseSleep(() => iconManager.setIconModeStopped(), 10)),

				// NOTE: a feeble attempt to make the popup window render properly, instead of only a tiny box flashing away, as the reflow() has questionable effect.
				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => promiseSleep(() => buttonPopupManager.disablePopup(), 200)),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => promiseSleep(() => buttonPopupManager.enablePopup(), 200)),

				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => suspensionManager.preventExtensionSuspend()),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => suspensionManager.allowExtensionSuspend()),

				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => browser.tabs.onRemoved.addListener(onTabRemovedListener)),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => browser.tabs.onRemoved.removeListener(onTabRemovedListener)),

				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => browser.tabs.onUpdated.addListener(onTabUpdatedListener)),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => browser.tabs.onUpdated.removeListener(onTabUpdatedListener)),

				broadcaster.registerListeningAction(knownEvents.beforeSpeaking, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => progress.resetProgress(0, actionData.text.length, 0)),
				broadcaster.registerListeningAction(knownEvents.beforeSpeakingPart, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => progress.startSegment(actionData.textPart.length)),
				broadcaster.registerListeningAction(knownEvents.afterSpeakingPart, () => progress.endSegment()),
				broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => progress.finishProgress()),
			])
				.then((registeredKillSwitches) => {
					// NOTE: don't want to replace the existing killSwitches array.
					registeredKillSwitches.forEach((registeredKillSwitch) => killSwitches.push(registeredKillSwitch));

					return undefined;
				});
		})
		.then(() => {
			// NOTE: not supported in Firefox (2017-04-28).
			// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
			if ("onSuspend" in browser.runtime) {
				browser.runtime.onSuspend.addListener(loggedPromise("onSuspend", () => talkieBackground.onExtensionSuspendHandler()));
				// browser.runtime.onSuspend.addListener(loggedPromise("onSuspend", () => suspensionManager.unintialize()));
			}

			// NOTE: not supported in Firefox (2017-04-28).
			// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
			// if ("onSuspendCanceled" in browser.runtime) {
			//     browser.runtime.onSuspendCanceled.addListener(loggedPromise("onSuspendCanceled", () => suspensionManager.initialize()));
			// }

			// NOTE: used when the popup has been disabled.
			browser.browserAction.onClicked.addListener(loggedPromise("onClicked", () => talkieBackground.startStopSpeakSelectionOnPage()));

			browser.contextMenus.onClicked.addListener(loggedPromise("onClicked", (info) => contextMenuManager.contextMenuClickAction(info)));

			// NOTE: might throw an unexpected error in Firefox due to command configuration in manifest.json.
			// Does not seem to happen in Chrome.
			// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/commands/onCommand
			try {
				browser.commands.onCommand.addListener(loggedPromise("onCommand", (command) => shortcutKeyManager.handler(command)));
			} catch (error) {
				logError("browser.commands.onCommand.addListener(...)", error);
			}

			return undefined;
		})
		.then(() => {
			window.broadcaster = () => broadcaster;

			window.logTrace = (...args) => logTrace(...args);
			window.logDebug = (...args) => logDebug(...args);
			window.logInfo = (...args) => logInfo(...args);
			window.logWarn = (...args) => logWarn(...args);
			window.logError = (...args) => logError(...args);
			window.setLoggingLevel = (...args) => setLevel(...args);
			window.setLoggingStringOnlyOutput = (...args) => setStringOnlyOutput(...args);

			window.getAllVoices = () => talkieSpeaker.getAllVoices();
			window.iconClick = () => talkieBackground.startStopSpeakSelectionOnPage();
			window.stopSpeakFromFrontend = () => talkieBackground.stopSpeakingAction();
			window.startSpeakFromFrontend = (frontendText, frontendVoice) => {
				// NOTE: not sure if copying these variables have any effect.
				// NOTE: Hope it helps avoid some vague "TypeError: can't access dead object" in Firefox.
				const text = String(frontendText);
				const voice = {
					name: typeof frontendVoice.name === "string" ? String(frontendVoice.name) : undefined,
					lang: typeof frontendVoice.lang === "string" ? String(frontendVoice.lang) : undefined,
					rate: !isNaN(frontendVoice.rate) ? (0 + frontendVoice.rate) : undefined,
					pitch: !isNaN(frontendVoice.pitch) ? (0 + frontendVoice.pitch) : undefined,
				};

				talkieBackground.startSpeakingTextInVoiceAction(text, voice);
			};

			window.startSpeakInLanguageWithOverridesFromFrontend = (frontendText, frontendLanguageCode) => {
				// NOTE: not sure if copying these variables have any effect.
				// NOTE: Hope it helps avoid some vague "TypeError: can't access dead object" in Firefox.
				const text = String(frontendText);
				const languageCode = String(frontendLanguageCode);

				talkieBackground.startSpeakingTextInLanguageWithOverridesAction(text, languageCode);
			};

			window.getVersionNumber = () => metadataManager.getVersionNumber();
			window.getVersionName = () => metadataManager.getVersionName();
			window.getEditionType = () => metadataManager.getEditionType();
			window.isPremiumEdition = () => metadataManager.isPremiumEdition();
			window.getSystemType = () => metadataManager.getSystemType();
			window.getOsType = () => metadataManager.getOsType();

			window.getIsPremiumEditionOption = () => settingsManager.getIsPremiumEdition();
			window.setIsPremiumEditionOption = (isPremiumEdition) => settingsManager.setIsPremiumEdition(isPremiumEdition);
			window.getSpeakLongTextsOption = () => settingsManager.getSpeakLongTexts();
			window.setSpeakLongTextsOption = (speakLongTexts) => settingsManager.setSpeakLongTexts(speakLongTexts);

			window.setVoiceRateOverride = (voiceName, rate) => voiceManager.setVoiceRateOverride(voiceName, rate);
			window.getEffectiveVoiceForLanguage = (languageName) => voiceManager.getEffectiveVoiceForLanguage(languageName);
			window.isLanguageVoiceOverrideName = (languageName, voiceName) => voiceManager.isLanguageVoiceOverrideName(languageName, voiceName);
			window.toggleLanguageVoiceOverrideName = (languageName, voiceName) => voiceManager.toggleLanguageVoiceOverrideName(languageName, voiceName);
			window.getVoiceRateDefault = (voiceName) => voiceManager.getVoiceRateDefault(voiceName);
			window.setVoiceRateOverride = (voiceName, rate) => voiceManager.setVoiceRateOverride(voiceName, rate);
			window.getEffectiveRateForVoice = (voiceName) => voiceManager.getEffectiveRateForVoice(voiceName);
			window.getVoicePitchDefault = (voiceName) => voiceManager.getVoicePitchDefault(voiceName);
			window.setVoicePitchOverride = (voiceName, pitch) => voiceManager.setVoicePitchOverride(voiceName, pitch);
			window.getEffectivePitchForVoice = (voiceName) => voiceManager.getEffectivePitchForVoice(voiceName);
			window.getStoredValue = (key) => storageManager.getStoredValue(key);
			window.setStoredValue = (key, value) => storageManager.setStoredValue(key, value);
			window.getConfigurationValue = (path) => configuration.get(path);

			return undefined;
		})
		.then(() => {
			buttonPopupManager.enablePopup();

			logDebug("Done", "Main background function");

			return undefined;
		});
}

try {
	startOnInstallListener();

	main();
} catch (error) {
	logError("background", error);
}
