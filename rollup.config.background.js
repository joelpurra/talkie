import json from "rollup-plugin-json";
import cleanup from "./rollup.config.cleanup.js";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        cleanup(),
        license("background"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/background/background.js",
    moduleName: "background",
    dest: "dist/background.js",
};
