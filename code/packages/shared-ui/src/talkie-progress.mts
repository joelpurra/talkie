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

import {
	bullhorn,
} from "@talkie/shared-application/message-bus/message-bus-listener-helpers.mjs";
import {
	repeatAtMost,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logError,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	type IMessageBusProviderGetter,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

export interface TalkieProgressData extends Record<string, number> {
	current: number;
	max: number;
	min: number;
}

export default class TalkieProgress {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	private readonly intervalDelay = 100;
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	private readonly minSpeed = 0.015;

	private cancelIntervalTimer: (() => void) | null = null;
	private resetTime = 0;
	private currentSegmentStartTime = 0;

	/**
	 * Speed is measured in characters per milliseconds.
	 */
	private estimatedSpeed = this.minSpeed;

	private max = 0;
	private min = 0;
	private current = 0;

	private currentSegmentStartPosition = 0;
	private currentSegmentEndPosition = 0;

	constructor(private readonly messageBusProviderGetter: IMessageBusProviderGetter, min = 0, max = 0, current = 0) {
		void this.resetProgress(min, max, current);
	}

	async resetProgress(min = 0, max = 0, current = 0): Promise<void> {
		this._cancelInterval();

		// NOTE: progress range, from start (zero characters) to end (text length in characters) with an (optional) current/starting position (zero characters).
		this.min = min;
		this.max = max;
		this.current = current;

		// NOTE: the progress range is divided into an unknown number of (text) segments (may be paragraphs, sentences, a sequence of characters) of variable (character) length; only the "current" segment (and its characters length) is of concern.
		this.currentSegmentStartPosition = this.current;
		this.currentSegmentEndPosition = this.current;

		// NOTE: estimating speed based on the start (reset) time and the start of the current segment.
		const now = Date.now();
		this.resetTime = now;
		this.currentSegmentStartTime = now;
		this.estimatedSpeed = this.minSpeed;

		await this._updateProgress();
	}

	async startSegment(segmentLength: number): Promise<void> {
		// TODO: ensure that a segment isn't already in progress?
		if (typeof this.cancelIntervalTimer === "function") {
			// TODO: throw error?
			void logError(
				"A segment is currently in progress, but already attempting to start another segment. Ignoring the attempt, and letting the current segment end.",
				segmentLength,
				this.currentSegmentStartPosition,
				this.max,
			);

			return;
		}

		if (this.currentSegmentStartPosition >= this.max) {
			void logWarn("Already at the end, but attempting to start another segment.", this.currentSegmentStartPosition, this.max);

			return;
		}

		if (segmentLength < 0) {
			void logError("Attempting to start a segment of negative length.", segmentLength);

			return;
		}

		if (segmentLength === 0) {
			void logError("Attempting to start a segment of length zero.", segmentLength);

			return;
		}

		this.currentSegmentEndPosition = this.currentSegmentStartPosition + segmentLength;

		if (this.currentSegmentEndPosition > this.max) {
			void logWarn("Attempting to start a segment with an end after the maximum.", segmentLength, this.currentSegmentStartPosition, this.currentSegmentEndPosition, this.max);

			// NOTE: keeping the value within the range (insted of throwing) because the event-driven progress uses the message bus, which cannot be fully relied upon.
			this.currentSegmentEndPosition = this.max;
		}

		const now = Date.now();
		this.currentSegmentStartTime = now;
		this._updateEstimatedSpeed();

		// NOTE: in case the segment "never ends", estimating an upper bound limit to how many times this segment can have progress updated.
		// - "disappearing" browser extension contexts (here background/offscreen); might lead to lost progress messages.
		// - externally failed speech synthesis; not all speech state changes seem to propagate to the browser and in turn to talkie. (TTS crash? Lost internet connection for online voice?)
		const estimatedMaxIntervalIncrements = Math.ceil((segmentLength / this.estimatedSpeed) / this.intervalDelay);

		this.cancelIntervalTimer = repeatAtMost(
			this._intervalIncrement.bind(this),
			this.intervalDelay,
			estimatedMaxIntervalIncrements,
		);
	}

	async endSegment(): Promise<void> {
		this._cancelInterval();

		this.current = this.currentSegmentEndPosition;
		this.currentSegmentStartPosition = this.currentSegmentEndPosition;

		await this._updateProgress();
	}

	async finishProgress(): Promise<void> {
		this._cancelInterval();

		this.current = this.max;
		this.currentSegmentStartPosition = this.max;
		this.currentSegmentEndPosition = this.max;

		await this._updateProgress();
	}

	private _cancelInterval() {
		if (typeof this.cancelIntervalTimer === "function") {
			this.cancelIntervalTimer();
		}

		this.cancelIntervalTimer = null;
	}

	private async _updateProgress(): Promise<void> {
		// NOTE: singular "update" progress event type could be (and was previously) more specific: reset/start/increment/finish progress.
		const eventData: TalkieProgressData = {
			current: this.current,
			max: this.max,
			min: this.min,
		};

		await bullhorn(this.messageBusProviderGetter, "broadcaster:progress:update", eventData);
	}

	private _updateEstimatedSpeed(): void {
		const timeElapsedUntilSegmentStart = this.currentSegmentStartTime - this.resetTime;
		const speed = timeElapsedUntilSegmentStart === 0
			? 0
			: this.currentSegmentStartPosition / timeElapsedUntilSegmentStart;

		this.estimatedSpeed = Math.max(speed, this.minSpeed);
	}

	private async _intervalIncrement(): Promise<void> {
		// NOTE: there is no information of the detailed progress within the segment; estimate the increment based on calculated speed.
		const now = Date.now();
		const intervalDiff = now - this.currentSegmentStartTime;
		const estimatedIncrement = intervalDiff * this.estimatedSpeed;

		// NOTE: as intra-segment increments are mere estimates, keep increments within the segment.
		const currentPositionWithinSegment = Math.min(this.currentSegmentEndPosition, this.currentSegmentStartPosition + estimatedIncrement);

		this.current = currentPositionWithinSegment;

		await this._updateProgress();
	}
}
