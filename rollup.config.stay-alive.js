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
