import json from "rollup-plugin-json";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        license("popup"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/popup/popup.js",
    moduleName: "popup",
    dest: "dist/popup.js",
};
