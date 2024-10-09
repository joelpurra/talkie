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

import type ContextMenuManager from "@talkie/browser-bricks/context-menu-manager.mjs";
import type ShortcutKeyManager from "@talkie/browser-bricks/shortcut-key-manager.mjs";
import type SpeakerPageManager from "@talkie/browser-bricks/speaker-page-manager.mjs";
import {
	loggedPromiseCallback,
} from "@talkie/shared-application/promise-logging.mjs";
import {
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";
import type {
	Menus,
	Tabs,
} from "webextension-polyfill";

const createAndStartCommandListeners = async (
	contextMenuManager: ReadonlyDeep<ContextMenuManager>,
	shortcutKeyManager: ReadonlyDeep<ShortcutKeyManager>,
	speakerPageManager: ReadonlyDeep<SpeakerPageManager>,
): Promise<void> => {
	// NOTE: used when the popup has been disabled.
	chrome.action.onClicked.addListener(
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
		loggedPromiseCallback<unknown>(
			async () => speakerPageManager.startStopSpeakSelectionOnPage(),
			"onClicked",
		),
	);

	chrome.contextMenus.onClicked.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		loggedPromiseCallback<ReadonlyDeep<Menus.OnClickData> | any>(
			async (info: ReadonlyDeep<Menus.OnClickData>) => contextMenuManager.contextMenuClickAction(info),
			"onClicked",
		),
	);

	// NOTE: might throw an unexpected error in Firefox due to command configuration in manifest.json.
	// Does not seem to happen in Chrome.
	// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/commands/onCommand
	try {
		chrome.commands.onCommand.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
			loggedPromiseCallback<string | Tabs.Tab | any>(
				async (command: string) => shortcutKeyManager.handler(command),
				"onCommand",
			),
		);
	} catch (error: unknown) {
		void logError("chrome.commands.onCommand.addListener(...)", "swallowing error", error);
	}
};

export default createAndStartCommandListeners;
