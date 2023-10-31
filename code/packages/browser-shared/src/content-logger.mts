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
	logInfo,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	JsonValue,
} from "type-fest";

import type Execute from "./execute.mjs";

export default class ContentLogger {
	constructor(private readonly execute: Execute) {}

	private get executeLogToPageCode() {
		return "(function(){ try { console.log(%a); } catch (error) { console.error('Talkie', 'logToPage', error); } }());";
	}

	private get executeLogToPageWithColorCode() {
		return "(function(){ try { console.log(%a); } catch (error) { console.error('Talkie', 'logToPageWithColor', error); } }());";
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async logToPage(...args: Readonly<JsonValue[]>): Promise<void> {
		const now = new Date().toISOString();

		const logValues = [
			now,
			// TODO: configuration.
			"Talkie",
			...args,
		]
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			.map((arg) => JSON.stringify(arg))
			.join(", ");

		const code = this.executeLogToPageCode.replace("%a", logValues);

		try {
			await this.execute.scriptInTopFrame(code);
		} catch (error: unknown) {
			// NOTE: reduced log level for known tab/page access problems.
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			if (error && typeof error === "object" && typeof (error as Error).message === "string" && (error as Error).message.startsWith("Cannot access")) {
				void logInfo("logToPage", "Error", typeof error, JSON.stringify(error), error, ...args);
			} else {
				void logWarn("logToPage", "Error", typeof error, JSON.stringify(error), error, ...args);
			}

			throw error;
		}
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	async logToPageWithColor(...args: Readonly<JsonValue[]>): Promise<void> {
		const now = new Date().toISOString();

		// NOTE: create one long console.log() string argument, then add the color argument second.
		const logValuesArrayAsString = [
			now,
			// TODO: configuration.
			"Talkie",
			"%c",
			...args,
		]
			.join(" ");

		const logValues = JSON.stringify(logValuesArrayAsString)
					+ ", "
					+ JSON.stringify("background: #007F41; color: #FFFFFF; padding: 0.3em;");

		const code = this.executeLogToPageWithColorCode.replace("%a", logValues);

		try {
			await this.execute.scriptInTopFrame(code);
		} catch (error: unknown) {
			// NOTE: reduced logging for known tab/page access problems.
			// NOTE: the error object is not (always?) instanceof Error, possibly because of serialization.
			if (error && typeof error === "object" && typeof (error as Error).message === "string" && (error as Error).message.startsWith("Cannot access")) {
				void logInfo("logToPageWithColor", typeof error, JSON.stringify(error), error, ...args);
			} else {
				void logWarn("logToPageWithColor", typeof error, JSON.stringify(error), error, ...args);
			}

			throw error;
		}
	}
}
