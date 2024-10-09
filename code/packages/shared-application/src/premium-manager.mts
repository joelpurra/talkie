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

import type {
	EditionType,
	IPremiumManager,
} from "@talkie/shared-interfaces/ipremium-manager.mjs";
import type IPremiumProvider from "@talkie/split-environment-interfaces/ipremium-provider.mjs";

export default class PremiumManager implements IPremiumManager {
	constructor(private readonly premiumProvider: IPremiumProvider) {}

	private get _editionTypePremium() {
		return "premium" as EditionType;
	}

	private get _editionTypeFree() {
		return "free" as EditionType;
	}

	async isPremiumEdition(): Promise<boolean> {
		return this.premiumProvider.isPremium();
	}

	async getEditionType(): Promise<EditionType> {
		const isPremiumEdition = await this.isPremiumEdition();

		if (isPremiumEdition) {
			return this._editionTypePremium;
		}

		return this._editionTypeFree;
	}
}
