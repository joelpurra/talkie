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

import type {
	Browser,
} from "webextension-polyfill";

const getPageName = (): string => {
	const pathParts = document.location.pathname.split("/");

	if (pathParts.length > 0) {
		const lastItem = pathParts.pop();

		if (typeof lastItem !== "string") {
			throw new TypeError("lastItem");
		}

		const filenameParts = lastItem.split(".");

		if (filenameParts.length > 0) {
			const firstItem = filenameParts.shift();

			if (typeof firstItem !== "string") {
				throw new TypeError("firstItem");
			}

			return firstItem;
		}
	}

	throw new Error(`Could not get page name: ${typeof document} ${JSON.stringify(document?.location)}`);
};

const getGlobalExtension = (global: unknown): Browser => {
	if (typeof global !== "object" || global === null) {
		throw new TypeError("Global is not an object.");
	}

	if ("browser" in global) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
		return (global as any).browser as Browser;
	}

	if ("chrome" in global) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
		return (global as any).chrome as Browser;
	}

	throw new TypeError("Could not find browser object.");
};

const globalExtension = getGlobalExtension(window);

// NOTE: use this hacky solution for speed, or use ILocaleProvider for DRY?
// NOTE: might be able to use @@ui_locale, but would miss out on locale directory fallback detection logic in the browser.
const locale = globalExtension.i18n.getMessage("extensionLocale");
const pageName: string = getPageName();

// NOTE: relative to the html page where this script is included, rooted in the browser extension package root.
const pageBaseUrl = `/packages/${pageName}-renderer/src/${pageName}.html`;
const pageTranslatedUrl = `/packages/${pageName}-renderer/dist/html/${pageName}.${locale}.html`;

const urlWithLocale = document.location.href.replace(pageBaseUrl, pageTranslatedUrl);

document.location.replace(urlWithLocale);
