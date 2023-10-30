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
	openExternalUrlFromConfigurationInNewTab,
	openInternalUrlFromConfigurationInNewTab,
} from "@talkie/split-environment-webextension/browser-specific/urls.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	type IBrowserCommandMap,
} from "../command-handler-types.mjs";
import type ReadClipboardManager from "../read-clipboard-manager.mjs";
import type TalkieBackground from "../talkie-background.mjs";

const getCommandMap = (
	talkieBackground: ReadonlyDeep<TalkieBackground>,
	readClipboardManager: ReadonlyDeep<ReadClipboardManager>,
): IBrowserCommandMap => ({
	async "open-website-main"() {
		await openExternalUrlFromConfigurationInNewTab("main");
	},
	async "open-website-upgrade"() {
		await openInternalUrlFromConfigurationInNewTab("options-features");
	},
	async "read-clipboard"() {
		// NOTE: keeping the root chain separate from the speech chain.
		void readClipboardManager.startSpeaking();
	},
	async "start-stop"() {
		// NOTE: keeping the root chain separate from the speech chain.
		void talkieBackground.startStopSpeakSelectionOnPage();
	},
	async "start-text"(text: unknown) {
		if (typeof text !== "string") {
			throw new TypeError(`Unknown text in command "start-text": ${typeof text} ${JSON.stringify(text)}`);
		}

		// NOTE: keeping the root chain separate from the speech chain.
		void talkieBackground.startSpeakingCustomTextDetectLanguage(text);
	},
});

export default getCommandMap;
