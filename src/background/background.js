/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import {
    promiseTry,
    promiseSleep,
} from "../shared/promise";

import {
    logTrace,
    logDebug,
    logInfo,
    logWarn,
    logError,
    setLevel,
    setStringOnlyOutput,
} from "../shared/log";

import {
    loggedPromise,
} from "../shared/promise-logging";

import {
    registerUnhandledRejectionHandler,
} from "../shared/error-handling";

import configurationObject from "../configuration.json";

import Configuration from "../shared/configuration";

import {
    knownEvents,
} from "../shared/events";

import {
    openUrlFromConfigurationInNewTab,
} from "../shared/urls";

import TalkieProgress from "../shared/talkie-progress";

import Broadcaster from "../shared/broadcaster";

import ContentLogger from "../shared/content-logger";

import Plug from "../shared/plug";

import SuspensionConnectorManager from "./suspension-connector-manager";
import SuspensionManager from "./suspension-manager";

import TalkieSpeaker from "./talkie-speaker";

import VoiceLanguageManager from "./voice-language-manager";
import VoiceRateManager from "./voice-rate-manager";
import VoicePitchManager from "./voice-pitch-manager";
import VoiceManager from "./voice-manager";

import SpeakingStatus from "./speaking-status";

import IconManager from "./icon-manager";

import ButtonPopupManager from "./button-popup-manager";

import CommandHandler from "./command-handler";

import OnlyLastCaller from "./only-last-caller";

import Chain from "./chain";

import TalkieBackground from "./talkie-background";

import PermissionsManager from "./permissions-manager";

import ClipboardManager from "./clipboard-manager";
import ReadClipboardManager from "./read-clipboard-manager";

import ContextMenuManager from "./context-menu-manager";

import ShortcutKeyManager from "./shortcut-key-manager";

import MetadataManager from "./metadata-manager";

import StorageManager from "./storage-manager";

import LanguageHelper from "./language-helper";

import Execute from "../shared/execute";

registerUnhandledRejectionHandler();

function main() {
    logDebug("Start", "Main background function");

    const metadataManager = new MetadataManager();
    const configuration = new Configuration(metadataManager, configurationObject);

    const broadcaster = new Broadcaster();

    const onlyLastCaller = new OnlyLastCaller();
    const shouldContinueSpeakingProvider = onlyLastCaller;
    const execute = new Execute();
    const contentLogger = new ContentLogger(execute, configuration);
    const talkieSpeaker = new TalkieSpeaker(broadcaster, shouldContinueSpeakingProvider, contentLogger);
    const speakingStatus = new SpeakingStatus();

    const storageManager = new StorageManager();
    const voiceLanguageManager = new VoiceLanguageManager(storageManager, metadataManager);
    const voiceRateManager = new VoiceRateManager(storageManager, metadataManager);
    const voicePitchManager = new VoicePitchManager(storageManager, metadataManager);
    const voiceManager = new VoiceManager(voiceLanguageManager, voiceRateManager, voicePitchManager);
    const languageHelper = new LanguageHelper(contentLogger, configuration);

    // NOTE: using a chainer to be able to add user (click/shortcut key/context menu) initialized speech events one after another.
    const speechChain = new Chain();
    const talkieBackground = new TalkieBackground(speechChain, talkieSpeaker, speakingStatus, voiceManager, languageHelper, configuration, execute);
    const permissionsManager = new PermissionsManager();
    const clipboardManager = new ClipboardManager(talkieBackground, permissionsManager);
    const readClipboardManager = new ReadClipboardManager(clipboardManager, talkieBackground, permissionsManager, metadataManager);

    const commandMap = {
        // NOTE: implicitly set by the browser, and actually "clicks" the Talkie icon.
        // Handled by the popup handler (popup contents) and icon click handler.
        // "_execute_browser_action": talkieBackground.startStopSpeakSelectionOnPage(),
        "start-stop": () => talkieBackground.startStopSpeakSelectionOnPage(),
        "start-text": (text) => talkieBackground.startSpeakingCustomTextDetectLanguage(text),
        "read-clipboard": () => readClipboardManager.startSpeaking(),
        "open-website-main": () => openUrlFromConfigurationInNewTab("main"),
        "open-website-store-free": () => openUrlFromConfigurationInNewTab("store-free"),
        "open-website-store-premium": () => openUrlFromConfigurationInNewTab("store-premium"),
        "open-website-donate": () => openUrlFromConfigurationInNewTab("donate"),
    };

    const commandHandler = new CommandHandler(commandMap);
    const contextMenuManager = new ContextMenuManager(commandHandler, metadataManager);
    const shortcutKeyManager = new ShortcutKeyManager(commandHandler);

    const suspensionConnectorManager = new SuspensionConnectorManager();
    const suspensionManager = new SuspensionManager(suspensionConnectorManager);
    const iconManager = new IconManager(metadataManager);
    const buttonPopupManager = new ButtonPopupManager();

    const progress = new TalkieProgress(broadcaster);

    const plug = new Plug(contentLogger, execute);

    (function addChromeOnInstalledListeners() {
        const initializeOptionsDefaults = () => {
            // TODO: more generic default option value system?
            const hideDonationsOptionId = "options-popup-donate-buttons-hide";

            return Promise.all([
                storageManager.getStoredValue(hideDonationsOptionId),
                metadataManager.isPremiumVersion(),
            ])
                .then(([hideDonations, isPremiumVersion]) => {
                    if (typeof hideDonations !== "boolean") {
                        // NOTE: don't bother premium users, unless they want to be bothered.
                        if (isPremiumVersion) {
                            return storageManager.setStoredValue(hideDonationsOptionId, true);
                        }

                        return storageManager.setStoredValue(hideDonationsOptionId, false);
                    }

                    return undefined;
                });
        };

        const onExtensionInstalledHandler = () => promiseTry(
                () => Promise.resolve()
                    .then(() => storageManager.upgradeIfNecessary())
                    .then(() => initializeOptionsDefaults())
                    .then(() => contextMenuManager.createContextMenus())
                    .catch((error) => logError("onExtensionInstalledHandler", error))
            );

        const onExtensionInstalledFallback = () => promiseTry(
                () => contextMenuManager.removeAll()
                    .then(() => onExtensionInstalledHandler())
                    .catch((error) => logError("onExtensionInstalledFallback", error))
            );

        // NOTE: "This event is not triggered for temporarily installed add-ons."
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled#Compatibility_notes
        // NOTE: When using the WebExtensions polyfill, this check doesn't seem to work as browser.runtime.onInstalled always exists.
        // https://github.com/mozilla/webextension-polyfill
        if (browser.runtime.onInstalled) {
            // NOTE: the onInstalled listener can't be added asynchronously
            browser.runtime.onInstalled.addListener(loggedPromise("onInstalled", onExtensionInstalledHandler));
        } else {
            onExtensionInstalledFallback();
        }
    }());

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
            window.addEventListener("unload", () => {
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

                broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => buttonPopupManager.disablePopup()),
                broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => buttonPopupManager.enablePopup()),

                broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => suspensionManager.preventExtensionSuspend()),
                broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => suspensionManager.allowExtensionSuspend()),

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
            browser.tabs.onRemoved.addListener(loggedPromise("onRemoved", () => talkieBackground.onTabRemovedHandler()));
            browser.tabs.onUpdated.addListener(loggedPromise("onUpdated", () => talkieBackground.onTabUpdatedHandler()));

            // NOTE: not supported in Firefox (2017-04-28).
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
            if (browser.runtime.onSuspend) {
                browser.runtime.onSuspend.addListener(loggedPromise("onSuspend", () => talkieBackground.onExtensionSuspendHandler()));
                // browser.runtime.onSuspend.addListener(loggedPromise("onSuspend", () => suspensionManager.unintialize()));
            }

            // NOTE: not supported in Firefox (2017-04-28).
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
            if (browser.runtime.onSuspendCanceled) {
                // browser.runtime.onSuspendCanceled.addListener(loggedPromise("onSuspendCanceled", () => suspensionManager.initialize()));
            }

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
                const text = "" + frontendText;
                const voice = {
                    name: "" + frontendVoice.name,
                    lang: "" + frontendVoice.lang,
                    rate: 0 + frontendVoice.rate,
                    pitch: 0 + frontendVoice.pitch,
                };

                talkieBackground.startSpeakingTextInVoiceAction(text, voice);
            };

            window.getVersionName = () => metadataManager.getVersionName();
            window.isFreeVersion = () => metadataManager.isFreeVersion();
            window.isPremiumVersion = () => metadataManager.isPremiumVersion();
            window.getSystemType = () => metadataManager.getSystemType();
            window.getOsType = () => metadataManager.getOsType();

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

            logInfo("Locale (@@ui_locale)", configuration.uiLocale);
            logInfo("Locale (messages.json)", configuration.messagesLocale);

            logDebug("Done", "Main background function");

            return undefined;
        });
}

try {
    main();
} catch (error) {
    logError("onExtensionInstalledHandler", error);
}
