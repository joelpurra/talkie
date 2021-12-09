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
	openInternalUrlFromConfigurationInNewTab,
	openUrlFromConfigurationInNewTab,
} from "@talkie/split-environment-webextension/browser-specific/urls.mjs";
import {
	ReadonlyDeep,
} from "type-fest";

import {
	IBrowserCommandMap,
} from "../command-handler-types.mjs";
import ReadClipboardManager from "../read-clipboard-manager.mjs";
import TalkieBackground from "../talkie-background.mjs";

const getCommandMap = (
	talkieBackground: ReadonlyDeep<TalkieBackground>,
	readClipboardManager: ReadonlyDeep<ReadClipboardManager>,
): IBrowserCommandMap => ({
	"open-website-main": async () => {
		await openUrlFromConfigurationInNewTab("main");
	},
	"open-website-upgrade": async () => {
		await openInternalUrlFromConfigurationInNewTab("options-upgrade");
	},
	"read-clipboard": async () => {
		// NOTE: keeping the root chain separate from the speech chain.
		void readClipboardManager.startSpeaking();
	},
	"start-stop": async () => {
		// NOTE: keeping the root chain separate from the speech chain.
		void talkieBackground.startStopSpeakSelectionOnPage();
	},
	"start-text": async (text: unknown) => {
		if (typeof text !== "string") {
			throw new TypeError(`Unknown text in command "start-text": ${typeof text} ${JSON.stringify(text)}`);
		}

		// NOTE: keeping the root chain separate from the speech chain.
		void talkieBackground.startSpeakingCustomTextDetectLanguage(text);
	},
});

export default getCommandMap;
