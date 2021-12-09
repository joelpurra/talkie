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
	loggedPromiseCallback,
} from "@talkie/shared-application/promise-logging.mjs";
import {
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	ReadonlyDeep,
} from "type-fest";
import type {
	Menus,
} from "webextension-polyfill";

import ContextMenuManager from "../context-menu-manager.mjs";
import ShortcutKeyManager from "../shortcut-key-manager.mjs";
import TalkieBackground from "../talkie-background.mjs";

const createAndStartCommandListeners = async (
	talkieBackground: ReadonlyDeep<TalkieBackground>,
	contextMenuManager: ReadonlyDeep<ContextMenuManager>,
	shortcutKeyManager: ReadonlyDeep<ShortcutKeyManager
	>): Promise<void> => {
	// NOTE: used when the popup has been disabled.
	browser.browserAction.onClicked.addListener(
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
		loggedPromiseCallback<unknown>(
			async () => talkieBackground.startStopSpeakSelectionOnPage(),
			"onClicked",
		),
	);

	browser.contextMenus.onClicked.addListener(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		loggedPromiseCallback<ReadonlyDeep<Menus.OnClickData> | any>(
			async (info: ReadonlyDeep<Menus.OnClickData>) => contextMenuManager.contextMenuClickAction(info),
			"onClicked",
		),
	);

	// NOTE: might throw an unexpected error in Firefox due to command configuration in manifest.json.
	// Does not seem to happen in Chrome.
	// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/commands/onCommand
	try {
		browser.commands.onCommand.addListener(
			loggedPromiseCallback(
				async (command: string) => shortcutKeyManager.handler(command),
				"onCommand",
			),
		);
	} catch (error: unknown) {
		void logError("browser.commands.onCommand.addListener(...)", error);
	}
};

export default createAndStartCommandListeners;
