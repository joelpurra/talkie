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
} from "../shared/log";

export default class CommandHandler {
	constructor(commandMap) {
		this.commandMap = commandMap;
	}

	async handle(command, ...args) {
		logDebug("Start", "commandHandler", command);

		const commandAction = this.commandMap[command];

		if (typeof commandAction !== "function") {
			throw new TypeError("Bad command action for command: " + command);
		}

		try {
			const result = await commandAction(...args);

			logDebug("Done", "commandHandler", command, result);
		} catch (error) {
			logError("commandHandler", command, error);

			throw error;
		}
	}

	async handleCommandEvent(command, ...args) {
		logDebug("Start", "handleCommandEvent", command);

		try {
			// NOTE: straight mapping from command to action.
			const result = await this.handle(command, ...args);

			logDebug("Done", "handleCommandEvent", command, result);
		} catch (error) {
			logError("handleCommandEvent", command, error);

			throw error;
		}
	}
}
