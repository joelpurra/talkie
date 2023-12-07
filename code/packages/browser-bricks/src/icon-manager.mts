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
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import {
	type EditionType,
	type IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";

export type IconTypeName = "play" | "stop";

export default class IconManager {
	constructor(private readonly premiumManager: IPremiumManager) {}

	getIconModePaths(editionType: EditionType, name: IconTypeName): Readonly<Record<string, string>> {
		return {
			// NOTE: icons in use before Chrome 53 were 19x19 and 38x38.
			// NOTE: icons in use from Chrome 53 (switching to Material design) are 16x16 and 32x32.
			// NOTE: keeping larger icons to accommodate future changes.
			// NOTE: paths are relative to the background html page.
			16: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-16x16.png`,
			32: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-32x32.png`,
			48: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-48x48.png`,
			64: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-64x64.png`,

			// NOTE: passing the larger icons slowed down the UI by several hundred milliseconds per icon switch.
			// 128: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-128x128.png`,
			// 256: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-256x256.png`,
			// 512: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-512x512.png`,
			// 1024: `/packages/shared-resources/src/resources/icon/${editionType}/icon-${name}/icon-1024x1024.png`,
		};
	}

	async setIconMode(name: IconTypeName): Promise<void> {
		void logDebug("Start", "Changing icon to", name);

		const editionType = await this.premiumManager.getEditionType();

		const paths = this.getIconModePaths(editionType, name);
		const details = {
			path: paths,
		};

		await chrome.action.setIcon(details);

		void logDebug("Done", "Changing icon to", name);
	}

	async setIconModePlaying(): Promise<void> {
		await this.setIconMode("stop");
	}

	async setIconModeStopped(): Promise<void> {
		await this.setIconMode("play");
	}
}
