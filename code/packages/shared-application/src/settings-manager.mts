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
	knownEvents,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import type {
	JsonArray,
	JsonObject,
	JsonValue,
	ReadonlyDeep,
	ValueOf,
} from "type-fest";

import type StorageManager from "./storage-manager.mjs";

// TODO: merge parallel objects.
export enum KnownSettingStorageKeys {
	IsPremiumEdition = "is-premium-edition",
	ShowAdditionalDetails = "show-additional-details",
	SpeakingHistory = "speaking-history",
	SpeakingHistoryLimit = "speaking-history-limit",
	SpeakLongTexts = "speak-long-texts",
}
export type KnownSettingNames = keyof typeof KnownSettingStorageKeys;
export type KnownSettingValues = ValueOf<KnownSettingStorageKeys>;

export const KnownSettingDefaults = {
	IsPremiumEdition: false,
	ShowAdditionalDetails: false,
	SpeakLongTexts: false,
	SpeakingHistory: [],
	SpeakingHistoryLimit: 10,
};
export type KnownSettingDefaultNames = keyof typeof KnownSettingDefaults;
export type KnownSettingDefaultValues = ValueOf<typeof KnownSettingDefaults>;

export interface SettingRange {
	max: number;
	min: number;
}
export const KnownSettingRanges = {
	SpeakingHistoryLimit: {
		max: 100,
		min: 0,
	},
};
export type KnownSettingRangeNames = keyof typeof KnownSettingRanges;
export type KnownSettingRangeValues = ValueOf<typeof KnownSettingRanges>;

export type SettingChangedEventData<T extends JsonValue> = {
	key: KnownSettingValues;
	previousValue: T | null;
	value: T;
} & JsonObject;

export default class SettingsManager {
	constructor(private readonly storageManager: StorageManager, private readonly broadcaster: IBroadcasterProvider) {
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

	async setSpeakingHistory(speakingHistory: ReadonlyDeep<SpeakingHistoryEntry[]>): Promise<void> {
		// NOTE: extraenous validation, should already be taken care of.
		if (speakingHistory.length > KnownSettingRanges.SpeakingHistoryLimit.max) {
			throw new RangeError(`Cannot set a speaking history with length greater than ${KnownSettingRanges.SpeakingHistoryLimit.max}: ${JSON.stringify(speakingHistory)}`);
		}

		// TODO: function/assert type cast.
		const speakingHistoryJson: JsonArray = speakingHistory as unknown as JsonArray;

		return this._setStoredValue(KnownSettingStorageKeys.SpeakingHistory, speakingHistoryJson);
	}

	async getSpeakingHistory(): Promise<SpeakingHistoryEntry[]> {
		const speakingHistoryJson = await this.storageManager.getStoredValue<JsonArray>(KnownSettingStorageKeys.SpeakingHistory);

		// TODO: assert function for SpeakingHistoryEntry[].
		const speakingHistoryOrDefault: SpeakingHistoryEntry[] = (speakingHistoryJson as unknown as SpeakingHistoryEntry[]) ?? KnownSettingDefaults.SpeakingHistory;

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

			await this.broadcaster.broadcastEvent(knownEvents.settingChanged, settingChangedEventData);
		}
	}
}
