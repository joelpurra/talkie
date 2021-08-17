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
	Promisable,
	ReadonlyDeep,
} from "type-fest";

import DualLogger from "./dual-log";

const dualLogger = new DualLogger("shared-frontend.js");

const reflow = async () => {
	document.body.style.marginBottom = "0";
};

export type EventHandler<T extends Event> = (event: ReadonlyDeep<T>) => Promisable<void>;

export const eventToPromise = async <T extends Event>(eventHandler: EventHandler<T>, event: ReadonlyDeep<T>): Promise<void> => {
	try {
		void dualLogger.dualLogDebug("Start", "eventToPromise", event.type, event);

		await eventHandler(event);
		void dualLogger.dualLogDebug("Done", "eventToPromise", event.type, event);
	} catch (error: unknown) {
		void dualLogger.dualLogError("eventToPromise", event.type, event, error);
	}
};

const focusFirstLink = async (): Promise<void> => {
	const links = document.querySelectorAll("a");

	if (links.length > 0) {
		const firstLinkElement = links[0];

		if (firstLinkElement) {
			firstLinkElement.focus();
		}
	}
};

export const startReactFrontend = async (): Promise<void[]> => Promise.all([
	focusFirstLink(),
	reflow(),
]);

export const stopReactFrontend = async (): Promise<void> => {
	// TODO: unregister listeners.
};
