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
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import type {
	I18n,
} from "webextension-polyfill";

export default class WebExtensionEnvironmentLocaleProvider implements ILocaleProvider {
	getUILocale(): I18n.LanguageCode {
		const locale = browser.i18n.getMessage("@@ui_locale");

		return locale;
	}

	setUILocale(uiLocale: I18n.LanguageCode): void {
		throw new Error(`Cannot set UI locale in webextensions: ${JSON.stringify(uiLocale)}`);
	}

	getTranslationLocale(): TalkieLocale {
		const locale: TalkieLocale = browser.i18n.getMessage("extensionLocale") as TalkieLocale;

		return locale;
	}

	setTranslationLocale(translationLocale: TalkieLocale): void {
		throw new Error(`Cannot set translation locale in webextensions: ${JSON.stringify(translationLocale)}`);
	}
}
