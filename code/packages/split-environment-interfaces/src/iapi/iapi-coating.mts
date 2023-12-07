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

import type IApiCoatingBrowser from "./iapi-coating-browser.mjs";
import type IApiCoatingLocale from "./iapi-coating-locale.mjs";
import type IApiCoatingMetadata from "./iapi-coating-metadata.mjs";
import type IApiCoatingPremium from "./iapi-coating-premium.mjs";
import type IApiCoatingTalkieLocale from "./iapi-coating-talkie-locale.mjs";

interface IApiCoating {
	browser: IApiCoatingBrowser | null;
	locale: IApiCoatingLocale | null;
	metadata: IApiCoatingMetadata | null;
	premium: IApiCoatingPremium | null;
	talkieLocale: IApiCoatingTalkieLocale | null;
}

export default IApiCoating;
