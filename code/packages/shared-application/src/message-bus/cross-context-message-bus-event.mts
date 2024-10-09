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

import {
	logInfo,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	IMessageBusEvent,
	MessageBusCallback,
} from "@talkie/split-environment-interfaces/imessage-bus-provider.mjs";

import {
	isDeadWrapper,
} from "../utils/is-dead-wrapper.mjs";

export default class CrossContextMessageBusEvent implements IMessageBusEvent {
	public readonly hasListeners: undefined = undefined;

	protected readonly _listeners = new Set<MessageBusCallback>();

	public addListener(callback: MessageBusCallback): void {
		if (this._listeners.has(callback)) {
			throw new Error("Listener was already registered.");
		}

		this._listeners.add(callback);

		this._pruneDeadListeners();
	}

	public removeListener(callback: MessageBusCallback): void {
		if (!this._listeners.has(callback)) {
			throw new Error("Listener was not registered.");
		}

		this._listeners.delete(callback);

		this._pruneDeadListeners();
	}

	public hasListener(callback: MessageBusCallback): boolean {
		const hasListener = this._listeners.has(callback);

		this._pruneDeadListeners();

		return hasListener;
	}

	public _hasListeners(): boolean {
		this._pruneDeadListeners();

		return this._listeners.size > 0;
	}

	protected _pruneDeadListeners(): void {
		const countBefore = this._listeners.size;

		for (const callback of this._listeners.keys()) {
			if (isDeadWrapper(callback)) {
				this._listeners.delete(callback);
			}
		}

		const countAfter = this._listeners.size;
		const countDiff = countAfter - countBefore;

		if (countDiff !== 0) {
			void logInfo(`Pruned ${Math.abs(countDiff)} dead callbacks from listeners.`);
		}
	}
}
