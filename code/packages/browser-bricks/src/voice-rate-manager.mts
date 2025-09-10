/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type StorageManager from "@talkie/shared-application/storage/storage-manager.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	rateRange,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";

export type VoiceRateOverrides = Record<string, number>;

export default class VoiceRateManager {
	constructor(private readonly storageManager: StorageManager, private readonly premiumManager: IPremiumManager) {}

	private get voiceRateOverridesStorageKey() {
		return "voice-rate-overrides";
	}

	async getVoiceRateDefault(
		_voiceName: string,
	): Promise<number> {
		// TODO: initialize a "real" synthesizer voice, then read out the rate value.
		return rateRange.default;
	}

	async hasVoiceRateDefault(voiceName: string): Promise<boolean> {
		const voiceRateDefault = await this.getVoiceRateDefault(voiceName);

		if (voiceRateDefault) {
			return true;
		}

		return false;
	}

	async _getVoiceRateOverrides(): Promise<VoiceRateOverrides> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voiceRateOverrides = await this.storageManager.getStoredValue<VoiceRateOverrides>(this.voiceRateOverridesStorageKey);

			if (typeof voiceRateOverrides === "object" && voiceRateOverrides !== null) {
				return voiceRateOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoiceRateOverrides(voiceRateOverrides: ReadonlyDeep<VoiceRateOverrides>): Promise<void> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue<VoiceRateOverrides>(this.voiceRateOverridesStorageKey, voiceRateOverrides);
		}
	}

	async getVoiceRateOverride(voiceName: string): Promise<number | null> {
		const voiceRateOverrides = await this._getVoiceRateOverrides();

		return voiceRateOverrides[voiceName] ?? null;
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		const voiceRateOverrides = await this._getVoiceRateOverrides();

		voiceRateOverrides[voiceName] = rate;

		await this._setVoiceRateOverrides(voiceRateOverrides);
	}

	async removeVoiceRateOverride(voiceName: string): Promise<void> {
		const voiceRateOverrides = await this._getVoiceRateOverrides();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete voiceRateOverrides[voiceName];

		await this._setVoiceRateOverrides(voiceRateOverrides);
	}

	async isVoiceRateOverride(voiceName: string, rate: number): Promise<boolean> {
		const voiceRateOverride = await this.getVoiceRateOverride(voiceName);

		if (voiceRateOverride) {
			return voiceRateOverride === rate;
		}

		return false;
	}

	async getEffectiveRateForVoice(voiceName: string): Promise<number> {
		const effective = await this.getVoiceRateOverride(voiceName) ?? await this.getVoiceRateDefault(voiceName);

		return effective;
	}
}
