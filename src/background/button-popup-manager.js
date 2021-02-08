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

export default class ButtonPopupManager {
	constructor(translator, metadataManager) {
		this.translator = translator;
		this.metadataManager = metadataManager;
	}

	async _getExtensionShortName() {
		const isPremiumEdition = await this.metadataManager.isPremiumEdition();

		// TODO: move resolving the name to a layer on top of the translator?
		const extensionShortName = isPremiumEdition
			? this.translator.translate("extensionShortName_Premium")
			: this.translator.translate("extensionShortName_Free");

		return extensionShortName;
	}

	async _getButtonDefaultTitle() {
		const extensionShortName = await this._getExtensionShortName();

		return this.translator.translate("buttonDefaultTitle", [
			extensionShortName,
		]);
	}

	async _getButtonStopTitle() {
		return this.translator.translate("buttonStopTitle");
	}

	_disablePopupSync(buttonStopTitle) {
		const disablePopupOptions = {
			popup: "",
		};

		browser.browserAction.setPopup(disablePopupOptions);

		const disableIconTitleOptions = {
			title: buttonStopTitle,
		};

		browser.browserAction.setTitle(disableIconTitleOptions);
	}

	_enablePopupSync(buttonDefaultTitle) {
		const enablePopupOptions = {
			popup: "src/popup/popup.html",
		};

		browser.browserAction.setPopup(enablePopupOptions);

		const enableIconTitleOptions = {
			title: buttonDefaultTitle,
		};

		browser.browserAction.setTitle(enableIconTitleOptions);
	}

	async disablePopup() {
		const buttonStopTitle = await this._getButtonStopTitle();

		/* eslint-disable no-sync */
		return this._disablePopupSync(buttonStopTitle);
		/* eslint-enable no-sync */
	}

	async enablePopup() {
		const buttonDefaultTitle = await this._getButtonDefaultTitle();

		/* eslint-disable no-sync */
		return this._enablePopupSync(buttonDefaultTitle);
		/* eslint-enable no-sync */
	}
}
