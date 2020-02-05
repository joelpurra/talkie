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

export default class MessagesTranslatorFactory {
    constructor(translatorService, MessagesTranslator) {
        assert(typeof translatorService === "object");
        assert(typeof MessagesTranslator === "function");

        this._translatorService = translatorService;
        this._MessagesTranslator = MessagesTranslator;
    }

    create(base, locale) {
        assert(typeof base === "object");
        assert(typeof base.messages === "object");
        assert(typeof base.language === "string");
        assert(typeof locale === "object");
        assert(typeof locale.messages === "object");
        assert(typeof locale.language === "string");

        // NOTE: ensure the base language isn't translated onto itself.
        assert(typeof locale.language !== base.language);

        return Promise.try(() => {
            const messagesTranslator = new this._MessagesTranslator(this._translatorService, base, locale);

            return messagesTranslator;
        });
    }
}
