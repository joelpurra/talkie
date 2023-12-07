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
	IMessageBusEvent,
	MessageBusCallback,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

export default class SplitContextMessageBusEventProvider implements IMessageBusEvent {
	public readonly hasListeners: undefined = undefined;

	constructor(
		public readonly sameContextMessageBusEventProvider: IMessageBusEvent,
		public readonly otherContextsMessageBusEventProvider: IMessageBusEvent,
	) {}

	public addListener(callback: MessageBusCallback): void {
		this.sameContextMessageBusEventProvider.addListener(callback);
		this.otherContextsMessageBusEventProvider.addListener(callback);
	}

	public removeListener(callback: MessageBusCallback): void {
		this.sameContextMessageBusEventProvider.removeListener(callback);
		this.otherContextsMessageBusEventProvider.removeListener(callback);
	}

	public hasListener(callback: MessageBusCallback): boolean {
		return this.sameContextMessageBusEventProvider.hasListener(callback)
			&& this.otherContextsMessageBusEventProvider.hasListener(callback);
	}

	public _hasListeners(): boolean {
		return this.sameContextMessageBusEventProvider._hasListeners()
			|| this.otherContextsMessageBusEventProvider._hasListeners();
	}
}
