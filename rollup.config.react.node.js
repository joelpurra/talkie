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

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import ejs from "rollup-plugin-ejs";
import globals from "rollup-plugin-node-globals";

import license from "./rollup.config.license.js";
import reactRollupConfig from "./rollup.config.react";

const mergeOptions = require("merge-options");

export default (name) => mergeOptions(
	reactRollupConfig,
	{
		external: [
			"prop-types",
			"react-dom",
			"react-dom/server",
			"react-redux",
			"react",
			"redux-thunk",
			"redux",
			"reselect",
		],
		plugins: [
			json(),
			replace({
				delimiters: [
					"",
					"",
				],
				values: {
					// TODO: configuration?
					SPLIT_ENVIRONMENT: "node",
				},
			}),
			ejs({
				include: [
					"**/*.html",
				],
				// NOTE: enable to automatically inline <link> css file as <style> tags.
				// loadCss: true,
				compilerOptions: {
					strict: true,
					_with: false,
					client: true,
				},
			}),
			babel({
				babelHelpers: "bundled",
				exclude: [
					"node_modules/**",
				],
			}),
			globals(),
			commonjs({
				include: [
					"src/**",
					"node_modules/**",
				],
			}),
			resolve(),
			license(name),
		],
		output: {
			exports: "default",
			format: "cjs",
		},
	},
);
