/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

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
