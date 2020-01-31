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

const assert = require("assert");
const Promise = require("bluebird");

const clone = require("clone");

const jsonfile = require("jsonfile");
const jsonReadFile = Promise.promisify(jsonfile.readFile);
const jsonWriteFile = Promise.promisify(jsonfile.writeFile);

export default class FilesTranslator {
    constructor(messagesTranslatorFactory, base, locales) {
        assert(typeof messagesTranslatorFactory === "object");
        assert(typeof messagesTranslatorFactory.create === "function");
        assert(typeof base === "object");
        assert(typeof base.filePath === "string");
        assert(typeof base.language === "string");
        assert(Array.isArray(locales));
        locales.forEach((locale) => {
            assert(typeof locale.filePath === "string");
            assert(typeof locale.language === "string");

            // NOTE: ensure the base language isn't translated onto itself.
            assert(typeof locale.language !== base.language);
        });

        this._messagesTranslatorFactory = messagesTranslatorFactory;
        this._base = base;
        this._locales = locales;
    }

    translate() {
        return jsonReadFile(this._base.filePath)
            .then((baseMessages) => {
                const baseWithMessages = {
                    messages: clone(baseMessages),
                    language: this._base.language,
                };

                return Promise.map(
                    this._locales,
                    (locale) => jsonReadFile(locale.filePath)
                        .then((localeMessages) => {
                            const localeWithMessages = {
                                messages: clone(localeMessages),
                                language: locale.language,
                            };

                            return this._messagesTranslatorFactory.create(baseWithMessages, localeWithMessages)
                                .then((messagesTranslator) => messagesTranslator.translate());
                        })
                        .then((translated) => jsonWriteFile(
                            locale.filePath,
                            translated,
                            {
                                spaces: 2,
                            },
                        )),
                );
            });
    }
}
