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

import type {
	Promisable,
} from "type-fest";

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
	return Boolean(error) && typeof error === "object" && error instanceof Error && error.name === "PromiseTimeout";
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const promiseTimeout = async <T,>(promise: Readonly<Promise<T>>, limit: number): Promise<T> => {
	// NOTE: using promise objects for the race.
	const timeoutPromise = new Promise<void>((resolve) => {
		setTimeout(
			() => {
				resolve();
			},
			limit,
		);
	})
		.then(() => {
			const timeoutError = new PromiseTimeout(limit);

			throw timeoutError;
		});

	return Promise.race([
		promise,
		timeoutPromise,
	]);
};

export const promiseDelay = async (sleep: number): Promise<void> =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, sleep);
	});

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const promiseSleep = async <T,>(fn: () => Promisable<T>, sleep: number): Promise<T> =>
	new Promise<T>((resolve, reject) => {
		setTimeout(
			() => {
				try {
					resolve(fn());
				} catch (error: unknown) {
					reject(error);
				}
			},
			sleep,
		);
	});

