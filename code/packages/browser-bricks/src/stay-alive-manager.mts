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
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";

export default class StayAliveManager {
	private get _storagePropertyName() {
		return "stay-alive";
	}

	// NOTE: should be maximum 30 seconds; here aiming for a shorter interval.
	// https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers#keep-sw-alive
	private readonly _intervalMilliseconds = ((30 * 1000) / 3);

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _stayAliveIntervalId: any | null = null;

	private _activeStayAliveCounter = 0;
	private _totalStayAliveCounter = 0;

	async stayAlive(): Promise<void> {
		void logDebug(this.constructor.name, "Start", "start");

		// NOTE: automatically handle parallel starts/stops by counting.
		this._totalStayAliveCounter++;
		this._activeStayAliveCounter++;

		try {
			await this._step();

			this._stayAliveIntervalId = setInterval(async () => this._step(), this._intervalMilliseconds);

			void logDebug(this.constructor.name, "Done", "stayAlive");
		} catch (error: unknown) {
			void logError(this.constructor.name, "stayAlive", error);

			throw error;
		}
	}

	async justLetGo(): Promise<void> {
		void logDebug(this.constructor.name, "Start", "justLetGo");

		// NOTE: swallow potentially timing-sensitive errors, in particular since the message bus system is a hack.
		if (this._stayAliveIntervalId === null || this._activeStayAliveCounter === 0) {
			return;
		}

		this._activeStayAliveCounter--;

		try {
			if (this._activeStayAliveCounter === 0) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				clearInterval(this._stayAliveIntervalId);

				this._stayAliveIntervalId = null;

				void logDebug(this.constructor.name, "Done", "justLetGo");
			} else {
				void logDebug(this.constructor.name, "Continuing", "justLetGo", this._activeStayAliveCounter, this._totalStayAliveCounter);
			}
		} catch (error: unknown) {
			void logError(this.constructor.name, "justLetGo", error);

			throw error;
		}
	}

	private async _step() {
		const mostRecentTimestamp = await this._loadMostRecentTimestamp();
		const now = Date.now();
		const intervalDiff = mostRecentTimestamp === null
			? 0
			: now - mostRecentTimestamp;

		void logDebug(this.constructor.name, "Ah, ha, ha, ha, stayin' alive, stayin' alive!", this._activeStayAliveCounter, this._totalStayAliveCounter, `${intervalDiff > 0 ? "+" : ""}${intervalDiff} milliseconds`);

		await chrome.storage.local.set({
			[this._storagePropertyName]: now,
		});
	}

	private async _loadMostRecentTimestamp(): Promise<number | null> {
		const storedObject = await chrome.storage.local.get(this._storagePropertyName);
		const storedProperty = (storedObject)[this._storagePropertyName];

		// TODO: Math.isInteger().
		if (typeof storedProperty === "number" && storedProperty > 0 && Math.floor(storedProperty) === Math.ceil(storedProperty)) {
			return storedProperty;
		}

		return null;
	}
}
