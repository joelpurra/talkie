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
	bespeak,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import type StorageManager from "@talkie/shared-application/storage-manager.mjs";
import {
	getMappedVoice,
} from "@talkie/shared-application-helpers/voices.mjs";
import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";
import type {
	IVoiceNameAndLanguage,
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

export type LanguageVoiceOverride = Record<string, string>;

export default class VoiceLanguageManager {
	constructor(
		private readonly messageBusProviderGetter: IMessageBusProviderGetter,
		private readonly storageManager: StorageManager,
		private readonly premiumManager: IPremiumManager) {}

	private get languageVoiceOverrideNamesStorageKey() {
		return "language-voice-overrides";
	}

	async getLanguageVoiceDefault(languageCode: string): Promise<IVoiceNameAndLanguage | null> {
		const resolvedVoice = await bespeak(this.messageBusProviderGetter, "offscreen:synthesizer:resolveDefaultSafeVoiceObjectForLanguage", languageCode) as SafeVoiceObject | null;

		if (!resolvedVoice) {
			return null;
		}

		const resolvedVoiceAsMappedVoice = getMappedVoice(resolvedVoice);

		return resolvedVoiceAsMappedVoice;
	}

	async hasLanguageVoiceDefault(languageCode: string): Promise<boolean> {
		const languageVoiceDefault = await this.getLanguageVoiceDefault(languageCode);

		if (languageVoiceDefault) {
			return true;
		}

		return false;
	}

	async _getLanguageVoiceOverrideNames(): Promise<LanguageVoiceOverride> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			const languageVoiceOverrideNames = await this.storageManager.getStoredValue<LanguageVoiceOverride>(this.languageVoiceOverrideNamesStorageKey);

			if (typeof languageVoiceOverrideNames === "object" && languageVoiceOverrideNames !== null) {
				return languageVoiceOverrideNames;
			}

			return {};
		}

		return {};
	}

	async _setLanguageVoiceOverrideNames(languageVoiceOverrideNames: ReadonlyDeep<LanguageVoiceOverride>): Promise<void> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		if (isPremiumEdition) {
			await this.storageManager.setStoredValue<LanguageVoiceOverride>(this.languageVoiceOverrideNamesStorageKey, languageVoiceOverrideNames);

			return;
		}

		return undefined;
	}

	async getLanguageVoiceOverrideName(languageCode: string): Promise<string | null> {
		const languageVoiceOverrideNames = await this._getLanguageVoiceOverrideNames();

		return languageVoiceOverrideNames[languageCode] ?? null;
	}

	async setLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<void> {
		const languageVoiceOverrideNames = await this._getLanguageVoiceOverrideNames();

		languageVoiceOverrideNames[languageCode] = voiceName;

		await this._setLanguageVoiceOverrideNames(languageVoiceOverrideNames);
	}

	async removeLanguageVoiceOverrideName(languageCode: string): Promise<void> {
		const languageVoiceOverrideNames = await this._getLanguageVoiceOverrideNames();

		// TODO: use something like omit(obj, prop)?
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete languageVoiceOverrideNames[languageCode];

		await this._setLanguageVoiceOverrideNames(languageVoiceOverrideNames);
	}

	async hasLanguageVoiceOverrideName(languageCode: string): Promise<boolean> {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageCode);

		if (languageVoiceOverride) {
			return true;
		}

		return false;
	}

	async isLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		const languageVoiceOverride = await this.getLanguageVoiceOverrideName(languageCode);

		if (languageVoiceOverride) {
			return languageVoiceOverride === voiceName;
		}

		return false;
	}

	async toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		const isLanguageVoiceOverrideName = await this.isLanguageVoiceOverrideName(languageCode, voiceName);

		if (isLanguageVoiceOverrideName) {
			await this.removeLanguageVoiceOverrideName(languageCode);

			return false;
		}

		await this.setLanguageVoiceOverrideName(languageCode, voiceName);

		return true;
	}

	async getEffectiveVoiceForLanguage(languageCode: string): Promise<IVoiceNameAndLanguage | null> {
		const languageOverrideName = await this.getLanguageVoiceOverrideName(languageCode);

		if (languageOverrideName) {
			const voice = {
				lang: languageCode,
				name: languageOverrideName,
			};

			return voice;
		}

		return this.getLanguageVoiceDefault(languageCode);
	}
}
