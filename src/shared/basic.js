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

export const shallowCopy = (...objs) => Object.assign({}, ...objs);

export const last = (indexable) => indexable[indexable.length - 1];

export const flatten = (deepArray) => {
	if (!Array.isArray(deepArray)) {
		return deepArray;
	}

	if (deepArray.length === 0) {
		return [];
	}

	if (deepArray.length === 1) {
		return [].concat(flatten(deepArray[0]));
	}

	return [].concat(flatten(deepArray[0])).concat(flatten(deepArray.slice(1)));
};

export const isUndefinedOrNullOrEmptyOrWhitespace = (string) => !(string && typeof string === "string" && string.length > 0 && string.trim().length > 0);

export const getRandomInt = (min, max) => {
	if (typeof min === "undefined") {
		min = Number.MIN_VALUE;
		max = Number.MAX_VALUE;
	}

	if (typeof max === "undefined") {
		max = min;
		min = 0;
	}

	if (max === min) {
		return min;
	}

	if (min > max) {
		const t = min;
		min = max;
		max = t;
	}

	return min + Math.floor(Math.random() * (max - min));
};

// Polyfill for Math.round()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
// TODO: don't add non-standard functions to Math.
// Closure
(function () {
	/**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
	function decimalAdjust(type, value, exp) {
		// If the exp is undefined or zero...
		if (typeof exp === "undefined" || Number(exp) === 0) {
			return Math[type](value);
		}

		value = Number(value);
		exp = Number(exp);
		// If the value is not a number or the exp is not an integer...
		if (Number.isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
			return Number.NaN;
		}

		// If the value is negative...
		if (value < 0) {
			return -decimalAdjust(type, -value, exp);
		}

		// Shift
		value = value.toString().split("e");
		value = Math[type](Number(value[0] + "e" + (value[1] ? (Number(value[1]) - exp) : -exp)));
		// Shift back
		value = value.toString().split("e");
		return Number(value[0] + "e" + (value[1] ? (Number(value[1]) + exp) : exp));
	}

	// Decimal round
	if (!Math.round10) {
		Math.round10 = function (value, exp) {
			return decimalAdjust("round", value, exp);
		};
	}

	// Decimal floor
	if (!Math.floor10) {
		Math.floor10 = function (value, exp) {
			return decimalAdjust("floor", value, exp);
		};
	}

	// Decimal ceil
	if (!Math.ceil10) {
		Math.ceil10 = function (value, exp) {
			return decimalAdjust("ceil", value, exp);
		};
	}
})();

export const debounce = (fn, limit) => {
	let timeout = null;
	let args = null;

	const limiter = (...limiterArgs) => {
		args = limiterArgs;

		clearTimeout(timeout);

		timeout = setTimeout(
			async () => {
				timeout = null;

				try {
					await fn(...args);
				} catch (error) {
				// TODO: log/handle success/errors?
					throw error;
				}
			},
			limit,
		);
	};

	return limiter;
};
