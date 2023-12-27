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

import mergeOptions from "./rollup.config.merge.mjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";

import filesize from "./rollup.config.filesize.mjs";
import rollupConfig from "./rollup.config.base.mjs";

import { NODE_ENV } from "./node-build-mode.mjs";
import { TALKIE_ENV } from "./talkie-build-mode.mjs";

const rollupConfiguration = (name) =>
	mergeOptions.call(
		{
			concatArrays: true,
		},
		rollupConfig(name),
		{
			onwarn(warning, warn) {
				// TODO: allowlist specific warnings for known packages.
				if (warning.code === "THIS_IS_UNDEFINED") {
					return;
				}

				warn(warning);
			},
			output: {
				exports: "auto",
				format: "iife",
			},
			plugins: [
				replace({
					preventAssignment: true,
					"process.env.NODE_ENV": JSON.stringify(NODE_ENV),
					"process.env.TALKIE_ENV": JSON.stringify(TALKIE_ENV),
				}),
				nodeResolve({
					browser: true,
				}),
				filesize(),
			],
		}
	);

export default rollupConfiguration;
