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

import type IStorageProvider from "@talkie/split-environment-interfaces/istorage-provider.mjs";
import type {
	JsonValue,
} from "type-fest";

export default class WebExtensionEnvironmentStorageProvider implements IStorageProvider {
	async get<T extends JsonValue>(key: string): Promise<T | null> {
		const valueJson = window.localStorage.getItem(key);

		if (valueJson === null) {
			return null;
		}

		const value = JSON.parse(valueJson) as JsonValue;

		// TODO: validate and assert, or warn, remove generic type, or something.
		return value as unknown as T;
	}

	async set<T extends JsonValue>(key: string, value: T): Promise<void> {
		const valueJson = JSON.stringify(value);

		window.localStorage.setItem(key, valueJson);
	}
}
