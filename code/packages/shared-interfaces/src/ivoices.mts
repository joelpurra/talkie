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
	type JsonObject,
} from "type-fest";

export interface IVoiceName {
	name: string;
}

export interface IVoiceLanguage {
	lang: string;
}

export interface IVoiceNameAndLanguage extends IVoiceName, IVoiceLanguage {}

export interface IVoiceNameAndRateAndPitch extends IVoiceName {
	rate: number;
	pitch: number;
}

export interface MutableSafeVoiceObject extends JsonObject {
	isSafeVoiceObject: true;
	default: boolean;
	lang: string;
	localService: boolean;
	name: string;
	voiceUri: string;
}

export interface SafeVoiceObject extends Readonly<MutableSafeVoiceObject> {}

export interface SafeVoiceObjects extends Readonly<SafeVoiceObject[]> {}

export interface MutableSafeUtteranceObject extends JsonObject {
	lang: string;
	pitch: number;
	rate: number;
	text: string;
	voice: SafeVoiceObject | null;
	volume: number;
}

export interface SafeUtteranceObject extends Readonly<MutableSafeUtteranceObject> {}

export interface SafeUtteranceObjects extends Readonly<SafeUtteranceObject[]> {}

export interface MutableSpeechSynthesisEventObject extends JsonObject {
	charIndex: number;
	charLength: number;
	elapsedTime: number;
	name: string;
	utterance: SafeUtteranceObject;
}

export interface SafeSpeechSynthesisEventObject extends Readonly<MutableSpeechSynthesisEventObject> {}

export interface SafeSpeechSynthesisEventObjects extends Readonly<SafeSpeechSynthesisEventObject[]> {}
