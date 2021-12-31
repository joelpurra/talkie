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

import StorageManager from "@talkie/shared-application/storage-manager.mjs";
import {
	rateRange,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	IMetadataManager,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

export type VoiceRateOverrides = Record<string, number>;

export default class VoiceRateManager {
	constructor(private readonly storageManager: StorageManager, private readonly metadataManager: IMetadataManager) {}

	private get voiceRateRateOverridesStorageKey() {
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
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voiceRateRateOverrides = await this.storageManager.getStoredValue<VoiceRateOverrides>(this.voiceRateRateOverridesStorageKey);

			if (voiceRateRateOverrides !== null && typeof voiceRateRateOverrides === "object") {
				return voiceRateRateOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoiceRateOverrides(voiceRateRateOverrides: ReadonlyDeep<VoiceRateOverrides>): Promise<void> {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue<VoiceRateOverrides>(this.voiceRateRateOverridesStorageKey, voiceRateRateOverrides);
		}
	}

	async getVoiceRateOverride(voiceName: string): Promise<number | null> {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		return voiceRateRateOverrides[voiceName] ?? null;
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		voiceRateRateOverrides[voiceName] = rate;

		await this._setVoiceRateOverrides(voiceRateRateOverrides);
	}

	async removeVoiceRateOverride(voiceName: string): Promise<void> {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete voiceRateRateOverrides[voiceName];

		await this._setVoiceRateOverrides(voiceRateRateOverrides);
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
