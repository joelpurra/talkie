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

import type {
	JsonValue,
	Promisable,
} from "type-fest";

// TODO: use library?
export const jsonClone = <T extends Readonly<JsonValue>>(object: T): T => {
	const json = JSON.stringify(object);
	const restored: T = JSON.parse(json) as T;

	return restored;
};

// TODO: use library.
// eslint-disable-next-line @stylistic/comma-dangle
export const lastOrThrow = <T,>(indexable: readonly T[]): T => {
	if (indexable.length === 0) {
		throw new RangeError("Indexable length 0.");
	}

	const lastIndex = indexable.length - 1;

	if (!(lastIndex in indexable)) {
		throw new RangeError("Last index not valid.");
	}

	const lastValue = indexable[lastIndex];

	if (lastValue === undefined) {
		throw new RangeError("Last indexable value is undefined.");
	}

	return lastValue;
};

export const isUndefinedOrNullOrEmptyOrWhitespace = (value: unknown): value is string => !(value && typeof value === "string" && value.length > 0 && value.trim().length > 0);

export function isDefined<T>(response: T | void): response is T {
	return (response !== undefined);
}

// TODO: use library.
export const getRandomInt = (min?: number, max?: number): number => {
	if (min === undefined) {
		min = Number.MIN_VALUE;
		max = Number.MAX_VALUE;
	}

	if (max === undefined) {
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
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: V[]) => Promisable<U>, U, V = any>(fn: T, milliseconds: number): [(...limiterArgs: Parameters<T>) => void, () => void] => {
	if (milliseconds < 0) {
		throw new RangeError(`Need to wait at least a non-negative mount of time, but received ${milliseconds} milliseconds`);
	}

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let timeoutId: any | null = null;

	const limiter = (...limiterArgs: Parameters<T>): void => {
		// NOTE: clear the "previous" timeout id.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(timeoutId);

		// NOTE: the timeout id is automatically cleared when it ends.
		timeoutId = setTimeout(
			async () => {
				timeoutId = null;

				await fn(...limiterArgs);
			},
			milliseconds,
		);
	};

	// NOTE: delegate final cleanup to the caller.
	const cleanup: () => void = () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(timeoutId);
	};

	return [
		limiter,
		cleanup,
	];
};

// TODO: use library and/or timers promise api.
// https://nodejs.org/api/timers.html#timers_timers_promises_api
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-explicit-any
export const repeatAtMost = <T extends (...args: V[]) => Promisable<U>, U, V = any>(fn: T, milliseconds: number, maxRepeats: number): () => void => {
	if (milliseconds < 0) {
		throw new RangeError(`Need to wait at least a non-negative mount of time, but received ${milliseconds} milliseconds`);
	}

	if (maxRepeats <= 0) {
		throw new RangeError(`Need to repeat at least once, but received ${maxRepeats} repeats`);
	}

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let intervalId: any | null = null;
	let repeatsLeft = maxRepeats;

	const repeater = async (): Promise<void> => {
		await fn();

		repeatsLeft--;

		if (repeatsLeft === 0) {
			cancel();
		}
	};

	// NOTE: pass optional (early) stop/cancel function to the caller.
	const cancel: () => void = () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearInterval(intervalId);
	};

	// NOTE: using setInterval(repeater) to avoid recursively calling repeater(setTimeout(repeater)) and having to get tail-recursion just right -- if it's even possible.
	intervalId = setInterval(repeater, milliseconds);

	return cancel;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @stylistic/comma-dangle
export const atMostDefinedValues = <T,>(atMost: number, elements: Array<T | void>): Array<T | void> => {
	// TODO: allow array-like objects?
	if (!Array.isArray(elements)) {
		throw new TypeError("Not an array.");
	}

	const definedElements = elements.filter((value) => isDefined(value));

	if (definedElements.length > atMost) {
		throw new RangeError(`Can only accept at most ${atMost} element(s), but received ${definedElements.length}.`);
	}

	return definedElements;
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @stylistic/comma-dangle
export const singleDefinedValue = <T,>(elements: Array<T | void>): T => {
	// TODO: allow array-like objects?
	if (!Array.isArray(elements)) {
		throw new TypeError("Not an array.");
	}

	const definedElements = elements.filter((value) => isDefined(value));

	if (definedElements.length > 1) {
		throw new RangeError(`Can only accept a single element, but received ${definedElements.length}.`);
	}

	if (definedElements.length === 1) {
		const element = definedElements[0];

		if (element === undefined) {
			throw new TypeError("Array has one element, but it is undefined.");
		}

		return element;
	}

	throw new RangeError("Array is empty.");
};

export const isErrorInstanceWithName = (error: unknown, name: string): boolean =>
	typeof error === "object"
	&& error !== null
	&& error instanceof Error
	&& error.name === name;

export const errorMessageIncludes = (error: unknown, partialMessage: string): boolean =>
	typeof error === "object"
	&& error !== null
	&& "message" in error
	&& typeof error.message === "string"
	&& error.message.includes(partialMessage);
