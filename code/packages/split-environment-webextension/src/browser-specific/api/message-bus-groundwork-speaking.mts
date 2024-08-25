
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
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	type IVoiceNameAndRateAndPitch,
} from "@talkie/shared-interfaces/ivoices.mjs";
import type IApiGroundworkSpeaking from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-speaking.mjs";
import type {
	IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import MessageBusGroundworkBase from "./message-bus-groundwork-base.mjs";

export default class MessageBusGroundworkSpeaking extends MessageBusGroundworkBase implements IApiGroundworkSpeaking {
	// TODO: assert response types.
	debouncedSpeakTextInCustomVoice: (text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>) => void;
	debouncedSpeakTextInCustomVoiceCleanup: () => void;
	debouncedSpeakTextInVoiceWithOverrides: (text: string, voiceName: string) => void;
	debouncedSpeakTextInVoiceWithOverridesCleanup: () => void;
	debouncedSpeakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;
	debouncedSpeakTextInLanguageWithOverridesCleanup: () => void;

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	constructor(messageBusProviderGetter: IMessageBusProviderGetter) {
		super(messageBusProviderGetter);
		// HACK: re-serialize/deserialize non-primitives _received from_ the background page using jsonClone(), to avoid references dying ("can't access dead object").
		// TODO: move (duplicate?) debouncing to lower layer.
		[
			this.debouncedSpeakTextInCustomVoice,
			this.debouncedSpeakTextInCustomVoiceCleanup,
		] = debounce(this.speakTextInCustomVoice.bind(this), 200);

		[
			this.debouncedSpeakTextInVoiceWithOverrides,
			this.debouncedSpeakTextInVoiceWithOverridesCleanup,
		] = debounce(this.speakTextInVoiceWithOverrides.bind(this), 200);

		[
			this.debouncedSpeakTextInLanguageWithOverrides,
			this.debouncedSpeakTextInLanguageWithOverridesCleanup,
		] = debounce(this.speakTextInLanguageWithOverrides.bind(this), 200);
	}

	async cleanup(): Promise<void> {
		// TODO: systematic cleanup of classes and their side-effects.
		this.debouncedSpeakTextInCustomVoiceCleanup();
		this.debouncedSpeakTextInVoiceWithOverridesCleanup();
		this.debouncedSpeakTextInLanguageWithOverridesCleanup();
	}

	async stopSpeaking(): Promise<void> {
		await this.betoken("service:speaking:stop");
	}

	async speakTextInCustomVoice(text: string, voice: ReadonlyDeep<IVoiceNameAndRateAndPitch>): Promise<void> {
		await this.betoken(
			"service:speaking:speakInCustomVoice", {
				text,
				voice,
			},
		);
	}

	async speakTextInVoiceWithOverrides(text: string, voiceName: string): Promise<void> {
		await this.betoken(
			"service:speaking:speakInVoiceWithOverrides", {
				text,
				voiceName,
			},
		);
	}

	async speakTextInLanguageWithOverrides(text: string, languageCode: string): Promise<void> {
		await this.betoken(
			"service:speaking:speakInLanguageWithOverrides", {
				languageCode,
				text,
			},
		);
	}

	async speakFromClipboard(): Promise<void> {
		await this.betoken("service:speaking:speakFromClipboard");
	}
}
