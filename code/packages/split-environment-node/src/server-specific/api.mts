
// TODO: implement or remove placeholder file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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

import IApi from "@talkie/split-environment-interfaces/iapi.mjs";
import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import IConfiguration from "@talkie/split-environment-interfaces/moved-here/iconfiguration.mjs";
import {
	EditionType,
	IMetadataManager,
	OsType,
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager.mjs";
import ITalkieLocaleHelper from "@talkie/split-environment-interfaces/moved-here/italkie-locale-helper.mjs";
import {
	IVoiceNameAndLanguage,
	IVoiceNameAndRateAndPitch,
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices.mjs";
import {
	KillSwitch,
} from "@talkie/split-environment-interfaces/moved-here/killswitch.mjs";
import {
	knownEventNames,
} from "@talkie/split-environment-interfaces/moved-here/known-events.mjs";
import {
	ListeningActionHandler,
} from "@talkie/split-environment-interfaces/moved-here/listening-action-handler.mjs";
import {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

export default class Api implements IApi {
	// eslint-disable-next-line max-params
	constructor(private readonly metadataManager: IMetadataManager, private readonly configuration: IConfiguration, private readonly translator: ITranslatorProvider, private readonly broadcastProvider: IBroadcasterProvider, private readonly talkieLocaleHelper: ITalkieLocaleHelper) {}

	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getConfigurationValue<T>(configurationPath: string): Promise<T> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async iconClick(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): void {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInVoiceWithOverrides(text: string, voiceName: string): void {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async debouncedSpeakTextInLanguageWithOverrides(text: string, languageCode: string): void {
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

	async getVoices(): Promise<SafeVoiceObject[]> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getIsPremiumEditionOption(): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setIsPremiumEditionOption(isPremiumEdition: boolean): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSpeakLongTextsOption(): Promise<boolean> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async setSpeakLongTextsOption(speakLongTexts: boolean): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSampleText(): Promise<string> {
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
		return this.talkieLocaleHelper.getTranslatedLanguages();
	}

	async isPremiumEdition(): Promise<boolean> {
		return this.metadataManager.isPremiumEdition();
	}

	async getVersionName(): Promise<string | null> {
		return this.metadataManager.getVersionName();
	}

	async getVersionNumber(): Promise<string | null> {
		return this.metadataManager.getVersionNumber();
	}

	async getEditionType(): Promise<EditionType> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async getSystemType(): Promise<SystemType> {
		return this.metadataManager.getSystemType();
	}

	async getOperatingSystemType(): Promise<OsType> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openUrlInNewTab(url: string): Promise<Tabs.Tab> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openShortKeysConfiguration(): Promise<Tabs.Tab> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async openOptionsPage(): Promise<void> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}

	async registerListeningAction<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		throw new Error(`Not implemented. ${JSON.stringify(arguments)}`);
	}
}
