const rendererPath = process.argv[2];
const renderWorkingDirectory = process.argv[3];
const talkieLocale = process.argv[4];

const getHtml = require(rendererPath);

// NOTE: need to change the directory after require().
// NOTE: renderer expects to execute in the root of the output directory, to load any modified files.
process.chdir(renderWorkingDirectory);

process.on("unhandledRejection", (error) => {
    /* eslint-disable no-console */
    console.error("unhandledRejection", error);
    /* eslint-enable no-console */

    process.exit(2);
});

getHtml(talkieLocale)
    .then(html => {
        // NOTE: outputting html to stdout.
        /* eslint-disable no-console */
        console.log(html);
        /* eslint-enable no-console */

        return undefined;
    })
    .catch((error) => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */

        process.exit(1);
    });
