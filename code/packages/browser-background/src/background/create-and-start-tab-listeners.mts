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
	loggedPromiseCallback,
	type PromiseFunction,
} from "@talkie/shared-application/promise-logging.mjs";
import type {
	ReadonlyDeep,
} from "type-fest";
import type {
	Tabs,
} from "webextension-polyfill";

import type TalkieBackground from "../talkie-background.mjs";

export interface TabChangeListeners {
	onTabRemovedListener: PromiseFunction<void>;
	onTabUpdatedListener: PromiseFunction<void>;
}

const createAndStartTabListeners = async (talkieBackground: ReadonlyDeep<TalkieBackground>): Promise<TabChangeListeners> => {
	// NOTE: cache listeners so they can be added and removed by reference before/after speaking.
	const onTabRemovedListener = loggedPromiseCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
		async (browserTabId: number, removeInfo: Readonly<Tabs.OnRemovedRemoveInfoType> | any) => talkieBackground.onTabRemovedHandler(browserTabId, removeInfo),
		"onRemoved",
	);
	const onTabUpdatedListener = loggedPromiseCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
		async (browserTabId: number, changeInfo: Readonly<Tabs.OnUpdatedChangeInfoType> | any) => talkieBackground.onTabUpdatedHandler(browserTabId, changeInfo),
		"onUpdated",
	);

	return {
		onTabRemovedListener,
		onTabUpdatedListener,
	};
};

export default createAndStartTabListeners;
