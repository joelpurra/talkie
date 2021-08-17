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

const inputName = "dummy";
const fileExtension = "";
const fileName = `${inputName}${fileExtension}`;

// TODO: use this flag to switch <script> urls instead of replacing file contents by reusing the same location?
const TALKIE_ENV = typeof process.env.TALKIE_ENV === "string"
	? process.env.TALKIE_ENV
	: "production";
const TALKIE_ENV_PRODUCTION = "production";
const TALKIE_ENV_DEVELOPMENT = "development";

// NOTE: there's also react.profiling.min.js and react-dom.profiling.min.js, but they seem less documented.
// const TALKIE_ENV_PROFILING = "profiling";

// NOTE: React and related runtime requirements are copied from the root node_modules.
// The packages have been hoisted because only one copy of some libraries (react, react-dom) is allowed during compilation and/or server-side rendering.
let targets;

switch(TALKIE_ENV) {
	case TALKIE_ENV_PRODUCTION:
		targets = {
			"./dist/umd/browser-polyfill.js": "./node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
			"./dist/umd/react.js": "../../node_modules/react/umd/react.production.min.js",
			"./dist/umd/react-dom.js": "../../node_modules/react-dom/umd/react-dom.production.min.js",
			"./dist/umd/react-redux.js": "../../node_modules/react-redux/dist/react-redux.min.js",
			"./dist/umd/redux.js": "../../node_modules/redux/dist/redux.min.js",
			"./dist/umd/redux-thunk.js": "../../node_modules/redux-thunk/dist/redux-thunk.min.js",
			"./dist/umd/reselect.js": "../../node_modules/reselect/dist/reselect.min.js",
		};
	break;

	case TALKIE_ENV_DEVELOPMENT:
		targets = {
			"./dist/umd/browser-polyfill.js": "./node_modules/webextension-polyfill/dist/browser-polyfill.js",
			"./dist/umd/react.js": "../../node_modules/react/umd/react.development.js",
			"./dist/umd/react-dom.js": "../../node_modules/react-dom/umd/react-dom.development.js",
			"./dist/umd/react-redux.js": "../../node_modules/react-redux/dist/react-redux.js",
			"./dist/umd/redux.js": "../../node_modules/redux/dist/redux.js",
			"./dist/umd/redux-thunk.js": "../../node_modules/redux-thunk/dist/redux-thunk.js",
			"./dist/umd/reselect.js": "../../node_modules/reselect/dist/reselect.js",
		};
	break;
}

const rollupConfiguration = {
	input: `./src/${fileName}.js`,
	output: {
		file: `./dist/rollup/${fileName}.js`,
		name: fileName,
	},
	plugins: [
		copy({
			targets: Object.entries(targets).map(([destination, source]) => {
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
