/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

export default class MessagesTranslator {
    constructor(translatorService, base, locale) {
        assert(typeof translatorService === "object");
        assert(typeof base === "object");
        assert(typeof base.messages === "object");
        assert(typeof base.language === "string");
        assert(typeof locale === "object");
        assert(typeof locale.messages === "object");
        assert(typeof locale.language === "string");

        // NOTE: ensure the base language isn't translated onto itself.
        assert(typeof locale.language !== base.language);

        this._translatorService = translatorService;
        this._base = base;
        this._locale = locale;
    }

    _keepOnlyKeys(keys, obj) {
        assert(Array.isArray(keys));
        keys.forEach((key) => {
            assert(typeof key === "string" || (typeof key === "number" && Math.floor(key) === Math.ceil(key)));
        });
        assert(typeof obj === "object");

        return Promise.try(() => keys.reduce((newObj, key) => {
            newObj[key] = obj[key];

            return newObj;
        },
        {}));
    }

    translate() {
        return Promise.try(() => {
            const baseKeys = Object.keys(this._base.messages);

            return this._keepOnlyKeys(baseKeys, this._locale.messages)
                .then((localeMessages) => {
                    // TODO: function filterKeys.
                    const alreadyTranslatedLocale = baseKeys.reduce((alreadyTranslated, baseKey) => {
                        if (localeMessages[baseKey] && localeMessages[baseKey].original === this._base.messages[baseKey].message) {
                            alreadyTranslated[baseKey] = localeMessages[baseKey];
                        }

                        return alreadyTranslated;
                    },
                    {});

                    // TODO: function filterKeys.
                    const untranslatedLocale = baseKeys.reduce((untranslated, baseKey) => {
                        if (!localeMessages[baseKey] || localeMessages[baseKey].original !== this._base.messages[baseKey].message) {
                            untranslated[baseKey] = this._base.messages[baseKey];
                        }

                        return untranslated;
                    },
                    {});

                    if (Object.keys(untranslatedLocale).length === 0) {
                        const translated = alreadyTranslatedLocale;

                        return translated;
                    }

                    return this._translatorService.translate(this._base.language, this._locale.language, untranslatedLocale)
                        .tap((automaticallyTranslated) => {
                            assert(typeof automaticallyTranslated === "object");
                            Object.keys(automaticallyTranslated).forEach((automaticallyTranslatedKey) => {
                                assert(typeof automaticallyTranslated[automaticallyTranslatedKey].original === "string");
                                assert(typeof automaticallyTranslated[automaticallyTranslatedKey].message === "string");
                            });
                        })
                        .then((automaticallyTranslated) => {
                            const translated = Object.assign({}, alreadyTranslatedLocale, automaticallyTranslated);

                            return translated;
                        });
                });
        });
    }
}
