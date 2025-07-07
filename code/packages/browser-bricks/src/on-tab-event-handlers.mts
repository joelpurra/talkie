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
import type {
	Tabs,
} from "webextension-polyfill";

import type Speaker from "./speaker.mjs";
import type SpeakingStatus from "./speaking-status.mjs";

import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";

export default class OnTabEventHandlers {
	constructor(private readonly speaker: Speaker, private readonly speakingStatus: SpeakingStatus, private readonly settingsManager: SettingsManager) {}

	async onTabRemovedHandler(browserTabId: number, _removeInfo: Readonly<Tabs.OnRemovedRemoveInfoType>): Promise<void> {
		const [
			isTabSpeaking,
			continueOnTabRemoved,
		] = await Promise.all([
			this.speakingStatus.isSpeakingTabId(browserTabId),
			this.settingsManager.getContinueOnTabRemoved(),
		]);

		void logDebug("Start", "onTabRemovedHandler", browserTabId, isTabSpeaking, continueOnTabRemoved);

		if (isTabSpeaking && !continueOnTabRemoved) {
			await this.speaker.stopSpeaking();
		}

		void logDebug("Done", "onTabRemovedHandler", browserTabId, isTabSpeaking, continueOnTabRemoved);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async onTabUpdatedHandler(browserTabId: number, changeInfo: Readonly<Tabs.OnUpdatedChangeInfoType>): Promise<void> {
		// NOTE: changeInfo only has properties which have changed.
		// NOTE: changeInfo is not completely reliable, because privacy-sensitive properties (`url`, `title`, etcetera) are sometimes witheld and may be absent even if they changed.
		// TODO: when browser support is better, use the tabs.onUpdated event listener property filter to only handle url changes here.
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated
		//
		// NOTE: it seems the activeTab permission is not enough to get the "updated" URL, because the permission is cleared *when* the URL changes.
		// NOTE: may be able to work around this with a hack:
		// 1. When first starting to speak:
		//    - Record `changeInfo` properties (`url` and `status`?) for the active tab, and store either uniquely or per tab id.
		//    - May even require injecting page scripts to extract the url?
		// 2. Here, during tab.onUpdated:
		//    - Manually compare recorded properties with any changes.
		//    - Attempt to detect page navigation (`status` changes from `completed` to `loading`?).
		// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activetab_permission
		if (typeof changeInfo.url !== "string") {
			return;
		}

		const [
			isTabSpeaking,
			continueOnTabUpdatedUrl,
		] = await Promise.all([
			this.speakingStatus.isSpeakingTabId(browserTabId),
			this.settingsManager.getContinueOnTabUpdatedUrl(),
		]);

		void logDebug("Start", "onTabUpdatedHandler", "URL has changed.", browserTabId, isTabSpeaking, continueOnTabUpdatedUrl);

		if (isTabSpeaking && !continueOnTabUpdatedUrl) {
			await this.speaker.stopSpeaking();
		}

		void logDebug("Done", "onTabUpdatedHandler", "URL has changed.", browserTabId, isTabSpeaking, continueOnTabUpdatedUrl);
	}
}
