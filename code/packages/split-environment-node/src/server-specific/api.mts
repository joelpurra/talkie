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

// TODO: implement or remove placeholder file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
	type EditionType,
	type IMetadataManager,
	type OsType,
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type LanguageTextDirection,
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import type ITalkieLocaleHelper from "@talkie/shared-interfaces/italkie-locale-helper.mjs";
import {
	type IVoiceNameAndRateAndPitch,
	type SafeVoiceObjects,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	type KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	type knownEventNames,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	type ListeningActionHandler,
} from "@talkie/shared-interfaces/listening-action-handler.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import type IApi from "@talkie/split-environment-interfaces/iapi.mjs";
import type ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

export default class Api implements IApi {
	constructor(private readonly metadataManager: IMetadataManager, private readonly talkieLocaleHelper: ITalkieLocaleHelper, private readonly localeProvider: ILocaleProvider) {}

	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getConfigurationValue<T extends JsonValue>(configurationPath: string): Promise<T> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async iconClick(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async stopSpeaking(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async speakInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async speakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async speakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getVoices(): Promise<SafeVoiceObjects> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getIsPremiumEdition(): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setIsPremiumEdition(isPremiumEdition: boolean): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSpeakLongTexts(): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setSpeakLongTexts(speakLongTexts: boolean): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getShowAdditionalDetails(): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setShowAdditionalDetails(showAdditionalDetails: boolean): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSpeakingHistoryLimit(): Promise<number> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getMostRecentSpeakingEntry(): Promise<SpeakingHistoryEntry | null> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSpeakingHistory(): Promise<SpeakingHistoryEntry[]> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async clearSpeakingHistory(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async pruneSpeakingHistory(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async removeSpeakingHistoryEntry(hash: number): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async storeMostRecentSpeakingEntry(speakingHistoryEntry: ReadonlyDeep<SpeakingHistoryEntry>): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getEffectiveVoiceForLanguage(languageCode: string): Promise<string | null> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getEffectiveRateForVoice(voiceName: string): Promise<number> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getEffectivePitchForVoice(voiceName: string): Promise<number> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getTranslatedLanguages(): Promise<TalkieLocale[]> {
		// TODO: separate "background API" from other functionality.
		return this.talkieLocaleHelper.getTranslatedLanguages();
	}

	async isPremiumEdition(): Promise<boolean> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.isPremiumEdition();
	}

	async getVersionName(): Promise<string | null> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getVersionName();
	}

	async getVersionNumber(): Promise<string | null> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getVersionNumber();
	}

	async getEditionType(): Promise<EditionType> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSystemType(): Promise<SystemType> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getSystemType();
	}

	async getOperatingSystemType(): Promise<OsType> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openExternalUrlInNewTab(url: ReadonlyDeep<URL>): Promise<Tabs.Tab> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openShortKeysConfiguration(): Promise<Tabs.Tab> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openOptionsPage(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async registerListeningAction<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getLocationHash(): Promise<string | null> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setLocationHash(locationHash: string): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSampleText(talkieLocale: TalkieLocale): Promise<string> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async isTalkieLocale(languageGroup: string): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getTranslationLocale(): Promise<TalkieLocale> {
		// TODO: separate "background API" from other functionality.
		return this.localeProvider.getTranslationLocale();
	}

	async getNavigatorLanguage(): Promise<Readonly<string | null>> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getNavigatorLanguages(): Promise<Readonly<string[]>> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}
}
