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

import {
	logError,
} from "@talkie/shared-application-helpers/log.mjs";

const redundantlyTriggerLoadingVoices: () => Promise<SpeechSynthesisVoice[]> = async () => {
// HACK: trigger loading the voices from somewhere other than the background script.
// NOTE: may be called multiple times, from different scripts/locations, with or without additional delays.
// NOTE: the background context in Chrome on Linux does not seem to load any voices (ever?).
// NOTE: the background context in Firefox on Linux does not load voices (or at least pass the loaded array) on the first (welcome) page load, at least if there are thousands of voices.
// NOTE: the above occurs is particularly noticeable during testing with temporary browser profiles, and can thus be assumed to occur on first installs (or cold boots?) for at least some end-users.
	try {
		return globalThis.speechSynthesis.getVoices();
	} catch (error) {
		// NOTE: log but ignore errors; this is a "hidden" execution with the sole purpose of triggering side-effects.

		void logError("redundantlyTriggerLoadingVoices", "swallowing error", error);
	}

	return [];
};

export default redundantlyTriggerLoadingVoices;
