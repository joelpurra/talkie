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
	IMetadataManager,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type IDynamicEnvironmentProvider from "@talkie/split-environment-interfaces/idynamic-environment-provider.mjs";
import type IManifestProvider from "@talkie/split-environment-interfaces/imanifest-provider.mjs";
import type {
	Manifest,
	Runtime,
} from "webextension-polyfill";

export default class MetadataManager implements IMetadataManager {
	constructor(private readonly manifestProvider: IManifestProvider, private readonly dynamicEnvironmentProvider: IDynamicEnvironmentProvider) {}

	private get _systemTypeChrome() {
		return "chrome" as SystemType;
	}

	private get _systemTypeWebExtension() {
		return "webextension" as SystemType;
	}

	// NOTE: string matches manifest.json value set during build in package.json.
	private get chromeVersionNameSubstring() {
		return " Chrome Extension ";
	}

	// NOTE: string matches manifest.json value set during build in package.json.
	private get webextensionVersionNameSubstring() {
		return " WebExtension ";
	}

	async getManifest(): Promise<Manifest.ManifestBase> {
		return this.manifestProvider.get();
	}

	async getVersionNumber(): Promise<string> {
		const manifest = await this.getManifest();

		return manifest.version;
	}

	async getVersionName(): Promise<string> {
		const manifest = await this.getManifest();
		const versionName = manifest.version_name;

		if (typeof versionName !== "string" || versionName.length === 0) {
			throw new Error(`Invalid version name: ${typeof versionName} ${JSON.stringify(versionName)}`);
		}

		return versionName;
	}

	async isChromeVersion(): Promise<boolean> {
		const versionName = await this.getVersionName();

		if (versionName.includes(this.chromeVersionNameSubstring)) {
			return true;
		}

		return false;
	}

	async isWebExtensionVersion(): Promise<boolean> {
		const versionName = await this.getVersionName();

		if (versionName.includes(this.webextensionVersionNameSubstring)) {
			return true;
		}

		return false;
	}

	async getSystemType(): Promise<SystemType> {
		const [
			isChrome,
			isWebExtension,
		] = await Promise.all([
			this.isChromeVersion(),
			this.isWebExtensionVersion(),
		]);

		if (isChrome) {
			return this._systemTypeChrome;
		}

		if (isWebExtension) {
			return this._systemTypeWebExtension;
		}

		throw new Error(await this.getVersionName());
	}

	async getOperatingSystemType(): Promise<Runtime.PlatformOs> {
		return this.dynamicEnvironmentProvider.getOperatingSystemType();
	}
}
