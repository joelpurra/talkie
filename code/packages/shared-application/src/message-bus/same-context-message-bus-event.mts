/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

export default class SameContextMessageBusEvent implements IMessageBusEvent {
	// TODO: replace with a builtin Event<T> class?
	public readonly hasListeners: undefined = undefined;

	protected readonly _listeners = new Set<MessageBusCallback>();

	public addListener(callback: MessageBusCallback): void {
		if (this._listeners.has(callback)) {
			throw new Error("Listener was already registered.");
		}

		this._listeners.add(callback);
	}

	public removeListener(callback: MessageBusCallback): void {
		if (!this._listeners.has(callback)) {
			throw new Error("Listener was not registered.");
		}

		this._listeners.delete(callback);
	}

	public hasListener(callback: MessageBusCallback): boolean {
		return this._listeners.has(callback);
	}

	public _hasListeners(): boolean {
		return this._listeners.size > 0;
	}
}
