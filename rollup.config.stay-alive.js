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

import json from "rollup-plugin-json";
import cleanup from "./rollup.config.cleanup.js";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        cleanup(),
        license("stay-alive"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/stay-alive/stay-alive.js",
    moduleName: "stay-alive",
    dest: "dist/stay-alive.js",
};
