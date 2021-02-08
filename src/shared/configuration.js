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
	promiseTry,
} from "./promise";

export default class Configuration {
	// NOTE: keep SynchronousConfiguration and Configuration in... sync.
	constructor(metadataManager, configurationObject) {
		this.metadataManager = metadataManager;
		this.configurationObject = configurationObject;

		this._initialize();
	}

	_initialize() {
		this.configurationObject.shared.urls.root = "/";
		this.configurationObject.shared.urls.demo = "/src/demo/demo.html";
		this.configurationObject.shared.urls.options = "/src/options/options.html";
		this.configurationObject.shared.urls.popup = "/src/popup/popup.html";

		// NOTE: direct links to individual tabs.
		this.configurationObject.shared.urls["demo-about"] = this.configurationObject.shared.urls.demo + "#about";
		this.configurationObject.shared.urls["demo-features"] = this.configurationObject.shared.urls.demo + "#features";
		this.configurationObject.shared.urls["demo-support"] = this.configurationObject.shared.urls.demo + "#support";
		this.configurationObject.shared.urls["demo-usage"] = this.configurationObject.shared.urls.demo + "#usage";
		this.configurationObject.shared.urls["demo-voices"] = this.configurationObject.shared.urls.demo + "#voices";
		this.configurationObject.shared.urls["demo-welcome"] = this.configurationObject.shared.urls.demo + "#welcome";

		// NOTE: direct links to individual tabs.
		// NOTE: need to pass a parameter to the options page.
		[
			"popup",
			"demo",
		].forEach((from) => {
			this.configurationObject.shared.urls[`options-from-${from}`] = this.configurationObject.shared.urls.options + `?from=${from}`;
			this.configurationObject.shared.urls[`options-about-from-${from}`] = this.configurationObject.shared.urls[`options-from-${from}`] + "#about";
			this.configurationObject.shared.urls[`options-upgrade-from-${from}`] = this.configurationObject.shared.urls[`options-from-${from}`] + "#upgrade";
		});

		this.configurationObject.shared.urls["popup-passclick-false"] = this.configurationObject.shared.urls.popup + "?passclick=false";
	}

	_resolvePath(object, path) {
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

		if (({}).hasOwnProperty.call(object, part)) {
			if (parts.length === 0) {
				return object[part];
			}

			return this._resolvePath(object[part], parts.join("."));
		}

		return null;
	}

	get(path) {
		return promiseTry(
			() => this.metadataManager.getSystemType()
				.then((systemType) =>
				/* eslint-disable no-sync */
					this.getSync(systemType, path),
					/* eslint-enable no-sync */
				),
		);
	}

	getSync(systemType, path) {
		const systemValue = this._resolvePath(this.configurationObject[systemType], path);
		const sharedValue = this._resolvePath(this.configurationObject.shared, path);

		const value = systemValue
						|| sharedValue
						|| null;

		return value;
	}
}
