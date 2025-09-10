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
	JsonObject,
	JsonValue,
} from "type-fest";

export type IStorageProviderConstructor = new() => IStorageProvider;

export default interface IStorageProvider {
	clear(): Promise<void>;
	count(): Promise<number>;
	get<T extends JsonValue>(key: string): Promise<T | null>;
	getAll<T extends JsonObject>(): Promise<T>;
	has(key: string): Promise<boolean>;
	isEmpty(): Promise<boolean>;
	remove(key: string): Promise<void>;
	set<T extends JsonValue>(key: string, value: T): Promise<void>;
	setAll<T extends JsonObject>(object: T): Promise<void>;
}
