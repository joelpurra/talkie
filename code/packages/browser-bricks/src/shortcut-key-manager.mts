/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type CommandHandler from "./command-handler.mjs";

import {
	logDebug,
	logError,
} from "@talkie/shared-application-helpers/log.mjs";

export default class ShortcutKeyManager {
	constructor(private readonly commandHandler: CommandHandler) {}

	async handler(command: string): Promise<void> {
		void logDebug("Start", "handler", command);

		try {
			// NOTE: straight mapping from command to action.
			await this.commandHandler.handle(command);

			void logDebug("Done", "handler", command);
		} catch (error: unknown) {
			void logError("handler", command, error);

			throw error;
		}
	}
}
