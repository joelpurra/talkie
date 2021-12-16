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
	LoggingLevel,
} from "@talkie/shared-application-helpers/log.mjs";
import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import {
	EditionType,
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	IVoiceNameAndLanguage,
	IVoiceNameAndRateAndPitch,
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";

export interface ITalkieServices {
	broadcaster: () => IBroadcasterProvider;
	logTrace: (...args: Readonly<unknown[]>) => void;
	logDebug: (...args: Readonly<unknown[]>) => void;
	logInfo: (...args: Readonly<unknown[]>) => void;
	logWarn: (...args: Readonly<unknown[]>) => void;
	logError: (...args: Readonly<unknown[]>) => void;
	setLoggingLevel: (nextLevel: LoggingLevel) => void;
	setLoggingStringOnlyOutput: (stringOnly: boolean) => void;
	// setStringOnlyOutput: (stringOnly: boolean) => void;
	getAllVoicesSafeObjects: () => Promise<SafeVoiceObject[]>;
	iconClick: () => Promise<void>;
	stopSpeakFromFrontend: () => Promise<void>;
	startSpeakFromFrontend: (frontendText: string, frontendVoice: Readonly<IVoiceNameAndRateAndPitch>) => Promise<void>;
	startSpeakInVoiceWithOverridesFromFrontend: (frontendText: string, frontendVoiceName: string) => Promise<void>;
	startSpeakInLanguageWithOverridesFromFrontend: (frontendText: string, frontendLanguageCode: string) => Promise<void>;
	getVersionNumber: () => Promise<string | null>;
	getVersionName: () => Promise<string | null>;
	getEditionType: () => Promise<EditionType>;
	isPremiumEdition: () => Promise<boolean>;
	getSystemType: () => Promise<SystemType>;
	getOperatingSystemType: () => Promise<OsType>;
	getIsPremiumEditionOption: () => Promise<boolean>;
	setIsPremiumEditionOption: (isPremiumEdition: boolean) => Promise<void>;
	getSpeakLongTextsOption: () => Promise<boolean>;
	setSpeakLongTextsOption: (speakLongTexts: boolean) => Promise<void>;
	getEffectiveVoiceForLanguage: (languageName: string) => Promise<IVoiceNameAndLanguage | null>;
	isLanguageVoiceOverrideName: (languageName: string, voiceName: string) => Promise<boolean>;
	toggleLanguageVoiceOverrideName: (languageName: string, voiceName: string) => Promise<boolean>;
	getVoiceRateDefault: (voiceName: string) => Promise<number>;
	setVoiceRateOverride: (voiceName: string, rate: number) => Promise<void>;
	getEffectiveRateForVoice: (voiceName: string) => Promise<number>;
	getVoicePitchDefault: (voiceName: string) => Promise<number>;
	setVoicePitchOverride: (voiceName: string, pitch: number) => Promise<void>;
	getEffectivePitchForVoice: (voiceName: string) => Promise<number>;
	getStoredValue: <T>(key: string) => Promise<T | null>;
	setStoredValue: <T>(key: string, value: T) => Promise<void>;
	getConfigurationValue: <T=unknown>(path: string) => Promise<T>;
}
