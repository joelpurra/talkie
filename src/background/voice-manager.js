/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

export default class VoiceManager {
    constructor(voiceLanguageManager, voiceRateManager, voicePitchManager) {
        this.voiceLanguageManager = voiceLanguageManager;
        this.voiceRateManager = voiceRateManager;
        this.voicePitchManager = voicePitchManager;
    }

    getEffectiveVoiceForLanguage(...args) {
        return this.voiceLanguageManager.getEffectiveVoiceForLanguage(...args);
    }

    isLanguageVoiceOverrideName(...args) {
        return this.voiceLanguageManager.isLanguageVoiceOverrideName(...args);
    }

    toggleLanguageVoiceOverrideName(...args) {
        return this.voiceLanguageManager.toggleLanguageVoiceOverrideName(...args);
    }

    getVoiceRateDefault(...args) {
        return this.voiceRateManager.getVoiceRateDefault(...args);
    }

    getEffectiveRateForVoice(...args) {
        return this.voiceRateManager.getEffectiveRateForVoice(...args);
    }

    setVoiceRateOverride(...args) {
        return this.voiceRateManager.setVoiceRateOverride(...args);
    }

    getVoicePitchDefault(...args) {
        return this.voicePitchManager.getVoicePitchDefault(...args);
    }

    getEffectivePitchForVoice(...args) {
        return this.voicePitchManager.getEffectivePitchForVoice(...args);
    }

    setVoicePitchOverride(...args) {
        return this.voicePitchManager.setVoicePitchOverride(...args);
    }
}
