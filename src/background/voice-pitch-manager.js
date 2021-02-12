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
	pitchRange,
} from "../shared/voices";

export default class VoicePitchManager {
	constructor(storageManager, metadataManager) {
		this.storageManager = storageManager;
		this.metadataManager = metadataManager;

		this.voicePitchPitchOverridesStorageKey = "voice-pitch-overrides";
	}

	async getVoicePitchDefault(
		// eslint-disable-next-line no-unused-vars
		voiceName,
	) {
		// TODO: initialize a "real" synthesizer voice, then read out the pitch value.
		return pitchRange.default;
	}

	async hasVoicePitchDefault(voiceName) {
		const voicePitchDefault = await this.getVoicePitchDefault(voiceName);

		if (voicePitchDefault) {
			return true;
		}

		return false;
	}

	async _getVoicePitchOverrides() {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voicePitchPitchOverrides = await this.storageManager.getStoredValue(this.voicePitchPitchOverridesStorageKey);

			if (voicePitchPitchOverrides !== null && typeof voicePitchPitchOverrides === "object") {
				return voicePitchPitchOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoicePitchOverrides(voicePitchPitchOverrides) {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue(this.voicePitchPitchOverridesStorageKey, voicePitchPitchOverrides);
		}
	}

	async getVoicePitchOverride(voiceName) {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		return voicePitchPitchOverrides[voiceName] || null;
	}

	async setVoicePitchOverride(voiceName, pitch) {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		voicePitchPitchOverrides[voiceName] = pitch;

		return this._setVoicePitchOverrides(voicePitchPitchOverrides);
	}

	async removeVoicePitchOverride(voiceName) {
		const voicePitchPitchOverrides = await this._getVoicePitchOverrides();

		delete voicePitchPitchOverrides[voiceName];

		return this._setVoicePitchOverrides(voicePitchPitchOverrides);
	}

	async hasVoicePitchOverride(voiceName) {
		const voicePitchOverride = await this.getVoicePitchOverride(voiceName);

		if (voicePitchOverride) {
			return true;
		}

		return false;
	}

	async isVoicePitchOverride(voiceName, pitch) {
		const voicePitchOverride = await this.getVoicePitchOverride(voiceName);

		if (voicePitchOverride) {
			return voicePitchOverride === pitch;
		}

		return false;
	}

	async getEffectivePitchForVoice(voiceName) {
		const hasVoicePitchOverride = await this.hasVoicePitchOverride(voiceName);

		if (hasVoicePitchOverride) {
			return this.getVoicePitchOverride(voiceName);
		}

		return this.getVoicePitchDefault(voiceName);
	}
}
