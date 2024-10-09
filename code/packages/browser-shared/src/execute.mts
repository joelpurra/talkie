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
	jsonClone,
	singleDefinedValue,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	logDebug,
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	promiseTimeout,
} from "@talkie/shared-application-helpers/promise.mjs";
import type {
	JsonValue,
} from "type-fest";
import type {
	Scripting,
} from "webextension-polyfill";

export interface FrameResult<T> {
	error?: unknown;
	frameId: number;
	result?: T;
}

export default class Execute {
	async scriptInTopFrame<T>(tabId: number, fn: () => T): Promise<FrameResult<T>> {
		const result = await this._executeScript(false, tabId, fn);

		return singleDefinedValue(result);
	}

	async scriptInAllFrames<T>(tabId: number, fn: () => T): Promise<Array<FrameResult<T>>> {
		return this._executeScript(true, tabId, fn);
	}

	async scriptInTopFrameWithTimeout<T>(tabId: number, fn: () => T, timeout: number): Promise<FrameResult<T>> {
		const result = await promiseTimeout(this._executeScript(false, tabId, fn), timeout);

		return singleDefinedValue(result);
	}

	async scriptInAllFramesWithTimeout<T>(tabId: number, fn: () => T, timeout: number): Promise<Array<FrameResult<T>>> {
		return promiseTimeout(this._executeScript(true, tabId, fn), timeout);
	}

	private async _executeScript<T>(allFrames: boolean, tabId: number, fn: () => T): Promise<Array<FrameResult<T>>> {
		// TODO: merge shared executeScript functionality to an internal function.
		try {
			void logDebug("Start", "_executeScript", allFrames, fn.name, fn);

			const injectionResults: Scripting.InjectionResult[] = await chrome.scripting.executeScript(
				{
					func: fn,
					target: {
						allFrames,
						tabId,
					},
				},
			);

			void logDebug("Done", "_executeScript", allFrames, fn.name, injectionResults.length);

			// NOTE: the results may include either per-frame result or error.
			const results: Array<FrameResult<T>> = injectionResults.map((rawInjectionResult: Readonly<Scripting.InjectionResult>): FrameResult<T> => {
				const clonedInjectionResult: Readonly<Scripting.InjectionResult> = jsonClone(rawInjectionResult as JsonValue) as Readonly<Scripting.InjectionResult>;

				return {
					error: clonedInjectionResult.error,
					frameId: clonedInjectionResult.frameId,
					result: clonedInjectionResult.result === undefined ? undefined : clonedInjectionResult.result as T,
				};
			});

			return results;
		} catch (error: unknown) {
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			void logInfo("_executeScript", allFrames, fn.name, "Error", typeof error, JSON.stringify(error), error);

			throw error;
		}
	}
}
