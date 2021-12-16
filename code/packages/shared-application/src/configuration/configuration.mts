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
	jsonClone,
} from "@talkie/shared-application-helpers/basic.mjs";
import IConfiguration from "@talkie/shared-interfaces/iconfiguration.mjs";
import {
	IMetadataManager,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	JsonArray,
	JsonObject,
	JsonValue,
	PartialDeep,
	ReadonlyDeep,
} from "type-fest";

import {
	ConfigurationObject,
} from "../data/configuration/configuration.mjs";

export type DynamicConfigurationObject = {
	shared: {
		urls: {
			["options-about"]: string;
			["options-features"]: string;
			["options-support"]: string;
			["options-usage"]: string;
			["options-upgrade"]: string;
			["options-voices"]: string;
			["options-welcome"]: string;
			options: string;
			popup: string;
			root: string;
		};
	};
};

export default class Configuration implements IConfiguration {
	configurationObject: ReadonlyDeep<ConfigurationObject & DynamicConfigurationObject>;

	// NOTE: keep SynchronousConfiguration and Configuration in... sync.
	constructor(private readonly metadataManager: IMetadataManager, baseConfigurationObject: ReadonlyDeep<ConfigurationObject>) {
		const configurationObject: ConfigurationObject & PartialDeep<DynamicConfigurationObject> = jsonClone(baseConfigurationObject);

		// TODO: since these urls are no longer very dynamic (merely repetitive), replace with hardcoded values in configuration.json?
		configurationObject.shared.urls.root = "/";
		configurationObject.shared.urls.options = "/packages/options-renderer/src/options.html";
		configurationObject.shared.urls.popup = "/packages/popup-renderer/src/popup.html";

		// NOTE: direct links to individual tabs.
		configurationObject.shared.urls["options-about"] = configurationObject.shared.urls.options + "#about";
		configurationObject.shared.urls["options-features"] = configurationObject.shared.urls.options + "#features";
		configurationObject.shared.urls["options-support"] = configurationObject.shared.urls.options + "#support";
		configurationObject.shared.urls["options-upgrade"] = configurationObject.shared.urls.options + "#upgrade";
		configurationObject.shared.urls["options-usage"] = configurationObject.shared.urls.options + "#usage";
		configurationObject.shared.urls["options-voices"] = configurationObject.shared.urls.options + "#voices";
		configurationObject.shared.urls["options-welcome"] = configurationObject.shared.urls.options + "#welcome";

		this.configurationObject = configurationObject as ConfigurationObject & ReadonlyDeep<DynamicConfigurationObject>;
	}

	private static _resolvePath<T extends JsonValue, D extends JsonObject>(object: Readonly<D>, path: string): Readonly<T> | Readonly<JsonObject> | Readonly<JsonArray> | string | number | boolean | null {
		// TODO: use a library, like lodash.get().
		// NOTE: doesn't handle arrays nor properties of "any" non-object objects.
		if (!object || typeof object !== "object") {
			throw new Error(`Unable to handle non-object object: ${typeof object} ${JSON.stringify(object)}`);
		}

		if (!path || typeof path !== "string" || path.length === 0) {
			throw new Error(`Unable to handle non-string path: ${typeof path} ${JSON.stringify(path)}`);
		}

		// NOTE: doesn't handle path["subpath"].
		const parts = path.split(".");
		const part = parts.shift();

		if (typeof part === "undefined") {
			return null;
		}

		if (part in object) {
			const value = object[part];

			if (typeof value !== "undefined" && (Object.prototype).hasOwnProperty.call(object, part)) {
				if (parts.length === 0) {
					return value as JsonValue;
				}

				// NOTE: cast to any to let the recursive call handle type errors.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return this._resolvePath(value as any, parts.join("."));
			}
		}

		return null;
	}

	async get<T>(path: string): Promise<T> {
		const systemType = await this.metadataManager.getSystemType();

		// eslint-disable-next-line no-sync
		return this.getSync<T>(systemType, path);
	}

	getSync<T extends JsonValue>(systemType: SystemType, path: string): T {
		const systemValue = Configuration._resolvePath(this.configurationObject[systemType], path);
		const sharedValue = Configuration._resolvePath(this.configurationObject.shared, path);

		const value = systemValue
						?? sharedValue
						?? null;

		// TODO: verify type at runtime.
		return value as unknown as T;
	}
}
