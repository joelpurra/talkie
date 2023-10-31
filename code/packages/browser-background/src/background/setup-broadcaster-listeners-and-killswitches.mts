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

import type Plug from "@talkie/browser-shared/plug.mjs";
import type Broadcaster from "@talkie/shared-application/broadcaster.mjs";
import {
	type PromiseFunction,
} from "@talkie/shared-application/promise-logging.mjs";
import {
	KnownSettingStorageKeys,
	type SettingChangedEventData,
} from "@talkie/shared-application/settings-manager.mjs";
import {
	logDebug,
	logError,
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	getSpeakingHistoryEntryTextHash,
} from "@talkie/shared-application-helpers/speaking-history.mjs";
import {
	type SpeakingEventData,
	type SpeakingEventPartData,
} from "@talkie/shared-interfaces/ispeaking-event.mjs";
import {
	type KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	knownEvents,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type TalkieProgress from "@talkie/shared-ui/talkie-progress.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import type ButtonPopupManager from "../button-popup-manager.mjs";
import type HistoryManager from "../history-manager.mjs";
import type IconManager from "../icon-manager.mjs";
import type OnlyLastCaller from "../only-last-caller.mjs";
import type SpeakingStatus from "../speaking-status.mjs";
import type SuspensionManager from "../suspension-manager.mjs";

const registerLastCallerListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	onlyLastCaller: ReadonlyDeep<OnlyLastCaller>,
) => [
	broadcaster.registerListeningAction(knownEvents.stopSpeaking, () => {
		onlyLastCaller.incrementCallerId();
	}),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => {
		onlyLastCaller.incrementCallerId();
	}),
];

const registerPlugOnceListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	plug: ReadonlyDeep<Plug>,
) => [
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => {
		try {
			await plug.once();
		} catch (error: unknown) {
			// NOTE: swallowing any plug.once() errors.
			// NOTE: reduced logging for known tab/page access problems.
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			if (error && typeof error === "object" && typeof (error as Error).message === "string" && (error as Error).message.startsWith("Cannot access")) {
				void logDebug("plug.once", "Error swallowed", typeof error, JSON.stringify(error), error);
			} else {
				void logInfo("plug.once", "Error swallowed", typeof error, JSON.stringify(error), error);
			}
		}
	}),
];

const registerSpeakingStatusListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	speakingStatus: ReadonlyDeep<SpeakingStatus>,
) => [
	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, async () => speakingStatus.setActiveTabAsSpeaking()),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => speakingStatus.setDoneSpeaking()),
];

const registerIconListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	iconManager: ReadonlyDeep<IconManager>,
) => [
	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, async () => {
		// NOTE: setting icons async outside of the root chain.
		void iconManager.setIconModePlaying();
	}),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => {
		// NOTE: setting icons async outside of the root chain.
		void iconManager.setIconModeStopped();
	}),
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	broadcaster.registerListeningAction<knownEvents.settingChanged, SettingChangedEventData<boolean>, void>(knownEvents.settingChanged, async (_name: knownEvents.settingChanged, data: Readonly<SettingChangedEventData<boolean>>) => {
		if (data.key === KnownSettingStorageKeys.IsPremiumEdition) {
			// NOTE: setting icons async outside of the root chain.
			// NOTE: if speech is playing, this will show the wrong icon.
			void iconManager.setIconModeStopped();
		}
	}),
];

const registerPopupListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	buttonPopupManager: ReadonlyDeep<ButtonPopupManager>,
) => [
	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, async () => {
		// NOTE: a feeble attempt to make the popup window render properly, instead of only a tiny box flashing away, as the reflow() has questionable effect.
		// NOTE: enable/disable popup async outside of the root chain.
		void buttonPopupManager.disablePopup();
	}),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => {
		// NOTE: enable/disable popup async outside of the root chain.
		void buttonPopupManager.enablePopup();
	}),
];

const registerSuspensionListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	suspensionManager: ReadonlyDeep<SuspensionManager>,
) => [
	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, async () => suspensionManager.preventExtensionSuspend()),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => suspensionManager.allowExtensionSuspend()),
];

const registerTabChangeListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabRemovedListener: PromiseFunction<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabUpdatedListener: PromiseFunction<any>,
): Array<Promise<KillSwitch>> => [
	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => {
		browser.tabs.onRemoved.addListener(onTabRemovedListener);
	}),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => {
		browser.tabs.onRemoved.removeListener(onTabRemovedListener);
	}),

	broadcaster.registerListeningAction(knownEvents.beforeSpeaking, () => {
		browser.tabs.onUpdated.addListener(onTabUpdatedListener);
	}),
	broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => {
		browser.tabs.onUpdated.removeListener(onTabUpdatedListener);
	}),
];

const registerProgressListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	progress: ReadonlyDeep<TalkieProgress>,
): Array<Promise<KillSwitch>> => [
	broadcaster.registerListeningAction<knownEvents.beforeSpeaking, Readonly<SpeakingEventData>, void>(
		knownEvents.beforeSpeaking,
		async (
			_actionName,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			actionData,
		) => progress.resetProgress(0, actionData.text.length, 0),
	),
	broadcaster.registerListeningAction<knownEvents.beforeSpeakingPart, Readonly<SpeakingEventPartData>, void>(
		knownEvents.beforeSpeakingPart,
		async (
			_actionName,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			actionData,
		) => {
			await progress.startSegment(actionData.textPart.length);
		},
	),

	broadcaster.registerListeningAction(knownEvents.afterSpeakingPart, async () => {
		await progress.endSegment();
	}),

	broadcaster.registerListeningAction(knownEvents.afterSpeaking, async () => {
		await progress.finishProgress();
	}),
];

const registerHistoryListeners = (
	broadcaster: ReadonlyDeep<Broadcaster>,
	historyManager: ReadonlyDeep<HistoryManager>,
): Array<Promise<KillSwitch>> => [
	broadcaster.registerListeningAction<knownEvents.beforeSpeaking, Readonly<SpeakingEventData>, void>(
		knownEvents.beforeSpeaking,
		async (
			_actionName,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			actionData,
		) => {
			const speakingHistoryEntry: SpeakingHistoryEntry = {
				hash: getSpeakingHistoryEntryTextHash(actionData.text),
				language: actionData.language,
				text: actionData.text,
				voiceName: actionData.voiceName,
			};

			return historyManager.storeMostRecentSpeakingEntry(speakingHistoryEntry);
		},
	),
];

const setupBroadcasterListenersAndKillswitches = async (
	broadcaster: ReadonlyDeep<Broadcaster>,
	onlyLastCaller: ReadonlyDeep<OnlyLastCaller>,
	plug: ReadonlyDeep<Plug>,
	speakingStatus: ReadonlyDeep<SpeakingStatus>,
	iconManager: ReadonlyDeep<IconManager>,
	buttonPopupManager: ReadonlyDeep<ButtonPopupManager>,
	suspensionManager: ReadonlyDeep<SuspensionManager>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabRemovedListener: PromiseFunction<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabUpdatedListener: PromiseFunction<any>,
	progress: ReadonlyDeep<TalkieProgress>,
	historyManager: ReadonlyDeep<HistoryManager>,
	// eslint-disable-next-line max-params
): Promise<void> => {
	const killSwitches: KillSwitch[] = [];

	const executeKillSwitches = () => {
		// NOTE: expected to have only synchronous methods for the relevant parts.
		for (const killSwitch of killSwitches) {
			try {
				killSwitch();
			} catch (error: unknown) {
				void logError("executeKillSwitches", error);
			}
		}
	};

	// NOTE: synchronous version.
	window.addEventListener("beforeunload", () => {
		executeKillSwitches();
	});

	const registeredKillSwitches = await Promise.all([
		...registerLastCallerListeners(broadcaster, onlyLastCaller),
		...registerPlugOnceListeners(broadcaster, plug),
		...registerSpeakingStatusListeners(broadcaster, speakingStatus),
		...registerIconListeners(broadcaster, iconManager),
		...registerPopupListeners(broadcaster, buttonPopupManager),
		...registerSuspensionListeners(broadcaster, suspensionManager),
		...registerTabChangeListeners(broadcaster, onTabRemovedListener, onTabUpdatedListener),
		...registerProgressListeners(broadcaster, progress),
		...registerHistoryListeners(broadcaster, historyManager),
	]);

	// NOTE: don't want to replace the existing killSwitches array.
	for (const registeredKillSwitch of registeredKillSwitches) {
		killSwitches.push(registeredKillSwitch);
	}
};

export default setupBroadcasterListenersAndKillswitches;
