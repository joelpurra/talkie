/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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
    promiseTry,
} from "./promise";

import languages from "../languages/languages.json";

export default class TalkieLocaleHelper {
    _getSync(languageCode, name) {
        const languageGroup = languageCode.substring(0, 2);

        const value = (
            languages.languages[languageCode]
                && languages.languages[languageCode][name]
        )
            || (
                languages.languages[languageGroup]
                && languages.languages[languageGroup][name]
            )
            || languages.base[name];

        return value;
    }

    getBidiDirectionSync(languageCode) {
        /* eslint-disable no-sync */
        return this._getSync(languageCode, "direction");
        /* eslint-enable no-sync */
    }

    getBidiDirection(languageCode) {
        /* eslint-disable no-sync */
        return promiseTry(() => this.getBidiDirectionSync(languageCode));
        /* eslint-enable no-sync */
    }

    getSampleTextSync(languageCode) {
        /* eslint-disable no-sync */
        return this._getSync(languageCode, "sample");
        /* eslint-enable no-sync */
    }

    getSampleText(languageCode) {
        /* eslint-disable no-sync */
        return promiseTry(() => this.getSampleTextSync(languageCode));
        /* eslint-enable no-sync */
    }

    getTranslatedLanguagesSync() {
        const allLanguages = Object.keys(languages.languages);

        return allLanguages;
    }

    getTranslatedLanguages() {
        /* eslint-disable no-sync */
        return promiseTry(() => this.getTranslatedLanguagesSync());
        /* eslint-enable no-sync */
    }
}
