const assert = require("assert");
const Promise = require("bluebird");

const clone = require("clone");

const GoogleTranslate = require("@google-cloud/translate");
const striptags = require("striptags");

export default class GoogleCloudTranslateTranslator {
    constructor(googleCloudTranslateApiKey) {
        assert(typeof googleCloudTranslateApiKey === "string");

        this._googleCloudTranslateApiKey = googleCloudTranslateApiKey;

        this._googleTranslateOptions = {
            promise: Promise,
            key: this._googleCloudTranslateApiKey,
        };
        this._googleTranslate = GoogleTranslate(this._googleTranslateOptions);
    }

    translate(fromLanguage, toLanguage, original) {
        assert(typeof fromLanguage === "string");
        assert(typeof toLanguage === "string");
        assert(typeof original === "object");
        Object.keys(original).forEach((originalKey) => {
            assert(typeof original[originalKey].message === "string");
        });

        return Promise.try(() => {
            const messages = clone(original);
            const keys = Object.keys(messages);

            const preparedMessages = keys.map((key) => {
                const preparedMessage = messages[key].message
                        .replace(/Talkie Premium/g, "<span class=\"notranslate\">___TEMP_TALKIE_PREMIUM___</span>")
                        .replace(/Talkie 🌟 Premium/g, "<span class=\"notranslate\">___TEMP_TALKIE_STAR_PREMIUM___</span>")
                        .replace(/🌟 Premium/g, "<span class=\"notranslate\">___TEMP_STAR_PREMIUM___</span>")
                        .replace(/Talkie/g, "<span class=\"notranslate\">___TEMP_TALKIE___</span>")
                        .replace(/Premium/g, "<span class=\"notranslate\">___TEMP_PREMIUM___</span>")
                        .replace(/🌟/g, "<span class=\"notranslate\">___TEMP_STAR___</span>")
                        .replace(/\${2}/g, " <span class=\"notranslate\"> USD </span> ")
                        .replace(/\$(\w+)\$/g, "<span class=\"notranslate\">$$$1$$</span>");

                const htmlMessage = `<div lang="en">${preparedMessage}</div>`;

                return htmlMessage;
            });

            const translationOptions = {
                from: fromLanguage,
                to: toLanguage,
                format: "html",
            };

            return this._googleTranslate.translate(preparedMessages, translationOptions)
                .then((translationResponses) => {
                    const translations = translationResponses[0];
                    /* eslint-disable no-unused-vars */
                    const apiResponse = translationResponses[1];
                    /* eslint-enable no-unused-vars */

                    const translateDirtyMessages = translations
                            .map((translationResponse) => striptags(translationResponse))
                            .map((translationResponse) => {
                                const translateDirtyMessage = translationResponse
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
                                    .replace(/ {2,}/g, " ")
                                    .trim();

                                return translateDirtyMessage;
                            });

                    return translateDirtyMessages;
                })
                .then((translateDirtyMessages) => {
                    keys.forEach((key, index) => {
                        messages[key].original = messages[key].message;
                        messages[key].message = translateDirtyMessages[index];
                    });

                    return messages;
                });
        });
    }
}
