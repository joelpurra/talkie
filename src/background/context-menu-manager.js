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
	shallowCopy,
} from "../shared/basic";
import {
	logDebug,
} from "../shared/log";
import {
	promiseTry,
} from "../shared/promise";

export default class ContextMenuManager {
	constructor(commandHandler, metadataManager, translator) {
		this.commandHandler = commandHandler;
		this.metadataManager = metadataManager;
		this.translator = translator;

		if (!Number.isNaN(browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT) && browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT > 0) {
			this.actionMenuLimit = browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT;
		} else {
			this.actionMenuLimit = Number.MAX_SAFE_INTEGER;
		}

		this.contextMenuOptionsCollection = [
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"selection",
					],
					id: "talkie-context-menu-start-stop",
					title: this.translator.translate("contextMenuStartStopText"),
				},
				premium: true,
				webextension: true,
			},
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"browser_action",
					],
					id: "start-stop",
					title: this.translator.translate("commandStartStopDescription"),
				},
				premium: true,
				webextension: true,
			},
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"browser_action",
						"page",
					],
					id: "read-clipboard",
					title: this.translator.translate("commandReadClipboardDescription"),
				},
				premium: true,
				// TODO: enable after Firefox 55 has landed?
				webextension: false,
			},
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"browser_action",
					],
					id: "buttonContextMenuSeparator01",
					type: "separator",
				},
				premium: true,
				webextension: true,
			},
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"browser_action",
					],
					id: "open-website-main",
					title: this.translator.translate("commandOpenWebsiteMainDescription"),
				},
				premium: true,
				webextension: true,
			},
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"browser_action",
					],
					id: "open-website-upgrade",
					title: this.translator.translate("commandOpenWebsiteUpgradeDescription"),
				},
				premium: false,
				webextension: true,
			},
		];
	}

	removeAll() {
		return promiseTry(
			() => {
				logDebug("Start", "Removing all context menus");

				return browser.contextMenus.removeAll()
					.then((result) => {
						logDebug("Done", "Removing all context menus");

						return result;
					});
			},
		);
	}

	createContextMenu(contextMenuOptions) {
		return new Promise(
			(resolve, reject) => {
				try {
					logDebug("Start", "Creating context menu", contextMenuOptions);

					// NOTE: apparently Chrome modifies the context menu object after it has been passed in, by adding generatedId.
					// NOTE: Need to pass a clean object to avoid object reuse reference problems.
					const contextMenu = shallowCopy(contextMenuOptions);

					// NOTE: Can't directly use a promise chain here, as the id is returned instead.
					// https://github.com/mozilla/webextension-polyfill/pull/26
					const contextMenuId = browser.contextMenus.create(
						contextMenu,
						() => {
							if (browser.runtime.lastError) {
								return reject(browser.runtime.lastError);
							}

							logDebug("Done", "Creating context menu", contextMenu);

							return resolve(contextMenuId);
						},
					);
				} catch (error) {
					reject(error);
				}
			},
		);
	}

	contextMenuClickAction(info) {
		return promiseTry(
			() => {
				logDebug("Start", "contextMenuClickAction", info);

				if (!info) {
					throw new Error("Unknown context menu click action info object.");
				}

				return promiseTry(
					() => {
						const id = info.menuItemId;

						const selectionContextMenuStartStop = this.contextMenuOptionsCollection
							// eslint-disable-next-line unicorn/no-reduce
							.reduce(
								(previous, object) => {
									if (object.item.id === "talkie-context-menu-start-stop") {
										return object;
									}

									return previous;
								},
								null);

						// TODO: use assertions?
						if (!selectionContextMenuStartStop) {
							throw new Error("Not found: selectionContextMenuStartStop");
						}

						if (id === selectionContextMenuStartStop.item.id) {
							const selection = info.selectionText || null;

							if (!selection || typeof selection !== "string" || selection.length === 0) {
								throw new Error("Unknown context menu click action selection was empty.");
							}

							return this.commandHandler.handle("start-text", selection);
						}

						// NOTE: context menu items default to being commands.
						return this.commandHandler.handle(id);
					},
				)
					.then(() => {
						logDebug("Done", "contextMenuClickAction", info);

						return undefined;
					});
			},
		);
	}

	createContextMenus() {
		return promiseTry(
			() => {
				return Promise.all([
					this.metadataManager.getEditionType(),
					this.metadataManager.getSystemType(),
				])
					.then(([
						editionType,
						systemType,
					]) => {
						const applicableContextMenuOptions = this.contextMenuOptionsCollection
							.filter((contextMenuOption) => contextMenuOption[editionType] === true && contextMenuOption[systemType] === true);

						// // TODO: group by selected contexts before checking against limit.
						// if (applicableContextMenuOptions > this.actionMenuLimit) {
						// throw new Error("Maximum number of menu items reached.");
						// }

						const contextMenuOptionsCollectionPromises = applicableContextMenuOptions
							.map((contextMenuOption) => this.createContextMenu(contextMenuOption.item));

						return Promise.all(contextMenuOptionsCollectionPromises);
					});
			},
		);
	}
}
