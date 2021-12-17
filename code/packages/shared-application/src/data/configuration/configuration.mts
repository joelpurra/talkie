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

// @ts-expect-error: File is not a module.ts(2306)
import configurationJson from "./configuration.cjs";

// NOTE: manually mapped from JSON.
// TODO: skip JSON file, just put data here?
export type ConfigurationObject = {
	"shared": {
		"urls": {
			"cla": string;
			"github": string;
			"gpl": string;
			"main": string;
			"project": string;
			"shortcut-keys": string;
			"support-feedback": string;
			"chromewebstore": string;
			"firefox-amo": string;
			"primary-payment": string;
			"alternative-payment": string;
		};
	};
	"chrome": {
		"urls": {
			"rate": string;
			"support-feedback": string;
		};
	};
	"webextension": {
		"urls": {
			"rate": string;
		};
	};
};

export default configurationJson as Readonly<ConfigurationObject>;
