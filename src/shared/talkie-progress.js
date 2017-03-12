/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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
    knownEvents,
} from "../shared/events";

export default class TalkieProgress {
    constructor(broadcaster, min, max, current) {
        this.broadcaster = broadcaster;
        this.interval = null;
        this.intervalDelay = 100;
        this.minSpeed = 0.015;

        this.resetProgress(min, max, current);
    }

    getEventData() {
        const eventData = {
            min: this.min,
            max: this.max,
            current: this.current,
        };

        return eventData;
    }

    broadcastEvent(eventName) {
        const eventData = this.getEventData();

        return this.broadcaster.broadcastEvent(eventName, eventData);
    }

    getPercent() {
        if (this.max === 0) {
            return 0;
        }

        const pct = (this.current / this.max) * 100;

        return pct;
    }

    updateProgress() {
        this.broadcastEvent(knownEvents.updateProgress);
    }

    resetProgress(min, max, current) {
        const now = Date.now();

        this.resetTime = now;
        this.min = min || 0;
        this.max = max || 0;
        this.current = current || 0;
        this.segmentSum = this.min;
        // this.segments = [];

        this.broadcastEvent(knownEvents.resetProgress);

        this.updateProgress();
    }

    addProgress(n) {
        const segmentLimited = Math.min(this.segmentSum, this.current + n);

        this.current = segmentLimited;

        this.broadcastEvent(knownEvents.addProgress);

        this.updateProgress();
    }

    getSpeed() {
        const now = Date.now();

        const timeDiff = now - this.resetTime;

        if (timeDiff === 0) {
            return this.minSpeed;
        }

        const speed = this.current / timeDiff;

        const adjustedSpeed = Math.max(speed, this.minSpeed);

        return adjustedSpeed;
    }

    intervalIncrement() {
        const now = Date.now();
        const intervalDiff = now - this.previousInterval;
        const speed = this.getSpeed();
        const increment = intervalDiff * speed;

        this.previousInterval = now;

        this.addProgress(increment);
    }

    startSegment(n) {
        const now = Date.now();

        this.previousInterval = now;

        this.segmentSum += n;

        this.interval = setInterval(this.intervalIncrement.bind(this), this.intervalDelay);
    }

    endSegment() {
        clearInterval(this.interval);

        this.interval = null;

        this.current = this.segmentSum;

        this.updateProgress();
    }

    finishProgress() {
        this.current = this.max;

        this.broadcastEvent(knownEvents.finishProgress);

        this.updateProgress();
    }
}
