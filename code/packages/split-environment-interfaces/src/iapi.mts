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
	EditionType,
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	LanguageTextDirection,
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import {
	IVoiceNameAndRateAndPitch,
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import {
	KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	knownEventNames,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	ListeningActionHandler,
} from "@talkie/shared-interfaces/listening-action-handler.mjs";
import type {
	JsonValue,
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

export default interface IApi {
	debouncedSpeakTextInCustomVoice: (text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>) => void;

	debouncedSpeakTextInVoiceWithOverrides: (text: string, voiceName: string) => void;

	debouncedSpeakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;

	getConfigurationValueSync<T extends JsonValue>(systemType: SystemType, path: string): T;

	getConfigurationValue<T>(configurationPath: string): Promise<T>;

	iconClick(): Promise<void>;

	speakInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void>;

	speakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void>;

	speakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void>;

	getVoices(): Promise<SafeVoiceObject[]>;

	getIsPremiumEditionOption(): Promise<boolean>;

	setIsPremiumEditionOption(isPremiumEdition: boolean): Promise<void>;

	getSpeakLongTextsOption(): Promise<boolean>;

	setSpeakLongTextsOption(speakLongTexts: boolean): Promise<void>;

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

	openUrlInNewTab(url: string): Promise<Tabs.Tab>;

	openShortKeysConfiguration(): Promise<Tabs.Tab>;

	openOptionsPage(): Promise<void>;

	registerListeningAction<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch>;

	getLocationHash(): Promise<string | null>;

	setLocationHash(locationHash: string): Promise<void>;

	getBidiDirection(talkieLocale: TalkieLocale): Promise<LanguageTextDirection>;

	getSampleText(talkieLocale: TalkieLocale): Promise<string>;

	isTalkieLocale(languageGroup: string): Promise<boolean>;

	getTranslationLocale(): Promise<TalkieLocale>;

	getNavigatorLanguage(): Promise<Readonly<string | null>>;

	getNavigatorLanguages(): Promise<Readonly<string[]>>;
}
