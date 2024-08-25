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

import type {
	IBrowserCommandMap,
} from "@talkie/browser-bricks/command-handler-types.mjs";
import type SpeakClipboardManager from "@talkie/browser-bricks/speak-clipboard-manager.mjs";
import type SpeakerPageManager from "@talkie/browser-bricks/speaker-page-manager.mjs";
import type UiManager from "@talkie/browser-bricks/ui-manager.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

const getCommandMap = (
	readClipboardManager: ReadonlyDeep<SpeakClipboardManager>,
	uiManager: ReadonlyDeep<UiManager>,
	speakerPageManager: ReadonlyDeep<SpeakerPageManager>,
): IBrowserCommandMap => ({
	async "open-website-main"() {
		await uiManager.openExternalUrlFromConfigurationInNewTab("main");
	},
	async "open-website-upgrade"() {
		await uiManager.openInternalUrlFromConfigurationInNewTab("options-features");
	},
	async "speak-clipboard"() {
		await readClipboardManager.checkPermissionAndSpeak();
	},
	async "start-stop"() {
		// NOTE: keeping the root chain separate from the speech chain.
		void speakerPageManager.startStopSpeakSelectionOnPage();
	},
	async "start-text"(text: unknown) {
		if (typeof text !== "string") {
			throw new TypeError(`Unknown text in command "start-text": ${typeof text} ${JSON.stringify(text)}`);
		}

		// NOTE: keeping the root chain separate from the speech chain.
		void speakerPageManager.startSpeakingCustomTextDetectLanguage(text);
	},
});

export default getCommandMap;
