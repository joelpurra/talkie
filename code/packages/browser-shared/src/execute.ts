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
	logDebug,
	logInfo,
} from "@talkie/shared-application-helpers/log";
import {
	isPromiseTimeout,
	promiseTimeout,
} from "@talkie/shared-application-helpers/promise";

export default class Execute {
	async scriptInTopFrame<T>(code: string): Promise<T[]> {
		try {
			void logDebug("Start", "scriptInTopFrame", code.length, code);

			const result: T[] = await browser.tabs.executeScript(
				{
					allFrames: false,
					code,
				},
			) as T[];

			void logDebug("Done", "scriptInTopFrame", code.length);

			return result;
		} catch (error: unknown) {
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			void logInfo("scriptInTopFrame", code.length, "Error", typeof error, JSON.stringify(error), error);

			throw error;
		}
	}

	async scriptInAllFrames<T>(code: string): Promise<T[]> {
		try {
			void logDebug("Start", "scriptInAllFrames", code.length, code);

			const result: T[] = await browser.tabs.executeScript(
				{
					allFrames: true,
					code,
				},
			) as T[];

			void logDebug("Done", "scriptInAllFrames", code.length);

			return result;
		} catch (error: unknown) {
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			void logInfo("scriptInAllFrames", code.length, "Error", typeof error, JSON.stringify(error), error);

			throw error;
		}
	}

	async scriptInTopFrameWithTimeout<T>(code: string, timeout: number): Promise<T[]> {
		try {
			void logDebug("Start", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

			const result = await promiseTimeout(this.scriptInTopFrame<T>(code), timeout);

			void logDebug("Done", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

			return result;
		} catch (error: unknown) {
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			void logInfo("scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds", "Error", typeof error, JSON.stringify(error), error);

			if (isPromiseTimeout(error)) {
				// NOTE: ignore timeout errors, they are only logged.
			}

			throw error;
		}
	}

	async scriptInAllFramesWithTimeout<T>(code: string, timeout: number): Promise<T[]> {
		try {
			void logDebug("Start", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

			const result = await promiseTimeout(this.scriptInAllFrames<T>(code), timeout);

			void logDebug("Done", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

			return result;
		} catch (error: unknown) {
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			void logInfo("scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds", "Error", typeof error, JSON.stringify(error), error);

			if (isPromiseTimeout(error)) {
				// NOTE: ignore timeout errors, they are only logged.
			}

			throw error;
		}
	}
}
