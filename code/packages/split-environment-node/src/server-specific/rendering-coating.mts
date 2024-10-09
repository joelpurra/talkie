/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type IApiCoating from "@talkie/split-environment-interfaces/iapi/iapi-coating.mjs";
import type IApiCoatingLocale from "@talkie/split-environment-interfaces/iapi/iapi-coating-locale.mjs";
import type IApiCoatingMetadata from "@talkie/split-environment-interfaces/iapi/iapi-coating-metadata.mjs";
import type IApiCoatingPremium from "@talkie/split-environment-interfaces/iapi/iapi-coating-premium.mjs";
import type IApiCoatingTalkieLocale from "@talkie/split-environment-interfaces/iapi/iapi-coating-talkie-locale.mjs";

export default class RenderingCoating implements IApiCoating {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly browser = null;
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly clipboard = null;

	constructor(
		readonly locale: IApiCoatingLocale,
		readonly metadata: IApiCoatingMetadata,
		readonly premium: IApiCoatingPremium,
		readonly talkieLocale: IApiCoatingTalkieLocale,
	) {}
}
