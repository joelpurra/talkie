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

import type {
	UninitializerCallback,
} from "@talkie/shared-interfaces/uninitializer.mjs";

import {
	logError,
} from "./log.mjs";

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const executeUninitializers = async (uninitializers: UninitializerCallback[]): Promise<void> => {
	// NOTE: pop array items to also unreference the underlying objects.
	for (let uninitializer = uninitializers.pop(); uninitializers.length > 0; uninitializer = uninitializers.pop()) {
		try {
			if (typeof uninitializer === "function") {
				// NOTE: asynchronous cleanup, which may or may not finish in time during context/page unloads.
				// eslint-disable-next-line no-await-in-loop
				await uninitializer();
			} else {
				void logError("executeUninitializers", "Expected function, received:", typeof uninitializer);
			}
		} catch (error: unknown) {
			void logError("executeUninitializers", "swallowing error", error);
		}
	}
};

export const registerUninitializerHandlerSynchronously = (): UninitializerCallback[] => {
	const uninitializers: UninitializerCallback[] = [];

	globalThis.addEventListener("beforeunload", async () => executeUninitializers(uninitializers));

	return uninitializers;
};
