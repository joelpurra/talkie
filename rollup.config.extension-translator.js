import license from "./rollup.config.license.js";

export default {
    plugins: [
        license("extension-translator"),
    ],
    format: "cjs",
    sourceMap: true,
    entry: "tools/translations/extension-translator.js",
    moduleName: "extension-translator",
    dest: "dist/extension-translator.js",
};
