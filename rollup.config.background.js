import json from "rollup-plugin-json";
import license from "./rollup.config.license.js";

export default {
    plugins: [
        json(),
        license("background"),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/background/background.js",
    moduleName: "background",
    dest: "dist/background.js",
};
