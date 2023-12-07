
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
	type SafeVoiceObjects,
} from "@talkie/shared-interfaces/ivoices.mjs";
import type IApiGroundworkVoices from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-voices.mjs";

import MessageBusGroundworkBase from "./message-bus-groundwork-base.mjs";

export default class MessageBusGroundworkVoices extends MessageBusGroundworkBase implements IApiGroundworkVoices {
	// TODO: assert response types.
	async getVoices(): Promise<SafeVoiceObjects> {
		return this.bespeak("offscreen:synthesizer:getAllSafeVoiceObjects");
	}

	async getEffectiveVoiceForLanguage(languageCode: string): Promise<string | null> {
		const effectiveVoiceForLanguage = await this.bespeak("service:voices:getEffectiveVoiceForLanguage", languageCode);

		return (
			typeof effectiveVoiceForLanguage === "object"
			&& effectiveVoiceForLanguage !== null
			&& "name" in effectiveVoiceForLanguage
			&& typeof effectiveVoiceForLanguage.name === "string"
			&& effectiveVoiceForLanguage.name
		) || null;
	}

	async getEffectiveRateForVoice(voiceName: string): Promise<number> {
		return this.bespeak("service:voices:getEffectiveRateForVoice", voiceName);
	}

	async setVoiceRateOverride(voiceName: string, rate: number): Promise<void> {
		await this.betoken("service:voices:setVoiceRateOverride", {
			rate,
			voiceName,
		});
	}

	async getEffectivePitchForVoice(voiceName: string): Promise<number> {
		return this.bespeak("service:voices:getEffectivePitchForVoice", voiceName);
	}

	async setVoicePitchOverride(voiceName: string, pitch: number): Promise<void> {
		await this.betoken("service:voices:setVoicePitchOverride", {
			pitch,
			voiceName,
		});
	}

	async toggleLanguageVoiceOverrideName(languageCode: string, voiceName: string): Promise<boolean> {
		return this.bespeak("service:voices:toggleLanguageVoiceOverrideName", {
			languageCode,
			voiceName,
		});
	}
}
