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
	OsType,
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type IApiCoatingMetadata from "@talkie/split-environment-interfaces/iapi/iapi-coating-metadata.mjs";

export default class BrowserCoatingMetadata implements IApiCoatingMetadata {
	constructor(
		private readonly metadataManager: IMetadataManager,
	) {}

	async getVersionName(): Promise<string | null> {
		return this.metadataManager.getVersionName();
	}

	async getVersionNumber(): Promise<string | null> {
		return this.metadataManager.getVersionNumber();
	}

	async getSystemType(): Promise<SystemType> {
		return this.metadataManager.getSystemType();
	}

	async getOperatingSystemType(): Promise<OsType> {
		return this.metadataManager.getOperatingSystemType();
	}
}
