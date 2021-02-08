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
	resolveVoiceAsMappedVoice,
} from "../shared/voices";

export default class VoiceLanguageManager {
	constructor(storageManager, metadataManager) {
		this.storageManager = storageManager;
		this.metadataManager = metadataManager;

		this.languageLanguageVoiceOverrideNamesStorageKey = "language-voice-overrides";
	}

	async getLanguageVoiceDefault(languageName) {
		const mappedVoice = {
			lang: languageName,
			name: null,
		};

		return resolveVoiceAsMappedVoice(mappedVoice);
	}

	async hasLanguageVoiceDefault(languageName) {
		const languageVoiceDefault = await this.getLanguageVoiceDefault(languageName);

		if (languageVoiceDefault) {
			return true;
		}

		return false;
	}

	async _getLanguageLanguageVoiceOverrideNames() {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const languageLanguageVoiceOverrideNames = await this.storageManager.getStoredValue(this.languageLanguageVoiceOverrideNamesStorageKey);

			if (languageLanguageVoiceOverrideNames !== null && typeof languageLanguageVoiceOverrideNames === "object") {
				return languageLanguageVoiceOverrideNames;
			}

			return {};
		}

		return {};
	}

	async _setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames) {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			return this.storageManager.setStoredValue(this.languageLanguageVoiceOverrideNamesStorageKey, languageLanguageVoiceOverrideNames);
		}

		return undefined;
	}

	async getLanguageVoiceOverrideName(languageName) {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		return languageLanguageVoiceOverrideNames[languageName] || null;
	}

	async setLanguageVoiceOverrideName(languageName, voiceName) {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		languageLanguageVoiceOverrideNames[languageName] = voiceName;

		return this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
	}

	async removeLanguageVoiceOverrideName(languageName) {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		delete languageLanguageVoiceOverrideNames[languageName];

		return this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
	}

	async hasLanguageVoiceOverrideName(languageName) {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageName);

		if (languageVoiceOverride) {
			return true;
		}

		return false;
	}

	async isLanguageVoiceOverrideName(languageName, voiceName) {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageName);

		if (languageVoiceOverride) {
			return languageVoiceOverride === voiceName;
		}

		return false;
	}

	async toggleLanguageVoiceOverrideName(languageName, voiceName) {
		const isLanguageVoiceOverrideName = await this.isLanguageVoiceOverrideName(languageName, voiceName);

		if (isLanguageVoiceOverrideName) {
			return this.removeLanguageVoiceOverrideName(languageName);
		}

		return this.setLanguageVoiceOverrideName(languageName, voiceName);
	}

	async getEffectiveVoiceForLanguage(languageName) {
		const hasLanguageVoiceOverrideName = await this.hasLanguageVoiceOverrideName(languageName);

		if (hasLanguageVoiceOverrideName) {
			const languageOverrideName = await this.getLanguageVoiceOverrideName(languageName);

			const voice = {
				lang: null,
				name: languageOverrideName,
			};

			return voice;
		}

		return this.getLanguageVoiceDefault(languageName);
	}
}
