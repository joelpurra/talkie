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

import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import {
	knownEvents,
} from "@talkie/split-environment-interfaces/moved-here/known-events.mjs";
import {
	JsonValue,
	ValueOf,
} from "type-fest";

import StorageManager from "./storage-manager.mjs";

export enum KnownSettings {
	IsPremiumEdition = "is-premium-edition",
	SpeakLongTexts = "speak-long-texts",
}
export type KnownSettingNames = keyof typeof KnownSettings;
export type KnownSettingValues = ValueOf<KnownSettings>;

// TODO: use T extends JsonValue when it does not trigger error TS2589: Type instantiation is excessively deep and possibly infinite.
export interface SettingChangedEventData<T extends JsonValue> {
	key: KnownSettingValues;
	previousValue: T | null;
	value: T;
}

export default class SettingsManager {
	private get _isPremiumEditionStorageKey() {
		return KnownSettings.IsPremiumEdition;
	}

	private get _speakLongTextsStorageKey() {
		return KnownSettings.SpeakLongTexts;
	}

	private get _isPremiumEditionDefaultValue() {
		return false;
	}

	private get _speakLongTextsStorageKeyDefaultValue() {
		return false;
	}

	constructor(private readonly storageManager: StorageManager, private readonly broadcaster: IBroadcasterProvider) {
		// TODO: shared place for default/fallback values for booleans etcetera.
	}

	async setIsPremiumEdition(isPremiumEdition: boolean): Promise<void> {
		return this._setStoredValue(this._isPremiumEditionStorageKey, isPremiumEdition);
	}

	async getIsPremiumEdition(): Promise<boolean> {
		const isPremiumEdition = await this._getStoredValue<boolean>(this._isPremiumEditionStorageKey);

		return isPremiumEdition ?? this._isPremiumEditionDefaultValue;
	}

	async setSpeakLongTexts(speakLongTexts: boolean): Promise<void> {
		return this._setStoredValue(this._speakLongTextsStorageKey, speakLongTexts);
	}

	async getSpeakLongTexts(): Promise<boolean> {
		const speakLongTexts = await this.storageManager.getStoredValue<boolean>(this._speakLongTextsStorageKey);

		return speakLongTexts ?? this._speakLongTextsStorageKeyDefaultValue;
	}

	private async _getStoredValue<T>(key: string): Promise<T | null> {
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
