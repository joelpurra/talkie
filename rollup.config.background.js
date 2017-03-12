import json from "rollup-plugin-json";

export default {
    plugins: [
        json(),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/background/background.js",
    moduleName: "background",
    dest: "dist/background.js",
};
