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
	logError,
	LoggerFunction,
	LoggerFunctionName,
	logInfo,
	logTrace,
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	getTalkieServices,
} from "@talkie/split-environment-webextension/browser-specific/tabs.mjs";

export default class DualLogger {
	dualLogTrace: LoggerFunction;
	dualLogDebug: LoggerFunction;
	dualLogInfo: LoggerFunction;
	dualLogWarn: LoggerFunction;
	dualLogError: LoggerFunction;

	constructor(private readonly localScriptName: string) {
		this.dualLogTrace = this._generateLogger(logTrace, "logTrace");
		this.dualLogDebug = this._generateLogger(logDebug, "logDebug");
		this.dualLogInfo = this._generateLogger(logInfo, "logInfo");
		this.dualLogWarn = this._generateLogger(logWarn, "logWarn");
		this.dualLogError = this._generateLogger(logError, "logError");
	}

	private _generateLogger(localLoggerFunctionName: LoggerFunction, backgroundLoggerFunctionName: LoggerFunctionName): LoggerFunction {
		const logInTalkieServices: LoggerFunction = async (...args: Readonly<unknown[]>) => {
			const talkieServices = await getTalkieServices();

			try {
				talkieServices[backgroundLoggerFunctionName](this.localScriptName, ...args);
			} catch (error: unknown) {
				void logError(this.localScriptName, "talkieServicesLoggerFunctionName", "Error logging to talkieServices page", "Swallowing error", error, "arguments", ...args);
			}
		};

		const logger: LoggerFunction = async (...args: Readonly<unknown[]>) => {
			await Promise.all([
				localLoggerFunctionName(this.localScriptName, ...args),
				logInTalkieServices(...args),
			]);
		};

		return logger;
	}
}
