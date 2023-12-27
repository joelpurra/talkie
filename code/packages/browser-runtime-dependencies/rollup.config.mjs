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

import copy from "rollup-plugin-copy";
import path from "path";
import {
	statSync,
} from "fs";

import { isTalkieDevelopmentMode, isTalkieProductionMode } from "../../build/talkie-build-mode.mjs";

// TODO: avoid using rollup when only using non-rollup-specific functionality.
const inputName = "dummy";
const fileExtension = "";
const fileName = `${inputName}${fileExtension}`;

const alwaysCopyTargets = {
	// NOTE: licenses of externalized (manually included) dependencies are not automatically detected by rollup-plugin-license.
	"./dist/umd/browser-polyfill.license.txt": "../../node_modules/webextension-polyfill/LICENSE",
	"./dist/umd/react.license.txt": "../../node_modules/react/LICENSE",
	"./dist/umd/react-dom.license.txt": "../../node_modules/react-dom/LICENSE",
	"./dist/umd/react-redux.license.txt": "../../node_modules/react-redux/LICENSE.md",
	"./dist/umd/redux-toolkit.license.txt": "../../node_modules/@reduxjs/toolkit/LICENSE",
};

// NOTE: there's also react.profiling.min.js and react-dom.profiling.min.js, but they seem less documented.
// const TALKIE_ENV_PROFILING = "profiling";

// NOTE: React and related runtime requirements are copied from the root node_modules.
// The packages have been hoisted because only one copy of some libraries (react, react-dom) is allowed during compilation and/or server-side rendering.
let environmentTargets;

// TODO: use this flag to switch <script> urls instead of replacing file contents by reusing the same location?
if(isTalkieDevelopmentMode()){
environmentTargets = {
			"./dist/umd/browser-polyfill.js": "../../node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
			"./dist/umd/react.js": "../../node_modules/react/umd/react.production.min.js",
			"./dist/umd/react-dom.js": "../../node_modules/react-dom/umd/react-dom.production.min.js",
			"./dist/umd/react-redux.js": "../../node_modules/react-redux/dist/react-redux.min.js",
			"./dist/umd/redux-toolkit.js": "../../node_modules/@reduxjs/toolkit/dist/redux-toolkit.umd.min.js",
		};

	}else if(isTalkieProductionMode()){
		environmentTargets = {
			"./dist/umd/browser-polyfill.js": "../../node_modules/webextension-polyfill/dist/browser-polyfill.js",
			"./dist/umd/react.js": "../../node_modules/react/umd/react.development.js",
			"./dist/umd/react-dom.js": "../../node_modules/react-dom/umd/react-dom.development.js",
			"./dist/umd/react-redux.js": "../../node_modules/react-redux/dist/react-redux.js",
			"./dist/umd/redux-toolkit.js": "../../node_modules/@reduxjs/toolkit/dist/redux-toolkit.umd.js",
		};
}else {
	throw new TypeError();
}

const targets = {
	...alwaysCopyTargets,
	...environmentTargets,
}

const rollupConfiguration = {
	input: `./src/${fileName}.mjs`,
	output: {
		file: `./dist/rollup/${fileName}.js`,
		name: fileName,
	},
	plugins: [
		copy({
			targets: Object.entries(targets)
				.map(([destination, source]) => {
					// NOTE: check if the source file exists.
					statSync(source);

					// NOTE: the copy plugin treats all destinations as directories, so need to "rename" the file.
					// https://github.com/vladshcherbin/rollup-plugin-copy
					const destDirectory = path.dirname(destination);
					const destFilename = path.basename(destination);

					return ({
						dest: destDirectory,
						rename: () => destFilename,
						src: source,
					})
				}),
		}),
	],
};

export default rollupConfiguration;
