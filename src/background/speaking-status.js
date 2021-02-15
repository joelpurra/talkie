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
	getCurrentActiveTab,
	getCurrentActiveTabId,
} from "../shared/tabs";

export default class SpeakingStatus {
	constructor() {
		this.currentSpeakingTab = null;
	}

	async getSpeakingTabId() {
		return this.currentSpeakingTab;
	}

	async setSpeakingTabId(tabId) {
		const isTabSpeaking = await this.isSpeakingTabId(tabId);

		if (isTabSpeaking) {
			throw new Error(`Tried to set tab ${tabId} as speaking, but another tab was already speaking.`);
		}

		this.currentSpeakingTab = tabId;
	}

	async setDoneSpeaking() {
		this.currentSpeakingTab = null;
	}

	async setTabIsDoneSpeaking(tabId) {
		const isTabSpeaking = await this.isSpeakingTabId(tabId);

		// TODO: throw if it's not the same tabId as the currently speaking tab?
		if (isTabSpeaking) {
			return this.setDoneSpeaking();
		}
	}

	async isSpeakingTabId(tabId) {
		return this.currentSpeakingTab !== null && tabId === this.currentSpeakingTab;
	}

	async isSpeaking() {
		const speakingTabId = await this.getSpeakingTabId();

		// TODO: check synthesizer.speaking === true?
		return speakingTabId !== null;
	}

	async setActiveTabIsDoneSpeaking() {
		const activeTabId = await getCurrentActiveTabId();

		return this.setTabIsDoneSpeaking(activeTabId);
	}

	async setActiveTabAsSpeaking() {
		const activeTab = await getCurrentActiveTab();

		// NOTE: some tabs can't be retrieved.
		if (!activeTab) {
			return;
		}

		const activeTabId = activeTab.id;

		return this.setSpeakingTabId(activeTabId);
	}

	async isActiveTabSpeaking() {
		const activeTabId = await getCurrentActiveTabId();

		return this.isSpeakingTabId(activeTabId);
	}
}
