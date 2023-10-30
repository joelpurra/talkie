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

import type SettingsManager from "@talkie/shared-application/settings-manager.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import {
	type ReadonlyDeep,
} from "type-fest";

export default class HistoryManager {
	constructor(private readonly settingsManager: SettingsManager) {}

	async getMostRecentSpeakingEntry(): Promise<SpeakingHistoryEntry | null> {
		const speakingHistory = await this.settingsManager.getSpeakingHistory();

		return speakingHistory[0] ?? null;
	}

	async getSpeakingHistory(): Promise<SpeakingHistoryEntry[]> {
		const speakingHistory = await this.settingsManager.getSpeakingHistory();
		const speakingHistoryLimit = await this.settingsManager.getSpeakingHistoryLimit();

		// NOTE: "soft enforce" limit; use pruning or writing to "hard enforce" the limit.
		const limitedSpeakingHistory: SpeakingHistoryEntry[] = speakingHistory.slice(0, speakingHistoryLimit);

		return limitedSpeakingHistory;
	}

	async clearSpeakingHistory(): Promise<void> {
		await this.settingsManager.setSpeakingHistory([]);
	}

	async pruneSpeakingHistory(): Promise<void> {
		const speakingHistory = await this.settingsManager.getSpeakingHistory();
		const speakingHistoryLimit = await this.settingsManager.getSpeakingHistoryLimit();
		const limitedSpeakingHistory: SpeakingHistoryEntry[] = speakingHistory.slice(0, speakingHistoryLimit);

		await this.settingsManager.setSpeakingHistory(limitedSpeakingHistory);
	}

	async removeSpeakingHistoryEntry(hash: number): Promise<void> {
		const speakingHistory = await this.settingsManager.getSpeakingHistory();

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const filteredSpeakingHistory: SpeakingHistoryEntry[] = speakingHistory.filter((entry) => entry.hash !== hash);

		await this.settingsManager.setSpeakingHistory(filteredSpeakingHistory);
	}

	async storeMostRecentSpeakingEntry(newEntry: ReadonlyDeep<SpeakingHistoryEntry>): Promise<void> {
		const speakingHistory = await this.settingsManager.getSpeakingHistory();

		// HACK: ordered set of unique entries by hash, but without any optimizations.
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const speakingHistoryExceptNewEntry = speakingHistory.filter((oldEntry) => oldEntry.hash !== newEntry.hash);

		const rewrittenSpeakingHistory: SpeakingHistoryEntry[] = [
			newEntry,
			...speakingHistoryExceptNewEntry,
		];

		const speakingHistoryLimit = await this.settingsManager.getSpeakingHistoryLimit();
		const limitedSpeakingHistory: SpeakingHistoryEntry[] = rewrittenSpeakingHistory.slice(0, speakingHistoryLimit);

		await this.settingsManager.setSpeakingHistory(limitedSpeakingHistory);
	}
}
