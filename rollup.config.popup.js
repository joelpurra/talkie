import json from "rollup-plugin-json";

export default {
    plugins: [
        json(),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/popup/popup.js",
    moduleName: "popup",
    dest: "dist/popup.js",
};
