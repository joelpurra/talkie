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

import IManifestProvider from "@talkie/split-environment-interfaces/imanifest-provider.mjs";
import jsonfile from "jsonfile";
import assert from "node:assert";
import path from "node:path";
import process from "node:process";
import {
	JsonObject,
} from "type-fest";
import type {
	Manifest,
} from "webextension-polyfill";

const MANIFEST_FILENAME = "manifest.json";

export default class NodeEnvironmentManifestProvider implements IManifestProvider {
	private _cachedManifest: Manifest.ManifestBase | null = null;

	async get(): Promise<Manifest.ManifestBase> {
		await this._ensureCacheIsLoaded();

		assert(this._cachedManifest);

		return this._cachedManifest;
	}

	private async _ensureCacheIsLoaded(): Promise<void> {
		if (this._cachedManifest === null) {
			// NOTE: relative to the cwd/pwd to get the system-specific manifest.json.
			const manifestPath = path.join(
				process.cwd(),
				MANIFEST_FILENAME,
			);

			const manifestJson = await jsonfile.readFile(manifestPath) as JsonObject;

			// NOTE: should work, based on the documentation.
			// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/runtime/getManifest
			// > Get the complete manifest.json file, deserialized from JSON to an object.
			// TODO: verify the JSON instead of casting.
			this._cachedManifest = manifestJson as unknown as Manifest.ManifestBase;
		}
	}
}
