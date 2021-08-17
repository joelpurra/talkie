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
	noopDummyFunction,
} from "@talkie/shared-application-helpers/basic";
import {
	logWarn,
} from "@talkie/shared-application-helpers/log";
import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider";
import {
	KillSwitch,
} from "@talkie/split-environment-interfaces/moved-here/killswitch";
import {
	knownEventNames,
} from "@talkie/split-environment-interfaces/moved-here/known-events";
import {
	ListeningActionHandler,
} from "@talkie/split-environment-interfaces/moved-here/listening-action-handler";

export default class NodeEnvironmentBroadcasterProvider implements IBroadcasterProvider {
	async broadcastEvent<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, actionData: TData): Promise<Array<TReturn | null>> {
		void logWarn("NodeEnvironmentBroadcasterProvider", "broadcastEvent", "ignored", actionName, actionData);

		// NOTE: empty array since no events listeners were called.
		return [];
	}

	async registerListeningAction<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, _listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		void logWarn("NodeEnvironmentBroadcasterProvider", "registerListeningAction", "ignored", actionName);

		// NOTE: returning a dummy killswitch.
		return noopDummyFunction;
	}
}
