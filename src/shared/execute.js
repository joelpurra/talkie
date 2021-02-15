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
} from "./log";
import {
	promiseTimeout,
} from "./promise";

export default class Execute {
	constructor(configuration) {
		this.configuration = configuration;
	}

	async scriptInTopFrame(code) {
		try {
			logDebug("Start", "scriptInTopFrame", code.length, code);

			const result = await browser.tabs.executeScript(
				{
					allFrames: false,
					code,
				},
			);
			logDebug("Done", "scriptInTopFrame", code.length);

			return result;
		} catch (error) {
			logInfo("scriptInTopFrame", code.length, "Error", error);

			throw error;
		}
	}

	async scriptInAllFrames(code) {
		try {
			logDebug("Start", "scriptInAllFrames", code.length, code);

			const result = await browser.tabs.executeScript(
				{
					allFrames: true,
					code,
				},
			);

			logDebug("Done", "scriptInAllFrames", code.length);

			return result;
		} catch (error) {
			logInfo("scriptInAllFrames", code.length, "Error", error);

			throw error;
		}
	}

	async scriptInTopFrameWithTimeout(code, timeout) {
		try {
			logDebug("Start", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

			const result = await promiseTimeout(
				this.scriptInTopFrame(code),
				timeout,
			);

			logDebug("Done", "scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds");

			return result;
		} catch (error) {
			logInfo("scriptInTopFrameWithTimeout", code.length, "code.length", timeout, "milliseconds", "Error", error);

			if (error && typeof error === "object" && error.name === "PromiseTimeout") {
				// NOTE: this is how to check for a timeout.
			}

			throw error;
		}
	}

	async scriptInAllFramesWithTimeout(code, timeout) {
		try {
			logDebug("Start", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

			const result = await promiseTimeout(
				this.scriptInAllFrames(code),
				timeout,
			);

			logDebug("Done", "scriptInAllFramesWithTimeout", code.length, "code.length", timeout, "milliseconds");

			return result;
		} catch (error) {
			if (error && typeof error === "object" && error.name === "PromiseTimeout") {
				// NOTE: this is how to check for a timeout.
			}

			throw error;
		}
	}
}
