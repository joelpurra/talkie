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
} from "./log";
import {
	promiseTry,
} from "./promise";

export default class ContentLogger {
	constructor(execute, configuration) {
		this.execute = execute;
		this.configuration = configuration;

		this.executeLogToPageCode = "(function(){ try { console.log(%a); } catch (error) { console.error('Talkie', 'logToPage', error); } }());";
		this.executeLogToPageWithColorCode = "(function(){ try { console.log(%a); } catch (error) { console.error('Talkie', 'logToPageWithColor', error); } }());";
	}

	logToPage(...args) {
		return promiseTry(
			() => {
				const now = new Date().toISOString();

				const logValues = [
					now,
					// TODO: configuration.
					"Talkie",
					...args,
				]
					.map((arg) => JSON.stringify(arg))
					.join(", ");

				const code = this.executeLogToPageCode.replace("%a", logValues);

				return this.execute.scriptInTopFrame(code)
					.catch((error) => {
						// NOTE: reduced logging for known tab/page access problems.
						if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
							logInfo("this.execute.logToPage", "Error", error, ...args);
						} else {
							logWarn("this.execute.logToPage", "Error", error, ...args);
						}

						throw error;
					});
			},
		);
	}

	logToPageWithColor(...args) {
		return promiseTry(
			() => {
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

				return this.execute.scriptInTopFrame(code)
					.catch((error) => {
						// NOTE: reduced logging for known tab/page access problems.
						if (error && typeof error.message === "string" && error.message.startsWith("Cannot access")) {
							logInfo("this.execute.logToPageWithColor", ...args);
						} else {
							logWarn("this.execute.logToPageWithColor", ...args);
						}

						throw error;
					});
			},
		);
	}
}
