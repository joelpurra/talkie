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

/// <ref types="dom" />

import type IStyletronProvider from "@talkie/split-environment-interfaces/istyletron-provider.mjs";
import type {
	StandardEngine,
} from "styletron-standard";

import {
	Client as StyletronClient,
} from "styletron-engine-atomic";

export default class WebExtensionEnvironmentStyletronProvider implements IStyletronProvider {
	private _instance: StyletronClient | null = null;

	getInstanceSync(): StandardEngine {
		if (this._instance === null) {
			const styleElements = document.querySelectorAll<HTMLStyleElement>("._styletron_hydrate_");
			const clientOptions: ConstructorParameters<typeof StyletronClient>[0] = {
				hydrate: styleElements,
			};
			this._instance = new StyletronClient(clientOptions);
		}

		return this._instance;
	}
}
