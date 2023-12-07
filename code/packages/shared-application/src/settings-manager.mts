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

import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	JsonArray,
	JsonObject,
	JsonValue,
} from "type-fest";

import {
	bullhorn,
} from "./message-bus/message-bus-listener-helpers.mjs";
import {
	KnownSettingDefaults,
	KnownSettingRanges,
	KnownSettingStorageKeys,
	type KnownSettingValues,
} from "./settings.mjs";
import type StorageManager from "./storage-manager.mjs";

export type SettingChangedEventData<T extends JsonValue> = {
	key: KnownSettingValues;
	previousValue: T | null;
	value: T;
} & JsonObject;

export default class SettingsManager {
	constructor(private readonly storageManager: StorageManager, private readonly messageBusProviderGetter: IMessageBusProviderGetter) {
		// TODO: shared place for default/fallback values for booleans etcetera.
	}

	async setIsPremiumEdition(isPremiumEdition: boolean): Promise<void> {
		return this._setStoredValue(KnownSettingStorageKeys.IsPremiumEdition, isPremiumEdition);
	}

	async getIsPremiumEdition(): Promise<boolean> {
		const isPremiumEdition = await this._getStoredValue<boolean>(KnownSettingStorageKeys.IsPremiumEdition);

		return isPremiumEdition ?? KnownSettingDefaults.IsPremiumEdition;
	}

	async setSpeakLongTexts(speakLongTexts: boolean): Promise<void> {
		return this._setStoredValue(KnownSettingStorageKeys.SpeakLongTexts, speakLongTexts);
	}

	async getSpeakLongTexts(): Promise<boolean> {
		const speakLongTexts = await this.storageManager.getStoredValue<boolean>(KnownSettingStorageKeys.SpeakLongTexts);

		return speakLongTexts ?? KnownSettingDefaults.SpeakLongTexts;
	}

	async setShowAdditionalDetails(showAdditionalDetails: boolean): Promise<void> {
		return this._setStoredValue(KnownSettingStorageKeys.ShowAdditionalDetails, showAdditionalDetails);
	}

	async getShowAdditionalDetails(): Promise<boolean> {
		const showAdditionalDetails = await this.storageManager.getStoredValue<boolean>(KnownSettingStorageKeys.ShowAdditionalDetails);

		return showAdditionalDetails ?? KnownSettingDefaults.ShowAdditionalDetails;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async setSpeakingHistory(speakingHistory: Readonly<SpeakingHistoryEntry[]>): Promise<void> {
		// NOTE: extraenous validation, should already be taken care of.
		if (speakingHistory.length > KnownSettingRanges.SpeakingHistoryLimit.max) {
			throw new RangeError(`Cannot set a speaking history with length greater than ${KnownSettingRanges.SpeakingHistoryLimit.max}: ${JSON.stringify(speakingHistory)}`);
		}

		return this._setStoredValue(KnownSettingStorageKeys.SpeakingHistory, speakingHistory);
	}

	async getSpeakingHistory(): Promise<Readonly<SpeakingHistoryEntry[]>> {
		const speakingHistory = await this.storageManager.getStoredValue<JsonArray>(KnownSettingStorageKeys.SpeakingHistory);

		// TODO: assert function for Readonly<SpeakingHistoryEntry[]>.
		const speakingHistoryOrDefault: Readonly<SpeakingHistoryEntry[]> = (speakingHistory as Readonly<SpeakingHistoryEntry[]>) ?? KnownSettingDefaults.SpeakingHistory;

		const limitedSpeakingHistory = speakingHistoryOrDefault.slice(0, KnownSettingRanges.SpeakingHistoryLimit.max);

		return limitedSpeakingHistory;
	}

	async setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void> {
		// TODO: proper range validation instead of two separate validations.
		if (speakingHistoryLimit < KnownSettingRanges.SpeakingHistoryLimit.min) {
			throw new RangeError(`Cannot set a speaking history limit less than ${KnownSettingRanges.SpeakingHistoryLimit.min}: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		if (speakingHistoryLimit > KnownSettingRanges.SpeakingHistoryLimit.max) {
			throw new RangeError(`Cannot set a speaking history limit greater than ${KnownSettingRanges.SpeakingHistoryLimit.max}: ${JSON.stringify(speakingHistoryLimit)}`);
		}

		return this._setStoredValue(KnownSettingStorageKeys.SpeakingHistoryLimit, speakingHistoryLimit);
	}

	async getSpeakingHistoryLimit(): Promise<number> {
		const speakingHistoryLimit = await this.storageManager.getStoredValue<number>(KnownSettingStorageKeys.SpeakingHistoryLimit);

		return speakingHistoryLimit ?? KnownSettingDefaults.SpeakingHistoryLimit;
	}

	async setContinueOnTabRemoved(continueOnTabRemoved: boolean): Promise<void> {
		return this._setStoredValue(KnownSettingStorageKeys.ContinueOnTabRemoved, continueOnTabRemoved);
	}

	async getContinueOnTabRemoved(): Promise<boolean> {
		const continueOnTabRemoved = await this._getStoredValue<boolean>(KnownSettingStorageKeys.ContinueOnTabRemoved);

		return continueOnTabRemoved ?? KnownSettingDefaults.ContinueOnTabRemoved;
	}

	async setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl: boolean): Promise<void> {
		return this._setStoredValue(KnownSettingStorageKeys.ContinueOnTabUpdatedUrl, continueOnTabUpdatedUrl);
	}

	async getContinueOnTabUpdatedUrl(): Promise<boolean> {
		const continueOnTabUpdatedUrl = await this._getStoredValue<boolean>(KnownSettingStorageKeys.ContinueOnTabUpdatedUrl);

		return continueOnTabUpdatedUrl ?? KnownSettingDefaults.ContinueOnTabUpdatedUrl;
	}

	private async _getStoredValue<T extends JsonValue>(key: string): Promise<T | null> {
		return this.storageManager.getStoredValue<T>(key);
	}

	private async _setStoredValue<T extends JsonValue>(key: string, value: T): Promise<void> {
		// NOTE: is this change detection in the correct layer?
		const previousValue = await this._getStoredValue<T>(key);

		await this.storageManager.setStoredValue<T>(key, value);

		if (!Object.is(previousValue, value)) {
			const settingChangedEventData: SettingChangedEventData<T> = {
				key,
				previousValue,
				value,
			};

			await bullhorn(this.messageBusProviderGetter, "broadcaster:setting:changed", settingChangedEventData);
		}
	}
}
