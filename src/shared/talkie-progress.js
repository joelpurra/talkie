class TalkieProgress {
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

    start() {
        const self = this;

        return Promise.resolve()
            .then(() => self.broadcaster.registerListeningAction(knownEvents.beforeSpeaking, (actionName, actionData) => self.resetProgress(0, actionData.text.length, 0)))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.beforeSpeakingPart, (actionName, actionData) => self.startSegment(actionData.textPart.length)))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.afterSpeakingPart, () => self.endSegment()))
            .then(() => self.broadcaster.registerListeningAction(knownEvents.afterSpeaking, () => self.finishProgress()));
    }
}
