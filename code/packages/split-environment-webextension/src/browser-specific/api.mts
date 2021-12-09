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
	debounce,
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
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

import {
	getTalkieServices,
} from "./tabs.mjs";
import {
	openOptionsPage as sharedOpenOptionsPage,
	openShortKeysConfiguration as sharedOpenShortKeysConfiguration,
	openUrlInNewTab as sharedOpenUrlInNewTab,
} from "./urls.mjs";

export default class Api implements IApi {
	debouncedSpeakTextInCustomVoice: (text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>) => void;
	debouncedSpeakTextInVoiceWithOverrides: (text: string, voiceName: string) => void;
	debouncedSpeakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;

	// eslint-disable-next-line max-params
	constructor(private readonly metadataManager: IMetadataManager, private readonly configuration: IConfiguration, private readonly translator: ITranslatorProvider, private readonly broadcastProvider: IBroadcasterProvider, private readonly talkieLocaleHelper: ITalkieLocaleHelper) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInCustomVoice = debounce(this.speakInCustomVoice.bind(this) as any, 200);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInVoiceWithOverrides = debounce(this.speakTextInVoiceWithOverrides.bind(this) as any, 200);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInLanguageWithOverrides = debounce(this.speakTextInLanguageWithOverrides.bind(this) as any, 200);
	}

	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T {
		// eslint-disable-next-line no-sync
		return this.configuration.getSync<T>(systemType, path);
	}

	async getConfigurationValue<T>(configurationPath: string): Promise<T> {
		return this.configuration.get<T>(configurationPath);
	}

	async iconClick(): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.iconClick();
	}

	async speakInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.stopSpeakFromFrontend();

		// NOTE: not sure if copying these variables have any effect, but hope it helps avoid some vague "TypeError: can't access dead object" in Firefox.
		const backgroundText = String(text);
		const backgroundVoice = jsonClone(voice);

		await talkieServices.startSpeakFromFrontend(backgroundText, backgroundVoice);
	}

	async speakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.stopSpeakFromFrontend();
		await talkieServices.startSpeakInVoiceWithOverridesFromFrontend(text, voiceName);
	}

	async speakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.stopSpeakFromFrontend();
		await talkieServices.startSpeakInLanguageWithOverridesFromFrontend(text, languageCode);
	}

	async getVoices(): Promise<SafeVoiceObject[]> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getAllVoicesSafeObjects();
	}

	async getIsPremiumEditionOption(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getIsPremiumEditionOption();
	}

	async setIsPremiumEditionOption(isPremiumEdition: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setIsPremiumEditionOption(isPremiumEdition);
	}

	async getSpeakLongTextsOption(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getSpeakLongTextsOption();
	}

	async setSpeakLongTextsOption(speakLongTexts: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setSpeakLongTextsOption(speakLongTexts);
	}

	async getSampleText(): Promise<string> {
		// eslint-disable-next-line no-sync
		return this.translator.translateSync("frontend_voicesSampleText");
	}

	async getEffectiveVoiceForLanguage(languageCode: string): Promise<string | null> {
		const talkieServices = await getTalkieServices();
		const effectiveVoiceForLanguage = await talkieServices.getEffectiveVoiceForLanguage(languageCode);

		return effectiveVoiceForLanguage?.name ?? null;
	}

	async getEffectiveRateForVoice(voiceName: string): Promise<number> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getEffectiveRateForVoice(voiceName);
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setVoiceRateOverride(voiceName, rate);
	}

	async getEffectivePitchForVoice(voiceName: string): Promise<number> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getEffectivePitchForVoice(voiceName);
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setVoicePitchOverride(voiceName, pitch);
	}

	async toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.toggleLanguageVoiceOverrideName(languageCode, voiceName);
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
		return this.metadataManager.getEditionType();
	}

	async getSystemType(): Promise<SystemType> {
		return this.metadataManager.getSystemType();
	}

	async getOperatingSystemType(): Promise<OsType> {
		return this.metadataManager.getOperatingSystemType();
	}

	async openUrlInNewTab(url: string): Promise<Tabs.Tab> {
		return sharedOpenUrlInNewTab(url);
	}

	async openShortKeysConfiguration(): Promise<Tabs.Tab> {
		return sharedOpenShortKeysConfiguration();
	}

	async openOptionsPage(): Promise<void> {
		return sharedOpenOptionsPage();
	}

	async registerListeningAction<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		return this.broadcastProvider.registerListeningAction(actionName, listeningActionHandler);
	}
}
