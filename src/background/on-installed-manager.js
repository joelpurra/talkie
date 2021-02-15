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
	logError,
} from "../shared/log";

// NOTE: https://developer.chrome.com/extensions/runtime#type-OnInstalledReason
const REASON_INSTALL = "install";

export default class OnInstalledManager {
	// eslint-disable-next-line max-params
	constructor(storageManager, settingsManager, metadataManager, contextMenuManager, welcomeManager, onInstallListenerEventQueue) {
		// TODO: use broadcast listeners instead.
		this.storageManager = storageManager;
		this.settingsManager = settingsManager;
		this.metadataManager = metadataManager;
		this.contextMenuManager = contextMenuManager;
		this.welcomeManager = welcomeManager;
		this.onInstallListenerEventQueue = onInstallListenerEventQueue;
	}

	async _setSettingsManagerDefaults() {
		// TODO: move this function elsewhere?
		logDebug("Start", "_setSettingsManagerDefaults");

		try {
			const isWebExtensionVersion = await this.metadataManager.isWebExtensionVersion();

			// NOTE: enabling speaking long texts by default on in WebExtensions (Firefox).
			const speakLongTexts = isWebExtensionVersion;

			// TODO: move setting the default settings to the SettingsManager?
			const result = await this.settingsManager.setSpeakLongTexts(speakLongTexts);

			logDebug("Done", "_setSettingsManagerDefaults");

			return result;
		} catch (error) {
			logError("_setSettingsManagerDefaults", error);

			throw error;
		}
	}

	async onExtensionInstalledHandler(event) {
		try {
			await this.storageManager.upgradeIfNecessary();

			// NOTE: removing all context menus in case the menus have changed since the last install/update.
			await this.contextMenuManager.removeAll();
			await this.contextMenuManager.createContextMenus();

			if (event.reason === REASON_INSTALL) {
				await this._setSettingsManagerDefaults();
				await this.welcomeManager.openWelcomePage();
			}
		} catch (error) {
			logError("onExtensionInstalledHandler", error);
		}
	}

	async onInstallListenerEventQueueHandler() {
		// NOTE: should this be a while loop, but without the return?
		if (this.onInstallListenerEventQueue.length > 0) {
			const onInstallListenerEvent = this.onInstallListenerEventQueue.shift();

			logDebug("onInstallListenerEventQueueHandler", "Start", onInstallListenerEvent);

			await this.onExtensionInstalledHandler(onInstallListenerEvent.event);

			logDebug("onInstallListenerEventQueueHandler", "Done", onInstallListenerEvent);
		}
	}
}
