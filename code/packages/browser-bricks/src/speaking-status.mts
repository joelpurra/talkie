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

import {
	logError,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	getCurrentActiveBrowserTabId,
} from "@talkie/split-environment-webextension/browser-specific/tabs.mjs";

export default class SpeakingStatus {
	private currentSpeakingTab: number | null = null;

	async setSpeakingTabId(browserTabId: number): Promise<void> {
		if (await this.isSpeaking()) {
			if (this.currentSpeakingTab === browserTabId) {
				void logWarn(`Tried to set tab ${browserTabId} as speaking, but (the same) tab ${this.currentSpeakingTab} was already speaking.`);
			} else {
				void logError(`Tried to set tab ${browserTabId} as speaking, but tab ${this.currentSpeakingTab} was already speaking.`);
			}
		}

		this.currentSpeakingTab = browserTabId;
	}

	async setDoneSpeaking(): Promise<void> {
		this.currentSpeakingTab = null;
	}

	async setTabIsDoneSpeaking(browserTabId: number): Promise<void> {
		const isTabSpeaking = await this.isSpeakingTabId(browserTabId);

		// TODO: throw if it's not the same browserTabId as the currently speaking tab?
		if (isTabSpeaking) {
			await this.setDoneSpeaking();
		}
	}

	async isSpeakingTabId(browserTabId: number): Promise<boolean> {
		return await this.isSpeaking() && browserTabId === this.currentSpeakingTab;
	}

	async isSpeaking(): Promise<boolean> {
		// TODO: check synthesizer.speaking === true?
		return this.currentSpeakingTab !== null;
	}

	async setActiveTabIsDoneSpeaking(): Promise<void> {
		const activeBrowserTabId = await getCurrentActiveBrowserTabId();

		// NOTE: some tabs can't be retrieved.
		await (
			activeBrowserTabId === null
				? this.setDoneSpeaking()
				: this.setTabIsDoneSpeaking(activeBrowserTabId)
		);
	}

	async setActiveTabAsSpeaking(): Promise<void> {
		const activeBrowserTabId = await getCurrentActiveBrowserTabId();

		// NOTE: some tabs can't be retrieved.
		if (!activeBrowserTabId) {
			return;
		}

		await this.setSpeakingTabId(activeBrowserTabId);
	}

	async isActiveTabSpeaking(): Promise<boolean> {
		const activeBrowserTabId = await getCurrentActiveBrowserTabId();

		// NOTE: some tabs can't be retrieved.
		if (!activeBrowserTabId) {
			return false;
		}

		return this.isSpeakingTabId(activeBrowserTabId);
	}
}
