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
	rateRange,
} from "../shared/voices";

export default class VoiceRateManager {
	constructor(storageManager, metadataManager) {
		this.storageManager = storageManager;
		this.metadataManager = metadataManager;

		this.voiceRateRateOverridesStorageKey = "voice-rate-overrides";
	}

	async getVoiceRateDefault(/* eslint-disable no-unused-vars */voiceName/* eslint-enable no-unused-vars */) {
		// TODO: initialize a "real" synthesizer voice, then read out the rate value.
		return rateRange.default;
	}

	async hasVoiceRateDefault(voiceName) {
		const voiceRateDefault = await this.getVoiceRateDefault(voiceName);

		if (voiceRateDefault) {
			return true;
		}

		return false;
	}

	async _getVoiceRateOverrides() {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const voiceRateRateOverrides = await this.storageManager.getStoredValue(this.voiceRateRateOverridesStorageKey);

			if (voiceRateRateOverrides !== null && typeof voiceRateRateOverrides === "object") {
				return voiceRateRateOverrides;
			}

			return {};
		}

		return {};
	}

	async _setVoiceRateOverrides(voiceRateRateOverrides) {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue(this.voiceRateRateOverridesStorageKey, voiceRateRateOverrides);
		}
	}

	async getVoiceRateOverride(voiceName) {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		return voiceRateRateOverrides[voiceName] || null;
	}

	async setVoiceRateOverride(voiceName, rate) {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		voiceRateRateOverrides[voiceName] = rate;

		return this._setVoiceRateOverrides(voiceRateRateOverrides);
	}

	async removeVoiceRateOverride(voiceName) {
		const voiceRateRateOverrides = await this._getVoiceRateOverrides();

		delete voiceRateRateOverrides[voiceName];

		return this._setVoiceRateOverrides(voiceRateRateOverrides);
	}

	async hasVoiceRateOverride(voiceName) {
		const voiceRateOverride = await this.getVoiceRateOverride(voiceName);

		if (voiceRateOverride) {
			return true;
		}

		return false;
	}

	async isVoiceRateOverride(voiceName, rate) {
		const voiceRateOverride = await this.getVoiceRateOverride(voiceName);

		if (voiceRateOverride) {
			return voiceRateOverride === rate;
		}

		return false;
	}

	async getEffectiveRateForVoice(voiceName) {
		const hasVoiceRateOverride = await this.hasVoiceRateOverride(voiceName);

		if (hasVoiceRateOverride) {
			return this.getVoiceRateOverride(voiceName);
		}

		return this.getVoiceRateDefault(voiceName);
	}
}
