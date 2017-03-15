/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

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
} from "../shared/promise";

import {
    log,
    logError,
    logDebug,
} from "../shared/log";

import {
    uiLocale,
    messagesLocale,
} from "../shared/configuration";

import {
    knownEvents,
} from "../shared/events";

import {
    openUrlFromConfigurationInNewTab,
} from "../shared/urls";

import TalkieProgress from "../shared/talkie-progress";

import Broadcaster from "../shared/broadcaster";

import {
    executePlugOnce,
} from "../shared/plug";

import SuspensionManager from "./suspension-manager";

import TalkieSpeaker from "./talkie-speaker";

import SpeakingStatus from "./speaking-status";

import IconManager from "./icon-manager";

import ButtonPopupManager from "./button-popup-manager";

import CommandHandler from "./command-handler";

import OnlyLastCaller from "./only-last-caller";

import Chain from "./chain";

import TalkieBackground from "./talkie-background";

import ContextMenuManager from "./context-menu-manager";

import ShortcutKeyManager from "./shortcut-key-manager";

log("Start", "Loading background code");

function main() {
    log("Locale (@@ui_locale)", uiLocale);
    log("Locale (messages.json)", messagesLocale);

    // NOTE: using a chainer to be able to add click-driven speech events one after another.
    const rootChain = new Chain();

    const broadcaster = new Broadcaster();

    const onlyLastCaller = new OnlyLastCaller();
    const shouldContinueSpeakingProvider = onlyLastCaller;
    const talkieSpeaker = new TalkieSpeaker(broadcaster, shouldContinueSpeakingProvider);
    const speakingStatus = new SpeakingStatus();

    const talkieBackground = new TalkieBackground(rootChain, talkieSpeaker, speakingStatus);

    const commandMap = {
        // NOTE: implicitly set by the browser, and actually "clicks" the Talkie icon.
        // Handled by the popup handler (popup contents) and icon click handler.
        // "_execute_browser_action": talkieBackground.startStopSpeakSelectionOnPage(),
        "start-stop": () => talkieBackground.startStopSpeakSelectionOnPage(),
        "start-text": (text) => talkieBackground.startSpeakingCustomTextDetectLanguage(text),
        "open-website-main": () => openUrlFromConfigurationInNewTab("main"),
        "open-website-chromewebstore": () => openUrlFromConfigurationInNewTab("chromewebstore"),
        "open-website-donate": () => openUrlFromConfigurationInNewTab("donate"),
    };

    const commandHandler = new CommandHandler(commandMap);
    const contextMenuManager = new ContextMenuManager(commandHandler);
    const shortcutKeyManager = new ShortcutKeyManager(commandHandler);

    const suspensionManager = new SuspensionManager();
    const iconManager = new IconManager();
    const buttonPopupManager = new ButtonPopupManager();

    const progress = new TalkieProgress(broadcaster);

    (function addChromeOnInstalledListeners() {
        const onExtensionInstalledHandler = () => promiseTry(
                () => contextMenuManager.createContextMenus()
                    .catch((error) => logError("onExtensionInstalledHandler", error))
            );

        // NOTE: "This event is not triggered for temporarily installed add-ons."
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onInstalled#Compatibility_notes
        if (browser.runtime.onInstalled) {
            // NOTE: the onInstalled listener can't be added asynchronously
            browser.runtime.onInstalled.addListener(onExtensionInstalledHandler);
        } else {
            onExtensionInstalledHandler();
        }
    }());

    (function registerBroadcastListeners() {
        broadcaster.registerListeningAction(knownEvents.stopSpeaking, () => onlyLastCaller.incrementCallerId());
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => onlyLastCaller.incrementCallerId());

        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => executePlugOnce());

        broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => speakingStatus.setActiveTabAsSpeaking());
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => speakingStatus.setActiveTabIsDoneSpeaking());

        // NOTE: setting icons async.
        broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => { setTimeout(() => iconManager.setIconModePlaying(), 10); return undefined; });
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => { setTimeout(() => iconManager.setIconModeStopped(), 10); return undefined; });

        broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => buttonPopupManager.disablePopup());
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => buttonPopupManager.enablePopup());

        broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => suspensionManager.preventExtensionSuspend());
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => suspensionManager.allowExtensionSuspend());

        broadcaster.registerListeningAction(knownEvents.beforeSpeaking, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => progress.resetProgress(0, actionData.text.length, 0));
        broadcaster.registerListeningAction(knownEvents.beforeSpeakingPart, (/* eslint-disable no-unused-vars*/actionName/* eslint-enable no-unused-vars*/, actionData) => progress.startSegment(actionData.textPart.length));
        broadcaster.registerListeningAction(knownEvents.afterSpeakingPart, () => progress.endSegment());
        broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => progress.finishProgress());
    }());

    (function addChromeListeners() {
        browser.tabs.onRemoved.addListener(() => talkieBackground.onTabRemovedHandler());
        browser.tabs.onUpdated.addListener(() => talkieBackground.onTabUpdatedHandler());

        // NOTE: not supported in Firefox (2017-03-15).
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/onSuspend#Browser_compatibility
        if (browser.runtime.onSuspend) {
            browser.runtime.onSuspend.addListener(() => talkieBackground.onExtensionSuspendHandler());
        }

        // NOTE: used when the popup has been disabled.
        browser.browserAction.onClicked.addListener(() => talkieBackground.startStopSpeakSelectionOnPage());

        browser.contextMenus.onClicked.addListener((info) => contextMenuManager.contextMenuClickAction(info));

        // NOTE: might throw an unexpected error in Firefox due to command configuration in manifest.json.
        // Does not seem to happen in Chrome.
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/commands/onCommand
        try {
            browser.commands.onCommand.addListener((command) => shortcutKeyManager.handler(command));
        } catch (error) {
            logError("browser.commands.onCommand.addListener(...)", error);
        }
    }());

    (function exportBackgroundFunctions() {
        window.broadcaster = broadcaster;
        window.progress = progress;

        window.log = log;
        window.logError = logError;
        window.logDebug = logDebug;

        window.getAllVoices = () => talkieSpeaker.getAllVoices();
        window.iconClick = () => talkieBackground.startStopSpeakSelectionOnPage();
        window.stopSpeakFromFrontend = () => talkieBackground.stopSpeakingAction();
        window.startSpeakFromFrontend = (text, voice) => talkieBackground.startSpeakingTextInVoiceAction(text, voice);
    }());

    buttonPopupManager.enablePopup();
}

try {
    main();
} catch (error) {
    logError("onExtensionInstalledHandler", error);
}

log("Done", "Loading background code");
