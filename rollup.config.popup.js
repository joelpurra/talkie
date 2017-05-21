import json from "rollup-plugin-json";
import cleanup from "./rollup.config.cleanup.js";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        cleanup(),
        license("popup"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/popup/popup.js",
    moduleName: "popup",
    dest: "dist/popup.js",
};
