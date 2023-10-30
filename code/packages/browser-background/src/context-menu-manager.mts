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
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	type IMetadataManager,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import type {
	ReadonlyDeep,
	Writable,
} from "type-fest";
import {
	type Menus,
} from "webextension-polyfill";

import type CommandHandler from "./command-handler.mjs";

export interface ContextMenuOptions {
	chrome: boolean;
	free: boolean;
	item: Menus.CreateCreatePropertiesType;
	premium: boolean;
	webextension: boolean;
}

export default class ContextMenuManager {
	actionMenuLimit: number;
	contextMenuOptionsCollection: ReadonlyDeep<ContextMenuOptions[]>;

	constructor(private readonly commandHandler: CommandHandler, private readonly metadataManager: IMetadataManager, private readonly translator: ITranslatorProvider) {
		this.actionMenuLimit = !Number.isNaN(browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT)
			&& browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT > 0
			? browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT
			: Number.MAX_SAFE_INTEGER;

		// TODO: async load/unload logic for classes.
		this.contextMenuOptionsCollection = [
			{
				chrome: true,
				free: true,
				item: {
					contexts: [
						"selection",
					],
					id: "talkie-context-menu-start-stop",
					// eslint-disable-next-line no-sync
					title: this.translator.translateSync("contextMenuStartStopText"),
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
					// eslint-disable-next-line no-sync
					title: this.translator.translateSync("commandStartStopDescription"),
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
					// eslint-disable-next-line no-sync
					title: this.translator.translateSync("commandReadClipboardDescription"),
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
					// eslint-disable-next-line no-sync
					title: this.translator.translateSync("commandOpenWebsiteMainDescription"),
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
					// eslint-disable-next-line no-sync
					title: this.translator.translateSync("commandOpenWebsiteUpgradeDescription"),
				},
				premium: false,
				webextension: true,
			},
		];
	}

	private get contextMenuStartStopId() {
		return "talkie-context-menu-start-stop";
	}

	async removeAll(): Promise<void> {
		void logDebug("Start", "Removing all context menus");

		await browser.contextMenus.removeAll();

		void logDebug("Done", "Removing all context menus");
	}

	async createContextMenu(contextMenuOptions: ReadonlyDeep<Menus.CreateCreatePropertiesType>): Promise<void> {
		void logDebug("Start", "Creating context menu", contextMenuOptions);

		// NOTE: apparently Chrome modifies the context menu object after it has been passed in, by adding generatedId.
		// NOTE: Need to pass a clean object to avoid object reuse reference problems.
		// TODO: actually pick specific properties instead of copying everything.
		const contextMenu: ReadonlyDeep<Menus.CreateCreatePropertiesType> = {
			...contextMenuOptions,
		};

		// NOTE: Can't directly use a promise chain here, as the id is returned instead.
		// https://github.com/mozilla/webextension-polyfill/pull/26
		const contextMenuId = browser.contextMenus.create(
			contextMenu as Writable<Menus.CreateCreatePropertiesType>,
			() => {
				if (browser.runtime.lastError) {
					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw browser.runtime.lastError;
				}

				void logDebug("Done", "Creating context menu", contextMenu);

				return contextMenuId;
			},
		);
	}

	async contextMenuClickAction(info: ReadonlyDeep<Menus.OnClickData>): Promise<void> {
		void logDebug("Start", "contextMenuClickAction", info);

		if (!info) {
			throw new Error(`Unknown context menu click action info object: ${typeof info} ${JSON.stringify(info)}`);
		}

		const id = info.menuItemId;

		if (typeof id !== "string") {
			// NOTE: all of Talkie's command handlers are string-mapped.
			// TODO: handle id number case?
			throw new TypeError(`Unknown context menu click action info object id type: ${typeof id} ${JSON.stringify(id)}`);
		}

		const selectionContextMenuStartStop = this.contextMenuOptionsCollection.find((contextMenuOption) => contextMenuOption.item.id === this.contextMenuStartStopId);

		// TODO: use assertions?
		if (!selectionContextMenuStartStop) {
			throw new Error(`Not found: ${this.contextMenuStartStopId}`);
		}

		if (id === selectionContextMenuStartStop.item.id) {
			const selection = info.selectionText ?? null;

			if (!selection || typeof selection !== "string" || selection.length === 0) {
				throw new Error(`Unknown or empty context menu click action selection: ${typeof selection} ${JSON.stringify(selection)}`);
			}

			return this.commandHandler.handle("start-text", selection);
		}

		// NOTE: context menu items default to being commands.
		await this.commandHandler.handle(id);

		void logDebug("Done", "contextMenuClickAction", info);
	}

	async createContextMenus(): Promise<void> {
		const [
			editionType,
			systemType,
		] = await Promise.all([
			this.metadataManager.getEditionType(),
			this.metadataManager.getSystemType(),
		]);

		const applicableContextMenuOptions = this.contextMenuOptionsCollection
			.filter((contextMenuOption) => contextMenuOption[editionType] && contextMenuOption[systemType]);

		// // TODO: group by selected contexts before checking against limit.
		// if (applicableContextMenuOptions > this.actionMenuLimit) {
		// throw new Error("Maximum number of menu items reached.");
		// }

		for await (const applicableContextMenuOption of applicableContextMenuOptions) {
			await this.createContextMenu(applicableContextMenuOption.item);
		}
	}
}
