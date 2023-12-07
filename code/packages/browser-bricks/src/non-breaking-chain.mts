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
} from "@talkie/shared-application-helpers/log.mjs";

import Chain from "./chain.mjs";

export default class NonBreakingChain extends Chain {
	override chainPromise: Promise<void> = Promise.resolve();
	override length = 0;

	override async link(promiseFn: () => Promise<void>): Promise<void> {
		this.length++;
		const currentLength = this.length;

		void logDebug("Start", "NonBreakingChain", currentLength);

		// NOTE: using promise objects for the chain.
		this.chainPromise = this.chainPromise
			.finally(async () => {
				try {
					await Promise.resolve(promiseFn());

					void logDebug("Done", "NonBreakingChain", currentLength);
				} catch (error: unknown) {
					// NOTE: swallow error to not break the chain.
					void logError("NonBreakingChain", "swallowing error", currentLength, error);
				}
			});

		return this.chainPromise;
	}
}
