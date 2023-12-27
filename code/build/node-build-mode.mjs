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

import process from "node:process";

// TODO: reuse NODE_ENV code across both rollup and code files?
export const NODE_ENV_PRODUCTION = "production";
export const NODE_ENV_DEVELOPMENT = "development";

// NOTE: the default is production mode, because the external tools relying on NODE_ENV are not the focus of this project.
export const NODE_ENV_DEFAULT = NODE_ENV_PRODUCTION;

function isNodeEnv(input) {
	return [
		NODE_ENV_DEVELOPMENT,
		NODE_ENV_PRODUCTION,
	].includes(String(input));
}

function assertNodeEnv(input) {
	if (!isNodeEnv(input)) {
		// TODO: assertions.
		throw new TypeError(`Unknown NODE_ENV value: ${JSON.stringify(input)}`);
	}
}

const process_env_NODE_ENV = process.env.NODE_ENV;

if (typeof process_env_NODE_ENV === "string") {
	// NOTE: if a value is set, allow only known values.
	assertNodeEnv(process_env_NODE_ENV);
}

export const NODE_ENV = isNodeEnv(process_env_NODE_ENV)
	? process_env_NODE_ENV
	: NODE_ENV_DEFAULT;

export const isNodeDevelopmentMode = () => (NODE_ENV === NODE_ENV_DEVELOPMENT);
export const isNodeProductionMode = () => (NODE_ENV === NODE_ENV_PRODUCTION);
