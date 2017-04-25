import json from "rollup-plugin-json";

export default {
    plugins: [
        json(),
    ],
    format: "umd",
    sourceMap: true,
    entry: "src/stay-alive/stay-alive.js",
    moduleName: "stay-alive",
    dest: "dist/stay-alive.js",
};
