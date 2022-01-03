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
	type EditionType,
	type OsType,
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type LanguageTextDirection,
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
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
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

type IApi = {
	debouncedSpeakTextInCustomVoice: (text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>) => void;
	debouncedSpeakTextInVoiceWithOverrides: (text: string, voiceName: string) => void;
	debouncedSpeakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;
	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T;
	getConfigurationValue<T extends JsonValue>(configurationPath: string): Promise<T>;
	iconClick(): Promise<void>;
	stopSpeaking(): Promise<void>;
	speakInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void>;
	speakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void>;
	speakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void>;
	getVoices(): Promise<SafeVoiceObjects>;
	getIsPremiumEdition(): Promise<boolean>;
	setIsPremiumEdition(isPremiumEdition: boolean): Promise<void>;
	getSpeakLongTexts(): Promise<boolean>;
	setSpeakLongTexts(speakLongTexts: boolean): Promise<void>;
	getShowAdditionalDetails(): Promise<boolean>;
	setShowAdditionalDetails(showAdditionalDetails: boolean): Promise<void>;
	getSpeakingHistoryLimit(): Promise<number>;
	setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void>;
	getMostRecentSpeakingEntry(): Promise<SpeakingHistoryEntry | null>;
	getSpeakingHistory(): Promise<SpeakingHistoryEntry[]>;
	clearSpeakingHistory(): Promise<void>;
	pruneSpeakingHistory(): Promise<void>;
	removeSpeakingHistoryEntry(hash: number): Promise<void>;
	storeMostRecentSpeakingEntry(speakingHistoryEntry: ReadonlyDeep<SpeakingHistoryEntry>): Promise<void>;
	getEffectiveVoiceForLanguage(languageCode: string): Promise<string | null>;
	getEffectiveRateForVoice(voiceName: string): Promise<number>;
	setVoiceRateOverride(voiceName: string, rate: number): Promise<void>;
	getEffectivePitchForVoice(voiceName: string): Promise<number>;
	setVoicePitchOverride(voiceName: string, pitch: number): Promise<void>;
	toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean>;
	getTranslatedLanguages(): Promise<TalkieLocale[]>;
	isPremiumEdition(): Promise<boolean>;
	getVersionName(): Promise<string | null>;
	getVersionNumber(): Promise<string | null>;
	getEditionType(): Promise<EditionType>;
	getSystemType(): Promise<SystemType>;
	getOperatingSystemType(): Promise<OsType>;
	openExternalUrlInNewTab(url: ReadonlyDeep<URL>): Promise<Tabs.Tab>;
	openShortKeysConfiguration(): Promise<Tabs.Tab>;
	openOptionsPage(): Promise<void>;

	registerListeningAction<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch>;

	getLocationHash(): Promise<string | null>;
	setLocationHash(locationHash: string): Promise<void>;
	getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection>;
	getSampleText(talkieLocale: TalkieLocale): Promise<string>;
	isTalkieLocale(languageGroup: string): Promise<boolean>;
	getTranslationLocale(): Promise<TalkieLocale>;
	getNavigatorLanguage(): Promise<Readonly<string | null>>;
	getNavigatorLanguages(): Promise<Readonly<string[]>>;
};
export default IApi;
