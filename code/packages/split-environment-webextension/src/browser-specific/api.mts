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
import type IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
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
import {
	type BrowserTabId,
} from "@talkie/shared-interfaces/webext.mjs";
import type IApi from "@talkie/split-environment-interfaces/iapi.mjs";
import type IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import type ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";

import {
	getTalkieServices,
} from "./tabs.mjs";
import {
	openExternalUrlInNewTab as sharedOpenExternalUrlInNewTab,
	openOptionsPage as sharedOpenOptionsPage,
	openShortKeysConfiguration as sharedOpenShortKeysConfiguration,
} from "./urls.mjs";

export default class Api implements IApi {
	debouncedSpeakTextInCustomVoice: (text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>) => void;
	debouncedSpeakTextInVoiceWithOverrides: (text: string, voiceName: string) => void;
	debouncedSpeakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;

	// eslint-disable-next-line max-params
	constructor(
		private readonly metadataManager: IMetadataManager,
		private readonly configuration: IConfiguration,
		private readonly broadcastProvider: IBroadcasterProvider,
		private readonly talkieLocaleHelper: ITalkieLocaleHelper,
		private readonly localeProvider: ILocaleProvider,
	) {
		// HACK: re-serialize/deserialize non-primitives _received from_ the background page using jsonClone(), to avoid references dying ("can't access dead object").

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInCustomVoice = debounce(this.speakInCustomVoice.bind(this) as any, 200);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInVoiceWithOverrides = debounce(this.speakTextInVoiceWithOverrides.bind(this) as any, 200);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedSpeakTextInLanguageWithOverrides = debounce(this.speakTextInLanguageWithOverrides.bind(this) as any, 200);
	}

	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T {
		// TODO: separate "background API" from other functionality.
		// eslint-disable-next-line no-sync
		return jsonClone(this.configuration.getSync<T>(systemType, path));
	}

	async getConfigurationValue<T extends JsonValue>(configurationPath: string): Promise<T> {
		// TODO: separate "background API" from other functionality.
		return jsonClone(await this.configuration.get<T>(configurationPath));
	}

	async iconClick(): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.iconClick();
	}

	async stopSpeaking(): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.stopSpeakFromFrontend();
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

	async getVoices(): Promise<SafeVoiceObjects> {
		const talkieServices = await getTalkieServices();

		return jsonClone(await talkieServices.getAllVoicesSafeObjects());
	}

	async getIsPremiumEdition(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getIsPremiumEdition();
	}

	async setIsPremiumEdition(isPremiumEdition: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setIsPremiumEdition(isPremiumEdition);
	}

	async getSpeakLongTexts(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getSpeakLongTexts();
	}

	async setSpeakLongTexts(speakLongTexts: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setSpeakLongTexts(speakLongTexts);
	}

	async getShowAdditionalDetails(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getShowAdditionalDetails();
	}

	async setShowAdditionalDetails(showAdditionalDetails: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setShowAdditionalDetails(showAdditionalDetails);
	}

	async getSpeakingHistoryLimit(): Promise<number> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getSpeakingHistoryLimit();
	}

	async setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setSpeakingHistoryLimit(speakingHistoryLimit);
	}

	async getMostRecentSpeakingEntry(): Promise<SpeakingHistoryEntry | null> {
		const talkieServices = await getTalkieServices();

		return jsonClone(await talkieServices.getMostRecentSpeakingEntry());
	}

	async getSpeakingHistory(): Promise<SpeakingHistoryEntry[]> {
		const talkieServices = await getTalkieServices();

		return jsonClone(await talkieServices.getSpeakingHistory());
	}

	async clearSpeakingHistory(): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.clearSpeakingHistory();
	}

	async pruneSpeakingHistory(): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.pruneSpeakingHistory();
	}

	async removeSpeakingHistoryEntry(hash: number): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.removeSpeakingHistoryEntry(hash);
	}

	async storeMostRecentSpeakingEntry(speakingHistoryEntry: ReadonlyDeep<SpeakingHistoryEntry>): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.storeMostRecentSpeakingEntry(speakingHistoryEntry);
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

	async getContinueOnTabRemoved(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getContinueOnTabRemoved();
	}

	async setContinueOnTabRemoved(continueOnTabRemoved: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setContinueOnTabRemoved(continueOnTabRemoved);
	}

	async getContinueOnTabUpdatedUrl(): Promise<boolean> {
		const talkieServices = await getTalkieServices();

		return talkieServices.getContinueOnTabUpdatedUrl();
	}

	async setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl: boolean): Promise<void> {
		const talkieServices = await getTalkieServices();

		await talkieServices.setContinueOnTabUpdatedUrl(continueOnTabUpdatedUrl);
	}

	async getTranslatedLanguages(): Promise<TalkieLocale[]> {
		// TODO: separate "background API" from other functionality.
		return jsonClone(await this.talkieLocaleHelper.getTranslatedLanguages());
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
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getEditionType();
	}

	async getSystemType(): Promise<SystemType> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getSystemType();
	}

	async getOperatingSystemType(): Promise<OsType> {
		// TODO: separate "background API" from other functionality.
		return this.metadataManager.getOperatingSystemType();
	}

	async openExternalUrlInNewTab(url: ReadonlyDeep<URL>): Promise<BrowserTabId> {
		// TODO: separate "background API" from other functionality.
		return sharedOpenExternalUrlInNewTab(url);
	}

	async openShortKeysConfiguration(): Promise<BrowserTabId> {
		// TODO: separate "background API" from other functionality.
		return sharedOpenShortKeysConfiguration();
	}

	async openOptionsPage(): Promise<void> {
		// TODO: separate "background API" from other functionality.
		return sharedOpenOptionsPage();
	}

	async registerListeningAction<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		return this.broadcastProvider.registerListeningAction(actionName, listeningActionHandler);
	}

	async getLocationHash(): Promise<string | null> {
		// TODO: separate "background API" from other functionality.
		if (document.location && typeof document.location.hash === "string" && document.location.hash.length > 0) {
			return document.location.hash;
		}

		return null;
	}

	async setLocationHash(locationHash: string): Promise<void> {
		// TODO: separate "background API" from other functionality.
		// TODO: use assign?
		// https://developer.mozilla.org/en-US/docs/Web/API/Location/assign
		document.location.hash = locationHash;
	}

	async getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection> {
		// TODO: separate "background API" from other functionality.
		return this.talkieLocaleHelper.getBidiDirection(talkieLocale);
	}

	async getSampleText(talkieLocale: TalkieLocale): Promise<string> {
		// TODO: separate "background API" from other functionality.
		return this.talkieLocaleHelper.getSampleText(talkieLocale);
	}

	async isTalkieLocale(languageGroup: string): Promise<boolean> {
		// TODO: separate "background API" from other functionality.
		return this.talkieLocaleHelper.isTalkieLocale(languageGroup);
	}

	async getTranslationLocale(): Promise<TalkieLocale> {
		// TODO: separate "background API" from other functionality.
		return this.localeProvider.getTranslationLocale();
	}

	async getNavigatorLanguage(): Promise<Readonly<string | null>> {
		// TODO: separate "background API" from other functionality.
		return window.navigator.language;
	}

	async getNavigatorLanguages(): Promise<Readonly<string[]>> {
		// TODO: separate "background API" from other functionality.
		return window.navigator.languages;
	}
}
