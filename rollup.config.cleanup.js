import cleanup from "rollup-plugin-cleanup";

export default () =>
    cleanup({
        maxEmptyLines: -1,
        comments: [
            // NOTE: remove per-file copyright notices. It will be re-added as a single banner.
            // NOTE: keeping everything else not matching.
            /^(?!\*\s*This file is part of Talkie)/,
        ],
    });
