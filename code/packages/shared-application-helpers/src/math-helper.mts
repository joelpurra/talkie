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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class, unicorn/no-static-only-class
export default class MathHelper {
// Polyfill for Math.round()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
	/**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
	static decimalAdjust(type: "round" | "floor" | "ceil", value: number, exp: number): number {
		// If the exp is undefined or zero...
		if (exp === undefined || Number(exp) === 0) {
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
			return -MathHelper.decimalAdjust(type, -value, exp);
		}

		// Shift
		let parts = value.toString().split("e");
		value = Math[type](Number(`${parts[0]}e${parts[1] ? (Number(parts[1]) - exp) : -exp}`));
		// Shift back
		parts = value.toString().split("e");
		return Number(`${parts[0]}e${parts[1] ? (Number(parts[1]) + exp) : exp}`);
	}

	static round10 = function (value: number, exp: number): number {
		return MathHelper.decimalAdjust("round", value, exp);
	};

	static floor10 = function (value: number, exp: number): number {
		return MathHelper.decimalAdjust("floor", value, exp);
	};

	static ceil10 = function (value: number, exp: number): number {
		return MathHelper.decimalAdjust("ceil", value, exp);
	};
}
