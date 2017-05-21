import json from "rollup-plugin-json";
import cleanup from "./rollup.config.cleanup.js";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        cleanup(),
        license("options"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/options/options.js",
    moduleName: "options",
    dest: "dist/options.js",
};
