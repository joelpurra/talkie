const assert = require("assert");
const Promise = require("bluebird");

const configuration = require("configvention");
const googleTranslateApiKey = configuration.get("GOOGLE_TRANSLATE_API_KEY");

const streamToPromise = require("stream-to-promise");

const GoogleTranslate = require("@google-cloud/translate");
const googleTranslateOptions = {
    promise: Promise,
    key: googleTranslateApiKey,
};
const googleTranslate = GoogleTranslate(googleTranslateOptions);

const fromLanguage = "en";
const toLanguage = process.argv[2];

assert(typeof toLanguage === "string");
assert(toLanguage.length > 0);

process.on("SIGPIPE", () => {
    /* eslint-disable no-console */
    console.error("Error", "Trying to write to a closed stdout.");
    /* eslint-enable no-console */

    process.exit(1);
});

const stdin = process.openStdin();

streamToPromise(stdin)
    .then((buffer) => buffer.toString("utf8"))
    .then((str) => JSON.parse(str))
    .then((base) => {
        const keys = Object.keys(base);

        const cleanedMessages = keys.map((key) => {
            const cleanedMessage = base[key].message
                .replace(/Talkie Premium/g, "<span class=\"notranslate\">___TEMP_TALKIE_PREMIUM___</span>")
                .replace(/Talkie 🌟 Premium/g, "<span class=\"notranslate\">___TEMP_TALKIE_STAR_PREMIUM___</span>")
                .replace(/🌟 Premium/g, "<span class=\"notranslate\">___TEMP_STAR_PREMIUM___</span>")
                .replace(/Talkie/g, "<span class=\"notranslate\">___TEMP_TALKIE___</span>")
                .replace(/Premium/g, "<span class=\"notranslate\">___TEMP_PREMIUM___</span>")
                .replace(/🌟/g, "<span class=\"notranslate\">___TEMP_STAR___</span>")
                .replace(/\${2}/g, " <span class=\"notranslate\"> USD </span> ")
                .replace(/\$(\w+)\$/g, "<span class=\"notranslate\">$$$1$$</span>");

            const htmlMessage = `<div lang="en">${cleanedMessage}</div>`;

            return htmlMessage;
        });

        const translationOptions = {
            from: fromLanguage,
            to: toLanguage,
            format: "html",
        };

        return googleTranslate.translate(cleanedMessages, translationOptions)
            .tap(() => undefined)
            .then((translationResponses) => {
                const translations = translationResponses[0];
                /* eslint-disable no-unused-vars */
                const apiResponse = translationResponses[1];
                /* eslint-enable no-unused-vars */

                const translateDirtyMessages = translations.map((translationResponse) => {
                    const translateDirtyMessage = translationResponse
                        .replace(/<div lang="en">/g, "")
                        .replace(/<\/div>/g, "")
                        .replace(/<span class="notranslate">/g, "")
                        .replace(/<\/span>/g, "")
                        .replace(/___TEMP_TALKIE_PREMIUM___/g, "Talkie Premium")
                        .replace(/___TEMP_TALKIE_STAR_PREMIUM___/g, "Talkie 🌟 Premium")
                        .replace(/___TEMP_STAR_PREMIUM___/g, "🌟 Premium")
                        .replace(/___TEMP_TALKIE___/g, "Talkie")
                        .replace(/___TEMP_PREMIUM___/g, "Premium")
                        .replace(/___TEMP_STAR___/g, "🌟")
                        .replace(/^\s+/g, "")
                        .replace(/\s+$/g, "")
                        .replace(/ +\/ +/g, "/")
                        .replace(/ +-+ +/g, " — ")
                        .replace(/ +([.:;!?]) +/g, "$1 ")
                        .replace(/ {2,}/g, " ");

                    return translateDirtyMessage;
                });

                return translateDirtyMessages;
            })
            .then((translateDirtyMessages) => {
                keys.forEach((key, index) => {
                    // NOTE: modifying the input object.
                    // TODO: don't modify the input object.
                    base[key].original = base[key].message;
                    base[key].message = translateDirtyMessages[index];
                });

                return base;
            })
            .then((translatedObject) => JSON.stringify(translatedObject, null, 2))
            /* eslint-disable no-console */
            .then((json) => console.log(json));
            /* eslint-enable no-console */
    })
    .catch((error) => {
        /* eslint-disable no-console */
        console.error("Error", error);
        /* eslint-enable no-console */
    });
