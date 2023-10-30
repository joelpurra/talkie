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
	type KillSwitch,
} from "@talkie/shared-interfaces/killswitch.mjs";
import {
	type knownEventNames,
} from "@talkie/shared-interfaces/known-events.mjs";
import {
	type ListeningActionHandler,
} from "@talkie/shared-interfaces/listening-action-handler.mjs";
import {
	type JsonValue,
} from "type-fest";

export type IBroadcasterProviderConstructor = new() => IBroadcasterProvider;

export default interface IBroadcasterProvider {
	broadcastEvent<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, actionData: TData): Promise<Array<TReturn | null>>;

	registerListeningAction<TEvent extends knownEventNames, TData extends JsonValue, TReturn extends JsonValue | void>(actionName: TEvent, listeningActionHandler: ListeningActionHandler<TEvent, TData, TReturn>): Promise<KillSwitch>;
}
