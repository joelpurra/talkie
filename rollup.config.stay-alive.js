import json from "rollup-plugin-json";

export default {
    plugins: [
        json(),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/options/options.js",
    moduleName: "options",
    dest: "dist/options.js",
};
