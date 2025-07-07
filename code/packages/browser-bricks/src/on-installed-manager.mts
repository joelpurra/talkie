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

import type SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import type StorageUpgrader from "@talkie/shared-application/storage/storage-upgrader.mjs";
import type {
	Runtime,
} from "webextension-polyfill";

import type ContextMenuManager from "./context-menu-manager.mjs";
import type StorageBackendMigrator from "./storage/storage-backend-migrator.mjs";
import type WelcomeManager from "./welcome-manager.mjs";

import {
	betoken,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	isTalkieDevelopmentMode,
} from "@talkie/shared-application-helpers/talkie-build-mode.mjs";
import {
	type IMetadataManager,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import {
	type OnInstallEvent,
	REASON_INSTALL,
} from "./on-installed-manager-types.mjs";
import migrateStorageBackend from "./storage/migrate-storage-backend.mjs";

export default class OnInstalledManager {
	// eslint-disable-next-line max-params
	constructor(
		private readonly messageBusProviderGetter: IMessageBusProviderGetter,
		private readonly storageBackendMigrator: StorageBackendMigrator,
		private readonly storageUpgrader: StorageUpgrader,
		private readonly settingsManager: SettingsManager,
		private readonly metadataManager: IMetadataManager,
		private readonly contextMenuManager: ContextMenuManager,
		private readonly welcomeManager: WelcomeManager,
		private readonly onInstallListenerEventQueue: OnInstallEvent[],
	) {
		// TODO: use broadcast listeners instead.
	}

	async _setSettingsManagerDefaults(): Promise<void> {
		// NOTE: only setting non-default values here, otherwise keeping the implicit default value.
		// TODO: consider "dynamically" changing default values instead, to reduce hardcoded setting values and allow defaults (per-browser, etcetera) to change (just like browsers do) in the future?
		// TODO: implement settings' default values as a tree, like chrome/webext configuration, such that chrome/webext/production/development can have well-defined overrides?
		// TODO: break out this functionality, completely separately or perhaps to the to settings manager?
		// TODO: also reflect these per-system defaults in the user interface?
		// TODO: allow users to click-to-restore default per-system default settings?
		void logDebug(this.constructor.name, "Start", "_setSettingsManagerDefaults");

		try {
			const isWebExtensionVersion = await this.metadataManager.isWebExtensionVersion();

			if (isWebExtensionVersion) {
				// NOTE: enabling speaking long texts by default in WebExtensions (Mozilla Firefox) to reflect (current) default behavior/capabilities.
				// NOTE: this is because Firefox handles long texts better than Google Chrome.
				await this.settingsManager.setSpeakLongTexts(true);
			}

			if (isWebExtensionVersion) {
				// NOTE: enabling "continuing" speech (not auto-stopping) when the tab URL changes by default in WebExtensions (Mozilla Firefox) to reflect (current) default behavior/capabilities.
				// NOTE: this is because Firefox preserves privacy by not always reporting URL changes for the tab.onUpdated event, even with the activeTab permission.
				// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activetab_permission
				await this.settingsManager.setContinueOnTabUpdatedUrl(true);
			}

			if (isTalkieDevelopmentMode()) {
				// NOTE: automatic developer privilege; see also node/server-side/precompiled html defaults.
				await this.settingsManager.setIsPremiumEdition(true);

				// NOTE: show additional details by default for developers.
				await this.settingsManager.setShowAdditionalDetails(true);
			}

			void logDebug(this.constructor.name, "Done", "_setSettingsManagerDefaults");
		} catch (error: unknown) {
			void logError(this.constructor.name, "_setSettingsManagerDefaults", error);

			throw error;
		}
	}

	async onExtensionInstalledHandler(event: Readonly<Runtime.OnInstalledDetailsType>): Promise<void> {
		try {
			if (isTalkieDevelopmentMode()) {
				// HACK: mixing test code/data and regular code.
				await betoken(this.messageBusProviderGetter, "offscreen:storage:window:localStorage:injectTestData");
			}

			await migrateStorageBackend(this.storageBackendMigrator);

			await this.storageUpgrader.upgradeIfNecessary();
		} catch (error: unknown) {
			void logError(this.constructor.name, "onExtensionInstalledHandler", "swallowing error", error);
		}

		try {
			// NOTE: removing all context menus in case the menus have changed since the last install/update.
			await this.contextMenuManager.removeAll();
			await this.contextMenuManager.createContextMenus();
		} catch (error: unknown) {
			void logError(this.constructor.name, "onExtensionInstalledHandler", "swallowing error", error);
		}

		try {
			if (event.reason === REASON_INSTALL) {
				await this._setSettingsManagerDefaults();
				await this.welcomeManager.openWelcomePage();
			}
		} catch (error: unknown) {
			void logError(this.constructor.name, "onExtensionInstalledHandler", "swallowing error", error);
		}
	}

	async onInstallListenerEventQueueHandler(): Promise<void> {
		// NOTE: should this be a while loop, but without the return?
		if (this.onInstallListenerEventQueue.length > 0) {
			const onInstallListenerEvent = this.onInstallListenerEventQueue.shift();

			if (!onInstallListenerEvent) {
				throw new RangeError(`Malformed event in queue: ${this.onInstallListenerEventQueue.length} ${JSON.stringify(this.onInstallListenerEventQueue)} ${typeof onInstallListenerEvent} ${JSON.stringify(onInstallListenerEvent)}`);
			}

			if (!onInstallListenerEvent.event) {
				throw new Error(`Malformed event in queue: ${typeof onInstallListenerEvent} ${JSON.stringify(onInstallListenerEvent)}`);
			}

			void logDebug(this.constructor.name, "onInstallListenerEventQueueHandler", "Start", onInstallListenerEvent);

			await this.onExtensionInstalledHandler(onInstallListenerEvent.event);

			void logDebug(this.constructor.name, "onInstallListenerEventQueueHandler", "Done", onInstallListenerEvent);
		}
	}
}
