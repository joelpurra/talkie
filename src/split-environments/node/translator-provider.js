/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import {
    logError,
} from "../../shared/log";

const jsonfile = require("jsonfile");

export default class NodeEnvironmentTranslatorProvider {
    constructor(localeProvider) {
        this.localeProvider = localeProvider;

        this.translations = {};
    }

    _getMessagesFilepath(locale) {
        return `./_locales/${locale}/messages.json`;
    }

    _getMessages(locale) {
        if (!this.translations[locale]) {
            const path = this._getMessagesFilepath(locale);
            /* eslint-disable no-sync */
            const json = jsonfile.readFileSync(path);
            /* eslint-enable no-sync */

            this.translations[locale] = json;
        }

        return this.translations[locale];
    }

    _getTranslation(locale, key, extras) {
        // TODO: use same translation system in frontend and backend?
        // translated = [key].concat(extras).join("_").toUpperCase();
        const localeMessages = this._getMessages(locale);
        const messageTemplate = localeMessages[key];

        if (!messageTemplate) {
            logError("_getTranslation", "Missing translation", arguments, messageTemplate);

            throw new Error(`Missing translation: ${key}`);
        }

        const extraTextRx = /\$/;

        if (extraTextRx.test(messageTemplate.message)) {
            // TODO: replace extras in string.
            logError("_getTranslation", "Unhandled translation extras", arguments, messageTemplate);

            throw new Error(`Unhandled translation extras: ${key} ${extras}`);
        }

        const translated = messageTemplate.message;

        return translated;
    }

    translate(key, extras) {
        const locale = this.localeProvider.getTranslationLocale();

        // TODO: use same translation system in frontend and backend?
        // translated = [key].concat(extras).join("_").toUpperCase();
        const translated = this._getTranslation(locale, key, extras);

        return translated;
    }
}
