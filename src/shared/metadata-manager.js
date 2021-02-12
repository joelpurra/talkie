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

export default class MetadataManager {
	constructor(manifestProvider, settingsManager) {
		this.manifestProvider = manifestProvider;
		this.settingsManager = settingsManager;

		this._editionTypePremium = "premium";
		this._editionTypeFree = "free";
		this._systemTypeChrome = "chrome";
		this._systemTypeWebExtension = "webextension";
	}

	async isPremiumEdition() {
		return this.settingsManager.getIsPremiumEdition();
	}

	async getExtensionId() {
		return browser.runtime.id;
	}

	getManifestSync() {
		// eslint-disable-next-line no-sync
		return this.manifestProvider.getSync();
	}

	async getManifest() {
		// eslint-disable-next-line no-sync
		return this.getManifestSync();
	}

	async getVersionNumber() {
		const manifest = await this.getManifest();

		return manifest.version || null;
	}

	async getVersionName() {
		const manifest = await this.getManifest();

		return manifest.version_name || null;
	}

	async getEditionType() {
		const isPremiumEdition = await this.isPremiumEdition();

		if (isPremiumEdition) {
			return this._editionTypePremium;
		}

		return this._editionTypeFree;
	}

	async isChromeVersion() {
		const versionName = await this.getVersionName();

		if (versionName.includes(" Chrome Extension ")) {
			return true;
		}

		return false;
	}

	async isWebExtensionVersion() {
		const versionName = await this.getVersionName();

		if (versionName.includes(" WebExtension ")) {
			return true;
		}

		return false;
	}

	async getSystemType() {
		const isChrome = await this.isChromeVersion();

		if (isChrome) {
			return this._systemTypeChrome;
		}

		return this._systemTypeWebExtension;
	}

	async getOsType() {
		const platformInfo = await browser.runtime.getPlatformInfo();

		if (platformInfo && typeof platformInfo.os === "string") {
			// https://developer.chrome.com/extensions/runtime#type-PlatformOs
			return platformInfo.os;
		}

		return null;
	}
}
