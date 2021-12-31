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

import Broadcaster from "@talkie/shared-application/broadcaster.mjs";
import {
	knownEvents,
} from "@talkie/shared-interfaces/known-events.mjs";

export type TalkieProgressData = {
	current: number;
	max: number;
	min: number;
};

export default class TalkieProgress {
	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	interval: any | null = null;
	intervalDelay = 100;
	minSpeed = 0.015;
	current = 0;
	max = 0;
	min = 0;
	resetTime = 0;
	segmentSum = 0;
	previousInterval = 0;

	constructor(private readonly broadcaster: Broadcaster, min = 0, max = 0, current = 0) {
		void this.resetProgress(min, max, current);
	}

	getEventData(): TalkieProgressData {
		const eventData: TalkieProgressData = {
			current: this.current,
			max: this.max,
			min: this.min,
		};

		return eventData;
	}

	async broadcastEvent<TEvent extends knownEvents>(eventName: TEvent): Promise<void> {
		const eventData = this.getEventData();

		await this.broadcaster.broadcastEvent<TEvent, TalkieProgressData, unknown>(eventName, eventData);
	}

	getPercent(): number {
		if (this.max === 0) {
			return 0;
		}

		const pct = (this.current / this.max) * 100;

		return pct;
	}

	async updateProgress(): Promise<void> {
		await this.broadcastEvent(knownEvents.updateProgress);
	}

	async resetProgress(min = 0, max = 0, current = 0): Promise<void> {
		const now = Date.now();

		this.resetTime = now;
		this.min = min;
		this.max = max;
		this.current = current;
		this.segmentSum = this.min;
		// this.segments = [];

		await this.broadcastEvent(knownEvents.resetProgress);

		await this.updateProgress();
	}

	async addProgress(n: number): Promise<void> {
		const segmentLimited = Math.min(this.segmentSum, this.current + n);

		this.current = segmentLimited;

		await this.broadcastEvent(knownEvents.addProgress);

		await this.updateProgress();
	}

	getSpeed(): number {
		const now = Date.now();

		const timeDiff = now - this.resetTime;

		if (timeDiff === 0) {
			return this.minSpeed;
		}

		const speed = this.current / timeDiff;

		const adjustedSpeed = Math.max(speed, this.minSpeed);

		return adjustedSpeed;
	}

	async intervalIncrement(): Promise<void> {
		const now = Date.now();
		const intervalDiff = now - this.previousInterval;
		const speed = this.getSpeed();
		const increment = intervalDiff * speed;

		this.previousInterval = now;

		await this.addProgress(increment);
	}

	async startSegment(n: number): Promise<void> {
		const now = Date.now();

		this.previousInterval = now;

		this.segmentSum += n;

		this.interval = setInterval(async () => {
			await this.intervalIncrement();
		}, this.intervalDelay);
	}

	async endSegment(): Promise<void> {
		clearInterval(this.interval);

		this.interval = null;

		this.current = this.segmentSum;

		await this.updateProgress();
	}

	async finishProgress(): Promise<void> {
		this.current = this.max;

		await this.broadcastEvent(knownEvents.finishProgress);

		await this.updateProgress();
	}
}
