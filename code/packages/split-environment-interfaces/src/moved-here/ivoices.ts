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

export type IVoiceName = {
	name: string;
};
export type IVoiceLanguage = {
	lang: string;
};
export type IVoiceNameAndLanguage = IVoiceName & IVoiceLanguage;
export type IVoiceNameAndLanguageAndRateAndPitch = IVoiceNameAndLanguage & {
	rate: number;
	pitch: number;
};
export type IVoiceNameAndLanguageOrNull = {
	lang: string | null;
	name: string | null;
};

// TODO: add `extends JsonObject` when it does not trigger error TS2589: Type instantiation is excessively deep and possibly infinite?
export interface MutableSafeVoiceObject {
	isSafeVoiceObject: true;
	default: boolean;
	lang: string;
	localService: boolean;
	name: string;
	voiceURI: string;
}

export interface SafeVoiceObject extends Readonly<MutableSafeVoiceObject> {}
