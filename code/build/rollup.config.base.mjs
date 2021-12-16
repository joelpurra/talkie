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

import {fileURLToPath} from 'node:url';
import path from 'node:path';

import commonjs from "@rollup/plugin-commonjs";
import { visualizer } from "rollup-plugin-visualizer";
import beep from "@rollup/plugin-beep";
import cleanup from "rollup-plugin-cleanup";
import json from "@rollup/plugin-json";

import license from "./rollup.config.license.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(
	__dirname,
	"..",
);

const rollupConfiguration = (name) => ({
	output: {
		sourcemap: true,
	},
	plugins: [
		json(),
		beep(),
		cleanup(),
		visualizer({
			filename: "./dist/metadata/stats.html",
			projectRoot,
			title: `${name} - Rollup Visualizer`,
		}),
		license(name),
		commonjs({
			include: [
				"../../node_modules/**",
				"../*/node_modules/**",
				"node_modules/**",
			],
		}),
	]
});

export default rollupConfiguration;
