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

export const promiseSeries = async (promiseFunctions, state) => {
	if (promiseFunctions.length === 0) {
		return undefined;
	}

	const first = promiseFunctions[0];
	const result = await first(state);

	if (promiseFunctions.length === 1) {
		return result;
	}

	const rest = promiseFunctions.slice(1);

	return promiseSeries(rest, result);
};

export const promiseTimeout = (promise, limit) => {
	let timeoutId = null;

	// NOTE: using promise objects for the race.
	const timeoutPromise = new Promise((resolve) => {
		timeoutId = setTimeout(() => resolve(), limit);
	})
		.then(() => {
			timeoutId = null;

			const timeoutError = new Error(`Timeout after ${limit} milliseconds.`);
			timeoutError.name = "PromiseTimeout";

			throw timeoutError;
		});

	const originalPromise = promise
		.then((result) => {
			// NOTE: timeout has already happened.
			if (timeoutId === null) {
				return undefined;
			}

			// NOTE: timeout has not yet happened.
			clearTimeout(timeoutId);
			timeoutId = null;

			return result;
		})
		.catch((error) => {
			// NOTE: timeout has already happened.
			if (timeoutId === null) {
				return undefined;
			}

			// NOTE: timeout has not yet happened.
			clearTimeout(timeoutId);
			timeoutId = null;

			throw error;
		});

	return Promise.race([
		originalPromise,
		timeoutPromise,
	]);
};

export const promiseSleep = (fn, sleep) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(fn());
			} catch (error) {
				reject(error);
			}
		}, sleep);
	});
};
