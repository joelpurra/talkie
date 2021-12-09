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
	logWarn,
} from "@talkie/shared-application-helpers/log.mjs";
import IBroadcasterProvider from "@talkie/split-environment-interfaces/ibroadcaster-provider.mjs";
import {
	KillSwitch,
} from "@talkie/split-environment-interfaces/moved-here/killswitch.mjs";
import {
	knownEventNames,
} from "@talkie/split-environment-interfaces/moved-here/known-events.mjs";
import {
	ListeningActionHandler,
} from "@talkie/split-environment-interfaces/moved-here/listening-action-handler.mjs";

import {
	getTalkieServices,
} from "./browser-specific/tabs.mjs";

export default class WebExtensionEnvironmentBroadcasterProvider implements IBroadcasterProvider {
	async broadcastEvent<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, actionData: TData): Promise<Array<TReturn | null>> {
		void logWarn("NodeEnvironmentBroadcasterProvider", "broadcastEvent", "ignored", actionName, actionData);

		return [];
	}

	async registerListeningAction<TEvent extends knownEventNames, TData, TReturn>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch> {
		const talkieServices = await getTalkieServices();

		return talkieServices.broadcaster().registerListeningAction(actionName, listeningActionHandler);
	}
}
