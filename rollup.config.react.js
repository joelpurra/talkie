/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
// import cleanup from "./rollup.config.cleanup.js";
import globals from "rollup-plugin-node-globals";
import json from "rollup-plugin-json";
import replace from "rollup-plugin-replace";
import resolve from "rollup-plugin-node-resolve";

// TODO: re-enable.
// https://github.com/mjeanroy/rollup-plugin-license/issues/6
// import license from "./rollup.config.license.js";

export default {
    external: [
        "prop-types",
        "react-dom",
        "react-redux",
        "react",
        "redux-persist",
        "redux-thunk",
        "redux",
    ],
    globals: {
        "prop-types": "PropTypes",
        "react-dom": "ReactDOM",
        "react-redux": "ReactRedux",
        "react": "React",
        "redux-persist": "ReduxPersist",
        "redux-thunk": "ReduxThunk",
        "redux": "Redux",
    },
    plugins: [
        json(),
        babel({
            exclude: [
                "node_modules/**",
            ],
        }),
        globals(),
        replace({
            // TODO: configuration?
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),
        commonjs({
            include: [
                "src/**",
                "node_modules/**",
            ],
            namedExports: {
                "node_modules/redux-persist/es/constants.js": [
                    "KEY_PREFIX",
                    "REHYDRATE",
                ],
            },
        }),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        // TODO: re-enable.
        // https://github.com/aMarCruz/rollup-plugin-cleanup/issues/5
        // cleanup(),
        // TODO: re-enable.
        // https://github.com/mjeanroy/rollup-plugin-license/issues/6
        // license("options"),
    ],
    format: "iife",
    sourceMap: true,
};
