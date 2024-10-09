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

import type StorageManager from "@talkie/shared-application/storage-manager.mjs";
import {
	pitchRange,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

export type VoicePitchOverrides = Record<string, number>;

export default class VoicePitchManager {
	constructor(private readonly storageManager: StorageManager, private readonly premiumManager: IPremiumManager) {}

	private get voicePitchOverridesStorageKey() {
		return "voice-pitch-overrides";
	}

	async getVoicePitchDefault(
		_voiceName: string,
	): Promise<number> {
		// TODO: initialize a "real" synthesizer voice, then read out the pitch value.
		return pitchRange.default;
	}

	async hasVoicePitchDefault(voiceName: string): Promise<boolean> {
		const voicePitchDefault = await this.getVoicePitchDefault(voiceName);

		if (voicePitchDefault) {
			return true;
		}

		return false;
	}

	async _getVoicePitchOverrides(): Promise<VoicePitchOverrides> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voicePitchOverrides = await this.storageManager.getStoredValue<VoicePitchOverrides>(this.voicePitchOverridesStorageKey);

			if (typeof voicePitchOverrides === "object" && voicePitchOverrides !== null) {
				return voicePitchOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoicePitchOverrides(voicePitchOverrides: ReadonlyDeep<VoicePitchOverrides>): Promise<void> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue(this.voicePitchOverridesStorageKey, voicePitchOverrides);
		}
	}

	async getVoicePitchOverride(voiceName: string): Promise<number | null> {
		const voicePitchOverrides = await this._getVoicePitchOverrides();

		return voicePitchOverrides[voiceName] ?? null;
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		const voicePitchOverrides = await this._getVoicePitchOverrides();

		voicePitchOverrides[voiceName] = pitch;

		await this._setVoicePitchOverrides(voicePitchOverrides);
	}

	async removeVoicePitchOverride(voiceName: string): Promise<void> {
		const voicePitchOverrides = await this._getVoicePitchOverrides();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete voicePitchOverrides[voiceName];

		await this._setVoicePitchOverrides(voicePitchOverrides);
	}

	async isVoicePitchOverride(voiceName: string, pitch: number): Promise<boolean> {
		const voicePitchOverride = await this.getVoicePitchOverride(voiceName);

		if (voicePitchOverride) {
			return voicePitchOverride === pitch;
		}

		return false;
	}

	async getEffectivePitchForVoice(voiceName: string): Promise<number> {
		const effective = await this.getVoicePitchOverride(voiceName) ?? await this.getVoicePitchDefault(voiceName);

		return effective;
	}
}
