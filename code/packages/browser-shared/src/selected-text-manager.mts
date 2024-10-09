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

import {
	logDebug,
} from "@talkie/shared-application-helpers/log.mjs";
import type {
	SelectedTextAndLanguageCodes,
} from "@talkie/shared-ui/hocs/pass-selected-text-to-background-types.mjs";
import executeGetFramesSelectionTextAndLanguage from "@talkie/shared-ui/utils/get-selected-text-and-languages.mjs";

import type Execute from "./execute.mjs";
import type {
	FrameResult,
} from "./execute.mjs";

export default class SelectedTextManager {
	constructor(private readonly execute: Execute) {}

	async getFramesSelectionTextAndLanguage(tabId: number): Promise<SelectedTextAndLanguageCodes[]> {
		// TODO: filter and log injection results with errors instead of results.
		const framesSelectionTextAndLanguageFrameResults: Array<FrameResult<SelectedTextAndLanguageCodes | null>> = await this.execute.scriptInAllFramesWithTimeout<SelectedTextAndLanguageCodes | null>(tabId, executeGetFramesSelectionTextAndLanguage, 1000);
		const framesSelectionTextAndLanguage: Array<SelectedTextAndLanguageCodes | null> = framesSelectionTextAndLanguageFrameResults
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			.map((t) => t.result as SelectedTextAndLanguageCodes | null);

		void logDebug("Variable", "framesSelectionTextAndLanguage", framesSelectionTextAndLanguage);

		if (!framesSelectionTextAndLanguage || !Array.isArray(framesSelectionTextAndLanguage)) {
			throw new Error("framesSelectionTextAndLanguage");
		}

		const nonEmptyFramesSelectionTextAndLanguage: SelectedTextAndLanguageCodes[] = framesSelectionTextAndLanguage
			// eslint-disable-next-line unicorn/prefer-native-coercion-functions, @typescript-eslint/prefer-readonly-parameter-types
			.filter((t): t is NonNullable<SelectedTextAndLanguageCodes> => Boolean(t));

		return nonEmptyFramesSelectionTextAndLanguage;
	}
}
