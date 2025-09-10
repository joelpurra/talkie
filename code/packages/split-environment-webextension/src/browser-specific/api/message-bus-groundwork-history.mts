
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

import type IApiGroundworkHistory from "@talkie/split-environment-interfaces/iapi/iapi-groundwork-history.mjs";

import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";

import MessageBusGroundworkBase from "./message-bus-groundwork-base.mjs";

export default class MessageBusGroundworkHistory extends MessageBusGroundworkBase implements IApiGroundworkHistory {
	// TODO: assert response types.
	async getSpeakingHistoryLimit(): Promise<number> {
		return this.bespeak("service:settings:getSpeakingHistoryLimit");
	}

	async setSpeakingHistoryLimit(speakingHistoryLimit: number): Promise<void> {
		await this.betoken("service:settings:setSpeakingHistoryLimit", speakingHistoryLimit);
	}

	async getMostRecentSpeakingEntry(): Promise<SpeakingHistoryEntry | null> {
		return this.bespeak("service:history:getMostRecentSpeakingEntry");
	}

	async getSpeakingHistory(): Promise<readonly SpeakingHistoryEntry[]> {
		return this.bespeak("service:history:getSpeakingHistory");
	}

	async clearSpeakingHistory(): Promise<void> {
		await this.betoken("service:history:clearSpeakingHistory");
	}

	async removeSpeakingHistoryEntry(hash: number): Promise<void> {
		await this.betoken("service:history:removeSpeakingHistoryEntry", hash);
	}
}
