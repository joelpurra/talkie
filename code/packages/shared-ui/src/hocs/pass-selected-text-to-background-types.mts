/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	JsonObject,
} from "type-fest";

export interface SelectedTextAndLanguageCodes extends JsonObject {
	htmlTagLanguage: string | null;
	parentElementsLanguages: ReadonlyArray<string | null>;
	text: string;
}

export interface PerhapsSelectedTextWithFocusTimestamp extends JsonObject {
	mostRecentUse: number;
	selectionTextAndLanguageCode: SelectedTextAndLanguageCodes;
}

export interface SelectedTextWithFocusTimestamp extends PerhapsSelectedTextWithFocusTimestamp {
	selectionTextAndLanguageCode: SelectedTextAndLanguageCodes;
}
