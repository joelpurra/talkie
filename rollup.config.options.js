import json from "rollup-plugin-json";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        license("options"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/options/options.js",
    moduleName: "options",
    dest: "dist/options.js",
};
