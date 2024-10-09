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

import type {
	Promisable,
} from "type-fest";

import {
	atMostDefinedValues,
	isErrorInstanceWithName,
	singleDefinedValue,
} from "./basic.mjs";

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const promiseFunctionSeries = async <T,>(promiseFunctions: Readonly<Array<(state?: T) => Promisable<T>>>, state?: T): Promise<T> => {
	if (promiseFunctions.length === 0) {
		throw new TypeError("Empty promiseFunctions.");
	}

	const first = promiseFunctions[0];

	if (typeof first !== "function") {
		throw new TypeError("Not a function.");
	}

	const result = await first(state);

	if (promiseFunctions.length === 1) {
		return result;
	}

	const rest = promiseFunctions.slice(1);

	return promiseFunctionSeries(rest, result);
};

export class PromiseTimeout extends Error {
	constructor(public readonly limit: number) {
		super(`Timeout after ${limit} milliseconds.`);

		this.name = "PromiseTimeout";
	}
}

export function isPromiseTimeout(error: unknown): error is PromiseTimeout {
	return isErrorInstanceWithName(error, "PromiseTimeout");
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const promiseTimeout = async <T,>(promise: Readonly<Promise<T>>, milliseconds: number): Promise<T> => {
	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeoutId: any | null;

	// NOTE: using promise objects for the race.
	const timeoutPromise = new Promise<void>((resolve) => {
		timeoutId = setTimeout(
			() => {
				resolve();
			},
			milliseconds,
		);
	})
		.then(() => {
			const timeoutError = new PromiseTimeout(milliseconds);

			throw timeoutError;
		});

	try {
		return await Promise.race([
			promise,
			timeoutPromise,
		]);
	} finally {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(timeoutId);
	}
};

export const promiseDelay = async (milliseconds: number): Promise<void> =>
	new Promise<void>((resolve) => {
		// NOTE: the timeout id is automatically cleared when it ends.
		setTimeout(resolve, milliseconds);
	});

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const promiseSleep = async <T,>(fn: () => Promisable<T>, milliseconds: number): Promise<T> =>
	new Promise<T>((resolve, reject) => {
		// NOTE: the timeout id is automatically cleared when it ends.
		setTimeout(
			() => {
				try {
					resolve(fn());
				} catch (error: unknown) {
					reject(error);
				}
			},
			milliseconds,
		);
	});

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/comma-dangle
export const promiseAtMostDefinedValues = async <T,>(atMost: number, promises: Array<Promise<T | void>>): Promise<Array<T | void>> => {
	// TODO: async repeated Promise.race() until Promise<T | void> the first defined response, then (silently?) fail if there is a second (or more, but fail early) non-undefined responses?
	const elements = await Promise.all(promises);

	return atMostDefinedValues(atMost, elements);
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/comma-dangle
export const promiseSingleDefinedValue = async <T,>(promises: Array<Promise<T | void>>): Promise<T | void> => {
	// TODO: async repeated Promise.race() until Promise<T | void> the first defined response, then (silently?) fail if there is a second (or more, but fail early) non-undefined responses?
	const elements = await Promise.all(promises);

	return singleDefinedValue(elements);
};
