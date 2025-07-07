/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type VoiceLanguageManager from "./voice-language-manager.mjs";
import type VoicePitchManager from "./voice-pitch-manager.mjs";
import type VoiceRateManager from "./voice-rate-manager.mjs";

import {
	type IVoiceNameAndLanguage,
} from "@talkie/shared-interfaces/ivoices.mjs";

export default class VoiceManager {
	// NOTE: there is also an utterance volume property.
	constructor(private readonly voiceLanguageManager: VoiceLanguageManager, private readonly voiceRateManager: VoiceRateManager, private readonly voicePitchManager: VoicePitchManager) {}

	async getEffectiveVoiceForLanguage(languageCode: string): Promise<IVoiceNameAndLanguage | null> {
		return this.voiceLanguageManager.getEffectiveVoiceForLanguage(languageCode);
	}

	async toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		return this.voiceLanguageManager.toggleLanguageVoiceOverrideName(languageCode, voiceName);
	}

	async getEffectiveRateForVoice(voiceName: string): Promise<number> {
		return this.voiceRateManager.getEffectiveRateForVoice(voiceName);
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		return this.voiceRateManager.setVoiceRateOverride(voiceName, rate);
	}

	async getEffectivePitchForVoice(voiceName: string): Promise<number> {
		return this.voicePitchManager.getEffectivePitchForVoice(voiceName);
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		return this.voicePitchManager.setVoicePitchOverride(voiceName, pitch);
	}
}
