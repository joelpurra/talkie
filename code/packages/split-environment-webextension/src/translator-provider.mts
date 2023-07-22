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

import ILocaleProvider from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import ITranslatorProvider from "@talkie/split-environment-interfaces/itranslator-provider.mjs";

export default class WebExtensionEnvironmentTranslatorProvider implements ITranslatorProvider {
	constructor(
		// @ts-expect-error: unused variable. ts(6133)
		private readonly localeProvider: ILocaleProvider,
	) {}

	async translate(key: string, extras?: Readonly<string[]>): Promise<string> {
		// eslint-disable-next-line no-sync
		return this.translateSync(key, extras);
	}

	translateSync(key: string, extras?: Readonly<string[]>): string {
		// const locale = this.localeProvider.getTranslationLocale();

		// TODO: use same translation system in frontend and backend?
		const translated = browser.i18n.getMessage(key, extras as string[]);

		return translated;
	}
}
