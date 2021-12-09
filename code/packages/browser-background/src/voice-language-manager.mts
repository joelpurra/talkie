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
	getMappedVoice,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	IVoiceNameAndLanguage,
} from "@talkie/split-environment-interfaces/moved-here/ivoices.mjs";
import {
	ReadonlyDeep,
} from "type-fest";

import TalkieSpeaker from "./talkie-speaker.mjs";

export type LanguageVoiceOverride = Record<string, string>;

export default class VoiceLanguageManager {
	private get languageLanguageVoiceOverrideNamesStorageKey() {
		return "language-voice-overrides";
	}

	constructor(private readonly storageManager: StorageManager, private readonly metadataManager: MetadataManager, private readonly talkieSpeaker: TalkieSpeaker) {}

	async getLanguageVoiceDefault(languageName: string): Promise<IVoiceNameAndLanguage | null> {
		const resolvedVoice = await this.talkieSpeaker.resolveDefaultVoiceSafeObjectForLanguage(languageName);

		if (!resolvedVoice) {
			return null;
		}

		const resolvedVoiceAsMappedVoice = getMappedVoice(resolvedVoice);

		return resolvedVoiceAsMappedVoice;
	}

	async hasLanguageVoiceDefault(languageName: string): Promise<boolean> {
		const languageVoiceDefault = await this.getLanguageVoiceDefault(languageName);

		if (languageVoiceDefault) {
			return true;
		}

		return false;
	}

	async _getLanguageLanguageVoiceOverrideNames(): Promise<LanguageVoiceOverride> {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			const languageLanguageVoiceOverrideNames = await this.storageManager.getStoredValue<LanguageVoiceOverride>(this.languageLanguageVoiceOverrideNamesStorageKey);

			if (languageLanguageVoiceOverrideNames !== null && typeof languageLanguageVoiceOverrideNames === "object") {
				return languageLanguageVoiceOverrideNames;
			}

			return {};
		}

		return {};
	}

	async _setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames: ReadonlyDeep<LanguageVoiceOverride>): Promise<void> {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue<LanguageVoiceOverride>(this.languageLanguageVoiceOverrideNamesStorageKey, languageLanguageVoiceOverrideNames);

			return;
		}

		return undefined;
	}

	async getLanguageVoiceOverrideName(languageName: string): Promise<string | null> {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		return languageLanguageVoiceOverrideNames[languageName] ?? null;
	}

	async setLanguageVoiceOverrideName(languageName: string, voiceName: string): Promise<void> {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		languageLanguageVoiceOverrideNames[languageName] = voiceName;

		await this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
	}

	async removeLanguageVoiceOverrideName(languageName: string): Promise<void> {
		const languageLanguageVoiceOverrideNames = await this._getLanguageLanguageVoiceOverrideNames();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete languageLanguageVoiceOverrideNames[languageName];

		await this._setLanguageLanguageVoiceOverrideNames(languageLanguageVoiceOverrideNames);
	}

	async hasLanguageVoiceOverrideName(languageName: string): Promise<boolean> {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageName);

		if (languageVoiceOverride) {
			return true;
		}

		return false;
	}

	async isLanguageVoiceOverrideName(languageName: string, voiceName: string): Promise<boolean> {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageName);

		if (languageVoiceOverride) {
			return languageVoiceOverride === voiceName;
		}

		return false;
	}

	async toggleLanguageVoiceOverrideName(languageName: string, voiceName: string): Promise<boolean> {
		const isLanguageVoiceOverrideName = await this.isLanguageVoiceOverrideName(languageName, voiceName);

		if (isLanguageVoiceOverrideName) {
			await this.removeLanguageVoiceOverrideName(languageName);

			return false;
		}

		await this.setLanguageVoiceOverrideName(languageName, voiceName);

		return true;
	}

	async getEffectiveVoiceForLanguage(languageName: string): Promise<IVoiceNameAndLanguage | null> {
		const languageOverrideName = await this.getLanguageVoiceOverrideName(languageName);

		if (languageOverrideName) {
			const voice = {
				lang: languageName,
				name: languageOverrideName,
			};

			return voice;
		}

		return this.getLanguageVoiceDefault(languageName);
	}
}
