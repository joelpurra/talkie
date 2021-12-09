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

import {
	JsonObject,
	Promisable,
} from "type-fest";

// TODO: use library?
export const jsonClone = <T extends JsonObject>(object: T): T => {
	const json = JSON.stringify(object);
	const restored: T = JSON.parse(json) as T;

	return restored;
};

// TODO: use library.
export const lastOrThrow = <T,>(indexable: Readonly<T[]>): T => {
	if (indexable.length === 0) {
		throw new RangeError("Indexable length 0.");
	}

	const lastIndex = indexable.length - 1;

	if (!(lastIndex in indexable)) {
		throw new RangeError("Last index not valid.");
	}

	const lastValue = indexable[lastIndex];

	if (typeof lastValue === "undefined") {
		throw new RangeError("Last indexable value is undefined.");
	}

	return lastValue;
};

// TODO: use library.
export const last = <T,>(indexable: Readonly<T[]>): T | undefined => indexable[indexable.length - 1];

// TODO: use library.
export const flatten = <T,>(deepArray: undefined | T | T[] | T[][] | T[][][] | T[][][][] | T[][][][][]): T[] => {
	if (typeof deepArray === "undefined") {
		// NOTE: mostly a typing workaround to avoid issues with the possibly undefined type of array element accessors.
		return [];
	}

	if (!Array.isArray(deepArray)) {
		return [
			deepArray,
		];
	}

	if (deepArray.length === 0) {
		return [];
	}

	if (deepArray.length === 1) {
		return new Array<T>().concat(flatten(deepArray[0]));
	}

	return new Array<T>().concat(flatten(deepArray[0])).concat(flatten(deepArray.slice(1)));
};

export const isUndefinedOrNullOrEmptyOrWhitespace = (value: unknown): value is string => !(value && typeof value === "string" && value.length > 0 && value.trim().length > 0);

// TODO: use library.
export const getRandomInt = (min?: number, max?: number): number => {
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

// TODO: use library and/or timers promise api.
// https://nodejs.org/api/timers.html#timers_timers_promises_api
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const debounce = <T extends (...args: V[]) => Promisable<U>, U, V = unknown>(fn: T, limit: number): (...limiterArgs: Parameters<T>) => void => {
	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeout: any | null = null;

	const limiter = (...limiterArgs: Parameters<T>): void => {
		clearTimeout(timeout);

		timeout = setTimeout(
			async () => {
				timeout = null;

				try {
					await fn(...limiterArgs);
				} catch (error: unknown) {
					// TODO: log/handle success/errors?
					throw error;
				}
			},
			limit,
		);
	};

	return limiter;
};

export const noopDummyFunction = <T = void,>(): T => undefined as unknown as T;
