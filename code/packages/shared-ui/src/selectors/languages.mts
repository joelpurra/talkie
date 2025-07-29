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
	SharedRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import {
	getLanguageGroupsFromLanguages,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import {
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";

const {

	createDraftSafeSelector,
} = toolkit;

export const getTranslationLocale = <S extends SharedRootState>(state: S): Readonly<TalkieLocale> => state.shared.languages.translationLocale;
export const getNavigatorLanguages = <S extends SharedRootState>(state: S): readonly string[] => state.shared.languages.navigatorLanguages;
export const getTranslatedLanguages = <S extends SharedRootState>(state: S): readonly TalkieLocale[] => state.shared.languages.translatedLanguages;

export const getSortedNavigatorLanguages = createDraftSafeSelector(
	[
		getNavigatorLanguages,
	],
	(navigatorLanguages) => [
		...navigatorLanguages,
	].sort((a, b) => a.localeCompare(b)),
);

export const getNavigatorLanguageGroups = createDraftSafeSelector(
	[
		getNavigatorLanguages,
	],
	(voices) => getLanguageGroupsFromLanguages(voices),
);

export const getSortedTranslatedLanguages = createDraftSafeSelector(
	[
		getTranslatedLanguages,
	],
	(translatedLanguages) => [
		...translatedLanguages,
	].sort((a, b) => a.localeCompare(b)),
);
