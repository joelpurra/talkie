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

import languages from "../languages/languages.json";

export default class TalkieLocaleHelper {
	_getSync(languageCode, name) {
		const languageGroup = languageCode.slice(0, 2);

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
		// eslint-disable-next-line no-sync
		return this._getSync(languageCode, "direction");
	}

	async getBidiDirection(languageCode) {
		// eslint-disable-next-line no-sync
		return this.getBidiDirectionSync(languageCode);
	}

	getSampleTextSync(languageCode) {
		// eslint-disable-next-line no-sync
		return this._getSync(languageCode, "sample");
	}

	async getSampleText(languageCode) {
		// eslint-disable-next-line no-sync
		return this.getSampleTextSync(languageCode);
	}

	getTranslatedLanguagesSync() {
		const allLanguages = Object.keys(languages.languages);

		return allLanguages;
	}

	async getTranslatedLanguages() {
		// eslint-disable-next-line no-sync
		return this.getTranslatedLanguagesSync();
	}
}
