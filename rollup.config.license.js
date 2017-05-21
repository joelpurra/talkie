const path = require("path");
import license from "rollup-plugin-license";

export default (name) =>
    license({
        sourceMap: true,

        banner: {
            file: path.join(__dirname, "LICENSE-BANNER"),
        },

        thirdParty: {
            output: path.join(__dirname, "dist", `${name}.dependencies.txt`),
        },
    });
