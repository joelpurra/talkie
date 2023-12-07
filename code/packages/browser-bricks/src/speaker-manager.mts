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

import type SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import type {
	IVoiceName,
	IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";

import type Speaker from "./speaker.mjs";
import type VoiceManager from "./voice-manager.mjs";

export default class SpeakerManager {
	constructor(private readonly speaker: Speaker, private readonly voiceManager: VoiceManager, private readonly settingsManager: SettingsManager) {}

	public async speakTextInVoice(text: string, voice: Readonly<IVoiceNameAndRateAndPitch>): Promise<void> {
		const speakLongTexts = await this.settingsManager.getSpeakLongTexts();

		return this.speaker.speakTextInVoice(text, voice, speakLongTexts);
	}

	public async augmentVoiceFromSettings(voice: Readonly<IVoiceName>): Promise<IVoiceNameAndRateAndPitch> {
		const [
			effectiveRateForVoice,
			effectivePitchForVoice,
		] = await Promise.all([
			this.voiceManager.getEffectiveRateForVoice(voice.name),
			this.voiceManager.getEffectivePitchForVoice(voice.name),
		]);

		const voiceWithPitchAndRate: IVoiceNameAndRateAndPitch = {
			...voice,
			pitch: effectivePitchForVoice,
			rate: effectiveRateForVoice,
		};

		return voiceWithPitchAndRate;
	}

	public async speakTextInVoiceByName(text: string, voiceName: string): Promise<void> {
		const voice: IVoiceName = {
			name: voiceName,
		};
		const voiceWithPitchAndRate = await this.augmentVoiceFromSettings(voice);

		return this.speakTextInVoice(text, voiceWithPitchAndRate);
	}

	public async speakTextInLanguage(text: string, language: string): Promise<void> {
		const effectiveVoiceForLanguage = await this.voiceManager.getEffectiveVoiceForLanguage(language);

		if (!effectiveVoiceForLanguage) {
			throw new Error(`Could not get effective voice for language: ${JSON.stringify(language)}`);
		}

		return this.speakTextInVoiceByName(text, effectiveVoiceForLanguage.name);
	}
}
