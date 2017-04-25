export default class LogarithmicScaleRange {
    constructor(min, value, max, step) {
        this.linearMin = min;
        this.linearValue = value;
        this.linearMax = max;
        this.linearStep = step;
    }

    _toLogarithmicRangeScale(value) {
        const log = Math.round10(Math.log10(value) * 1000, 0);

        return log;
    }

    _fromLogarithmicRangeScale(value) {
        const linear = Math.pow(10, value / 1000);

        return linear;
    }

    get logMin() {
        return this._toLogarithmicRangeScale(this.linearMin);
    }

    set logMin(next) {
        this.linearMin = this._fromLogarithmicRangeScale(next);
    }

    get logValue() {
        return this._toLogarithmicRangeScale(this.linearValue);
    }

    set logValue(next) {
        this.linearValue = this._fromLogarithmicRangeScale(next);
    }

    get logMax() {
        return this._toLogarithmicRangeScale(this.linearMax);
    }

    set logMax(next) {
        this.linearMax = this._fromLogarithmicRangeScale(next);
    }

    get logStep() {
        return Math.min(
            Math.abs((this._toLogarithmicRangeScale(this.linearValue - this.linearStep)) - this.logValue),
            Math.abs((this._toLogarithmicRangeScale(this.linearValue + this.linearStep)) - this.logValue)
        );
    }

    get logSteps() {
        const steps = [];

        // NOTE: Adding min and max separately to get the exact values.
        steps.push(this._toLogarithmicRangeScale(this.linearMin));

        for (let step = Number.NEGATIVE_INFINITY, i = 1; step < (this.linearMax - (this.linearStep / 2)); i++) {
            step = this.linearMin + (i * this.linearStep);
            const logStep = this._toLogarithmicRangeScale(step);

            steps.push(logStep);
        }

        steps.push(this._toLogarithmicRangeScale(this.linearMax));

        return steps;
    }
}
