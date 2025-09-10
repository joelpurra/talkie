/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import type {
	Action,
} from "webextension-polyfill";

import {
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";

export default class ButtonPopupManager {
	constructor(
		private readonly translator: ITranslatorProvider,
		private readonly premiumManager: IPremiumManager,
	) {}

	private get _popupUrl() {
		// NOTE: relative to background.html, rooted in the browser extension package root.
		return "/packages/popup-renderer/src/popup.html";
	}

	async _getExtensionShortName(): Promise<string> {
		const isPremiumEdition = await this.premiumManager.isPremiumEdition();

		// TODO: move resolving the name to a layer on top of the translator?
		const extensionShortName = isPremiumEdition
			? await this.translator.translate("extensionShortName_Premium")
			: await this.translator.translate("extensionShortName_Free");

		return extensionShortName;
	}

	async _getButtonDefaultTitle(): Promise<string> {
		const extensionShortName = await this._getExtensionShortName();

		return this.translator.translate("buttonDefaultTitle", [
			extensionShortName,
		]);
	}

	async _getButtonStopTitle(): Promise<string> {
		return this.translator.translate("buttonStopTitle");
	}

	async disablePopup(): Promise<void> {
		const buttonStopTitle = await this._getButtonStopTitle();

		const disablePopupOptions: Action.SetPopupDetailsType = {
			popup: "",
		};

		await chrome.action.setPopup(disablePopupOptions);

		const disableIconTitleOptions: Action.SetTitleDetailsType = {
			title: buttonStopTitle,
		};

		await chrome.action.setTitle(disableIconTitleOptions);
	}

	async enablePopup(): Promise<void> {
		const buttonDefaultTitle = await this._getButtonDefaultTitle();

		const enablePopupOptions = {
			popup: this._popupUrl,
		};

		await chrome.action.setPopup(enablePopupOptions);

		const enableIconTitleOptions: Action.SetTitleDetailsType = {
			title: buttonDefaultTitle,
		};

		await chrome.action.setTitle(enableIconTitleOptions);
	}
}
