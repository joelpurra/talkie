/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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
    promiseTry,
} from "../shared/promise";

import {
    getCurrentActiveTab,
    getCurrentActiveTabId,
} from "../shared/tabs";

export default class SpeakingStatus {
    constructor() {
        this.currentSpeakingTab = null;
    }

    getSpeakingTabId() {
        return promiseTry(
            () => this.currentSpeakingTab
        );
    }

    setSpeakingTabId(tabId) {
        return this.isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                if (isTabSpeaking) {
                    throw new Error(`Tried to set tab ${tabId} as speaking, but another tab was already speaking.`);
                }

                this.currentSpeakingTab = tabId;

                return undefined;
            });
    }

    setDoneSpeaking() {
        return promiseTry(
            () => {
                this.currentSpeakingTab = null;
            }
        );
    }

    setTabIsDoneSpeaking(tabId) {
        return this.isSpeakingTabId(tabId)
            .then((isTabSpeaking) => {
                // TODO: throw if it's not the same tabId as the currently speaking tab?
                if (isTabSpeaking) {
                    return this.setDoneSpeaking();
                }

                return undefined;
            });
    }

    isSpeakingTabId(tabId) {
        return promiseTry(
            () => this.currentSpeakingTab !== null && tabId === this.currentSpeakingTab
        );
    }

    isSpeaking() {
        return this.getSpeakingTabId()
            // TODO: check synthesizer.speaking === true?
            .then((speakingTabId) => speakingTabId !== null);
    }

    setActiveTabIsDoneSpeaking() {
        return getCurrentActiveTabId()
            .then((activeTabId) => this.setTabIsDoneSpeaking(activeTabId));
    }

    setActiveTabAsSpeaking() {
        return getCurrentActiveTab()
            .then((activeTab) => {
                // NOTE: some tabs can't be retreived.
                if (!activeTab) {
                    return undefined;
                }

                const activeTabId = activeTab.id;

                return this.setSpeakingTabId(activeTabId);
            });
    }

    isActiveTabSpeaking() {
        return getCurrentActiveTabId()
            .then((activeTabId) => this.isSpeakingTabId(activeTabId));
    }
}
