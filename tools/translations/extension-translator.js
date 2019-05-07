/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

Talkie is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Talkie is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Talkie.  If not, see <https://www.gnu.org/licenses/>.
*/

import GoogleCloudTranslateTranslator from "./google-cloud-translate-translator-service";
import MessagesTranslator from "./messages-translator";
import MessagesTranslatorFactory from "./messages-translator-factory";
import FilesTranslator from "./files-translator";

const assert = require("assert");
const Promise = require("bluebird");

const fs = require("fs");
const readDir = Promise.promisify(fs.readdir);
const stat = Promise.promisify(fs.stat);

const path = require("path");

const configuration = require("configvention");

const getDirectoryNames = (directoryPath) => readDir(directoryPath)
    .filter((file) => stat(path.join(directoryPath, file))
        .then((stats) => stats.isDirectory())
    );

const localesDirectoryName = "_locales";

const getLocalesPath = (rootDirectoryPath) => {
    return path.join(rootDirectoryPath, localesDirectoryName);
};

const getLocaleFilePath = (rootDirectoryPath, localeName, localeFilename) => {
    return path.join(getLocalesPath(rootDirectoryPath), localeName, localeFilename);
};

Promise.try(() => process.argv.slice(2))
    .tap((args) => {
        const languageCodeRx = /[a-z]{2}(_[A-Z]{2})?/;

        assert(args.length >= 4);

        // TODO: check resolved path?
        assert(typeof args[0] === "string");

        assert(typeof args[1] === "string");
        assert(languageCodeRx.test(args[1]));

        assert(typeof args[2] === "string");
        assert(args[2].endsWith(".json"));

        assert(typeof args[3] === "string");
        assert(args[3].endsWith(".json"));

        if (args.length > 4) {
            args.slice(4).forEach((arg) => {
                assert(languageCodeRx.test(arg));
            });
        }
    })
    .then(([rootDirectoryPath, baseLanguageCode, baseFileName, automaticTranslationFilename, ...languageCodes]) => {
        const googleCloudTranslateApiKeyFilePath = configuration.get("GOOGLE_TRANSLATE_API_KEY_FILE_PATH");

        const translatorService = new GoogleCloudTranslateTranslator(googleCloudTranslateApiKeyFilePath);
        const messagesTranslatorFactory = new MessagesTranslatorFactory(translatorService, MessagesTranslator);

        const base = {
            filePath: getLocaleFilePath(rootDirectoryPath, baseLanguageCode, baseFileName),
            language: baseLanguageCode,
        };

        return Promise.try(() => {
            if (languageCodes.length === 0) {
                const localesDirectoryPath = getLocalesPath(rootDirectoryPath);

                return getDirectoryNames(localesDirectoryPath);
            }

            return languageCodes;
        })
            .filter((localeName) => localeName !== baseLanguageCode)
            .map((localeName) => {
                return {
                    filePath: getLocaleFilePath(rootDirectoryPath, localeName, automaticTranslationFilename),
                    language: localeName,
                };
            })
            .then((locales) => {
                const filesTranslator = new FilesTranslator(messagesTranslatorFactory, base, locales);

                return filesTranslator.translate();
            });
    })
    .catch((error) => {
        /* eslint-disable no-console */
        console.error("Error", error);
        /* eslint-enable no-console */
    });
