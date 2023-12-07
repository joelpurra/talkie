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
	isTalkieDevelopmentMode,
} from "./talkie-build-mode.mjs";

export enum LoggingLevelFunctionMap {
	"TRAC" = "log",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	"DEBG" = "log",
	"INFO" = "info",
	"WARN" = "warn",
	"ERRO" = "error",
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	"ALWA" = "log",
}

export type LoggingLevelName = keyof typeof LoggingLevelFunctionMap | "NONE";
export type LoggingLevel = number | LoggingLevelName | Lowercase<LoggingLevelName>;

export type LoggerFunctionName =
| "logTrace"
| "logDebug"
| "logInfo"
| "logWarn"
| "logError";

export type LoggerFunction = (...args: Readonly<unknown[]>) => Promise<void>;

// TODO: configuration.
const extensionShortName = "Talkie";

// NOTE: 0, 1, ...
const loggingLevels: LoggingLevelName[] = [
	"TRAC",
	"DEBG",
	"INFO",
	"WARN",
	"ERRO",

	// NOTE: should "always" be logged, presumably for technical reasons.
	"ALWA",

	// NOTE: turns off logging output.
	"NONE",
];

export const isLevelName = (input: unknown): input is LoggingLevelName => {
	if (typeof input !== "string") {
		return false;
	}

	const normalizedLevelName: LoggingLevelName = input.toUpperCase() as Uppercase<LoggingLevelName>;

	const levelIndex = loggingLevels.indexOf(normalizedLevelName);

	return (typeof levelIndex === "number" && Math.floor(levelIndex) === Math.ceil(levelIndex) && levelIndex >= 0 && levelIndex < loggingLevels.length);
};

export const assertLevelName = (input: unknown): asserts input is LoggingLevelName => {
	if (!isLevelName(input)) {
		throw new TypeError("input");
	}
};

const parseLevelName = (nextLevelName: LoggingLevelName | Lowercase<LoggingLevelName>): number => {
	if (typeof nextLevelName !== "string") {
		throw new TypeError("nextLevelName");
	}

	const normalizedLevelName: LoggingLevelName = nextLevelName.toUpperCase() as Uppercase<LoggingLevelName>;

	const levelIndex = loggingLevels.indexOf(normalizedLevelName);

	if (typeof levelIndex === "number" && Math.floor(levelIndex) === Math.ceil(levelIndex) && levelIndex >= 0 && levelIndex < loggingLevels.length) {
		return levelIndex;
	}

	throw new TypeError(`nextLevelName ${typeof nextLevelName} ${JSON.stringify(nextLevelName)}`);
};

export function isLevel(input: unknown): input is LoggingLevel {
	if (typeof input === "number") {
		return (Math.floor(input) === Math.ceil(input) && input >= 0 && input < loggingLevels.length);
	}

	if (typeof input === "string") {
		return isLevelName(input);
	}

	return false;
}

export function assertLevel(input: unknown): asserts input is LoggingLevel {
	if (!isLevel(input)) {
		throw new TypeError("input");
	}
}

const parseLevel = (nextLevel: LoggingLevel): number => {
	if (typeof nextLevel === "number") {
		if (Math.floor(nextLevel) === Math.ceil(nextLevel) && nextLevel >= 0 && nextLevel < loggingLevels.length) {
			return nextLevel;
		}
	} else if (typeof nextLevel === "string") {
		const levelIndex = parseLevelName(nextLevel);

		return levelIndex;
	}

	throw new TypeError(`nextLevel ${typeof nextLevel} ${JSON.stringify(nextLevel)}`);
};

// NOTE: default logging level differs for developers in development mode, and public/published usage.
let currentLevelIndex = isTalkieDevelopmentMode()
	? parseLevel("DEBG")
	: parseLevel("WARN");

export const setLevel = (nextLevel: LoggingLevel): void => {
	currentLevelIndex = parseLevel(nextLevel);
};

// NOTE: allows switching logging to strings only, to allow terminal output logging (where only one string argument is shown).
let stringOnlyOutput = false;

export const setStringOnlyOutput = (stringOnly: boolean): void => {
	stringOnlyOutput = stringOnly;
};

const generateLogger = (loggingLevelName: LoggingLevelName): LoggerFunction => {
	if (loggingLevelName === "NONE") {
		throw new Error(`Logging level disallowed: ${JSON.stringify(loggingLevelName)}`);
	}

	const consoleFunctionName = LoggingLevelFunctionMap[loggingLevelName];
	const functionLevelIndex = parseLevel(loggingLevelName);

	const logger: LoggerFunction = async (...args) => {
		if (functionLevelIndex < currentLevelIndex) {
			return;
		}

		const now = new Date().toISOString();

		let loggingArgs = [
			loggingLevels[functionLevelIndex],
			now,
			extensionShortName,
			...args,
		];

		if (stringOnlyOutput) {
			// NOTE: for chrome command line console debugging.
			// NOTE: has to be an array.
			loggingArgs = [
				JSON.stringify(loggingArgs),
			];
		}

		// eslint-disable-next-line no-console
		console[consoleFunctionName](...loggingArgs);
	};

	return logger;
};

// TODO: write file as a (static) class?
export const logTrace = generateLogger("TRAC");
export const logDebug = generateLogger("DEBG");
export const logInfo = generateLogger("INFO");
export const logWarn = generateLogger("WARN");
export const logError = generateLogger("ERRO");
export const logAlways = generateLogger("ALWA");
