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

import MetadataManager from "@talkie/shared-application/metadata-manager.mjs";
import StorageManager from "@talkie/shared-application/storage-manager.mjs";
import {
	pitchRange,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	ReadonlyDeep,
} from "type-fest";

export type VoicePitchOverrides = Record<string, number>;

export default class VoicePitchManager {
	private get voicePitchPitchOverridesStorageKey() {
		return "voice-pitch-overrides";
	}

	constructor(private readonly storageManager: StorageManager, private readonly metadataManager: MetadataManager) {}

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
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voicePitchPitchOverrides = await this.storageManager.getStoredValue<VoicePitchOverrides>(this.voicePitchPitchOverridesStorageKey);

			if (voicePitchPitchOverrides !== null && typeof voicePitchPitchOverrides === "object") {
				return voicePitchPitchOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoicePitchOverrides(voicePitchPitchOverrides: ReadonlyDeep<VoicePitchOverrides>): Promise<void> {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue(this.voicePitchPitchOverridesStorageKey, voicePitchPitchOverrides);
		}
	}

	async getVoicePitchOverride(voiceName: string): Promise<number | null> {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		return voicePitchPitchOverrides[voiceName] ?? null;
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		voicePitchPitchOverrides[voiceName] = pitch;

		await this._setVoicePitchOverrides(voicePitchPitchOverrides);
	}

	async removeVoicePitchOverride(voiceName: string): Promise<void> {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete voicePitchPitchOverrides[voiceName];

		await this._setVoicePitchOverrides(voicePitchPitchOverrides);
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
