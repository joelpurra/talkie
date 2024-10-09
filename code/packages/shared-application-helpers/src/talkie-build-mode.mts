/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

// NOTE: this is shared code; do not import from "node:*" to avoid rollup (browser-related) warnings (and bloat?) even after constant process.env values have been replaced..
//import process from "node:process";

// TODO: reuse TALKIE_ENV code across both rollup and code files?
export const TALKIE_ENV_PRODUCTION = "production";
export const TALKIE_ENV_DEVELOPMENT = "development";

// NOTE: the default is development mode, since developers are more likely to repeatedly build the project.
export const TALKIE_ENV_DEFAULT = TALKIE_ENV_DEVELOPMENT;

export type KnownTalkieEnvValues = typeof TALKIE_ENV_DEVELOPMENT | typeof TALKIE_ENV_PRODUCTION;

function isTalkieEnv(input: string | undefined): input is KnownTalkieEnvValues {
	return [
		TALKIE_ENV_DEVELOPMENT,
		TALKIE_ENV_PRODUCTION,
	].includes(String(input));
}

function assertTalkieEnv(input: string | undefined): asserts input is KnownTalkieEnvValues {
	if (!isTalkieEnv(input)) {
		// TODO: assertions.
		throw new TypeError(`Unknown TALKIE_ENV value: ${JSON.stringify(input)}`);
	}
}

// eslint-disable-next-line n/prefer-global/process
const process_env_TALKIE_ENV = process.env.TALKIE_ENV;

if (typeof process_env_TALKIE_ENV === "string") {
	// NOTE: if a value is set, allow only known values.
	assertTalkieEnv(process_env_TALKIE_ENV);
}

export const TALKIE_ENV: KnownTalkieEnvValues = isTalkieEnv(process_env_TALKIE_ENV)
	? process_env_TALKIE_ENV
	: TALKIE_ENV_DEFAULT;

export const isTalkieDevelopmentMode = (): boolean => (TALKIE_ENV === TALKIE_ENV_DEVELOPMENT);
export const isTalkieProductionMode = (): boolean => (TALKIE_ENV === TALKIE_ENV_PRODUCTION);
