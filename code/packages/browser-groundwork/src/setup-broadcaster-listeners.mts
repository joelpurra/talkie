/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type ButtonPopupManager from "@talkie/browser-bricks/button-popup-manager.mjs";
import type HistoryManager from "@talkie/browser-bricks/history-manager.mjs";
import type IconManager from "@talkie/browser-bricks/icon-manager.mjs";
import type OnlyLastCaller from "@talkie/browser-bricks/only-last-caller.mjs";
import type SpeakingStatus from "@talkie/browser-bricks/speaking-status.mjs";
import type StayAliveManager from "@talkie/browser-bricks/stay-alive-manager.mjs";
import type {
	PromiseFunction,
} from "@talkie/shared-application/promise-logging.mjs";
import type {
	SettingChangedEventData,
} from "@talkie/shared-application/settings-manager.mjs";
import type {
	SpeakingEventData,
	SpeakingEventPartData,
} from "@talkie/shared-interfaces/ispeaking-event.mjs";
import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";
import type TalkieProgress from "@talkie/shared-ui/talkie-progress.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	MessageBusAction,
} from "@talkie/split-environment-interfaces/imessage-bus.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";

import createMessageBusListenerHelpers, {
	type FakeMessageBusActionHandlerCrowdee,
	type IMessageBusListenerHelpers,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	KnownSettingStorageKeys,
} from "@talkie/shared-application/settings.mjs";
import {
	getSpeakingHistoryEntryTextHash,
} from "@talkie/shared-application-helpers/speaking-history.mjs";

const registerLastCallerListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	onlyLastCaller: ReadonlyDeep<OnlyLastCaller>,
) => [

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], () => {
		onlyLastCaller.incrementCallerId();
	}),
];

const registerSpeakingStatusListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	speakingStatus: ReadonlyDeep<SpeakingStatus>,
) => [
	startCrowdee("broadcaster:speaking:entire:before", async () => speakingStatus.setActiveTabAsSpeaking()),

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], async () => speakingStatus.setDoneSpeaking()),
];

const registerStayAliveManagerListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	stayAliveManager: ReadonlyDeep<StayAliveManager>,
) => [
	startCrowdee("broadcaster:speaking:entire:before", async () => stayAliveManager.stayAlive()),

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], async () => stayAliveManager.justLetGo()),
];

const registerIconListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	iconManager: ReadonlyDeep<IconManager>,
) => [
	startCrowdee("broadcaster:speaking:entire:before", async () => {
		// NOTE: setting icons async outside of the root chain.
		void iconManager.setIconModePlaying();
	}),

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], async () => {
		// NOTE: setting icons async outside of the root chain.
		void iconManager.setIconModeStopped();
	}),

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee<Readonly<SettingChangedEventData<boolean>>>("broadcaster:setting:changed", async (_actionName, actionData) => {
		if (actionData.key === KnownSettingStorageKeys.IsPremiumEdition) {
			// NOTE: setting icons async outside of the root chain.
			// NOTE: if speech is playing, this will show the wrong icon.
			void iconManager.setIconModeStopped();
		}
	}),
];

const registerPopupListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	buttonPopupManager: ReadonlyDeep<ButtonPopupManager>,
) => [
	startCrowdee("broadcaster:speaking:entire:before", async () => {
		// NOTE: a feeble attempt to make the popup window render properly, instead of only a tiny box flashing away, as the reflow() has questionable effect.
		// NOTE: enable/disable popup async outside of the root chain.
		void buttonPopupManager.disablePopup();
	}),

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], async () => {
		// NOTE: enable/disable popup async outside of the root chain.
		void buttonPopupManager.enablePopup();
	}),
];

const registerTabChangeListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabRemovedListener: PromiseFunction<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabUpdatedListener: PromiseFunction<any>,
) => [
	startCrowdee("broadcaster:speaking:entire:before", () => {
		chrome.tabs.onRemoved.addListener(onTabRemovedListener);
		chrome.tabs.onUpdated.addListener(onTabUpdatedListener);
	}),

	startCrowdee([
		"broadcaster:speaking:entire:after",
		"broadcaster:synthesizer:reset",
	], () => {
		chrome.tabs.onRemoved.removeListener(onTabRemovedListener);
		chrome.tabs.onUpdated.removeListener(onTabUpdatedListener);
	}),
];

const registerProgressListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	progress: ReadonlyDeep<TalkieProgress>,
) => [
	startCrowdee<Readonly<SpeakingEventData>>(
		"broadcaster:speaking:entire:before",
		async (
			_actionName,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			actionData,
		) => {
			await progress.resetProgress(0, actionData.text.length, 0);
		},
	),
	startCrowdee<Readonly<SpeakingEventPartData>>(
		"broadcaster:speaking:part:before",
		async (
			_actionName,
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			actionData,
		) => {
			await progress.startSegment(actionData.textPart.length);
		},
	),

	startCrowdee("broadcaster:speaking:part:after", async () => {
		await progress.endSegment();
	}),

	startCrowdee("broadcaster:speaking:entire:after", async () => {
		await progress.finishProgress();
	}),

	startCrowdee("broadcaster:synthesizer:reset", async () => {
		await progress.resetProgress();
	}),
];

const registerHistoryListeners = (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee: <T extends JsonValue = JsonValue>(actions: MessageBusAction[] | MessageBusAction, messageHandler: FakeMessageBusActionHandlerCrowdee<T>) => Promise<UninitializerCallback[]>,
	historyManager: ReadonlyDeep<HistoryManager>,
	bullhorn: IMessageBusListenerHelpers["bullhorn"],
) => [
	startCrowdee<Readonly<SpeakingEventData>>(
		"broadcaster:speaking:entire:before",
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

			await historyManager.storeMostRecentSpeakingEntry(speakingHistoryEntry);

			await bullhorn("broadcaster:history:most-recent:changed", speakingHistoryEntry);
		},
	),

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	startCrowdee<Readonly<SettingChangedEventData<boolean>>>("broadcaster:setting:changed", async (_actionName, actionData) => {
		if (actionData.key === KnownSettingStorageKeys.SpeakingHistoryLimit) {
			// NOTE: connecting the settings and history managers via events, instead of calling the history manager from the settings manager.
			await historyManager.pruneSpeakingHistory();
		}
	}),
];

const setupBroadcasterListeners = async (
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	uninitializers: UninitializerCallback[],
	messageBusProviderGetter: ReadonlyDeep<IMessageBusProviderGetter>,
	onlyLastCaller: ReadonlyDeep<OnlyLastCaller>,
	speakingStatus: ReadonlyDeep<SpeakingStatus>,
	stayAliveManager: ReadonlyDeep<StayAliveManager>,
	iconManager: ReadonlyDeep<IconManager>,
	buttonPopupManager: ReadonlyDeep<ButtonPopupManager>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabRemovedListener: PromiseFunction<any>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onTabUpdatedListener: PromiseFunction<any>,
	progress: ReadonlyDeep<TalkieProgress>,
	historyManager: ReadonlyDeep<HistoryManager>,
	// eslint-disable-next-line max-params
): Promise<void> => {
	const {
		bullhorn,
		startCrowdee,
	} = createMessageBusListenerHelpers(messageBusProviderGetter);

	const t = [
		registerLastCallerListeners(startCrowdee, onlyLastCaller),
		registerSpeakingStatusListeners(startCrowdee, speakingStatus),
		registerStayAliveManagerListeners(startCrowdee, stayAliveManager),
		registerIconListeners(startCrowdee, iconManager),
		registerPopupListeners(startCrowdee, buttonPopupManager),
		registerTabChangeListeners(startCrowdee, onTabRemovedListener, onTabUpdatedListener),
		registerProgressListeners(startCrowdee, progress),
		registerHistoryListeners(startCrowdee, historyManager, bullhorn),
	];

	const u = await Promise.all(t.flat());

	uninitializers.unshift(...u.flat());
};

export default setupBroadcasterListeners;
