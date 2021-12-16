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
	ReadonlyDeep,
} from "type-fest";

import {
	FramesSelectionTextAndLanguageCode,
} from "./pass-selected-text-to-background-types.mjs";

/* eslint-disable no-inner-declarations, complexity, no-console */
// NOTE: duplicated elsewhere in the codebase.
const executeGetFramesSelectionTextAndLanguageCode: () => FramesSelectionTextAndLanguageCode | null = () => {
	try {
		function talkieGetParentElementLanguages(element: HTMLElement | Node | null): Array<ReadonlyDeep<string | null>> {
			return (new Array<ReadonlyDeep<string | null>>())
				.concat((element || null) && element && (element as HTMLElement).getAttribute && (element as HTMLElement).getAttribute("lang"))
				.concat((element || null) && element && element.parentElement && talkieGetParentElementLanguages(element.parentElement));
		}

		const talkieSelectionData = {
			htmlTagLanguage: ((document || null) && document && (document.getElementsByTagName || null) && (document.querySelectorAll("html") || null) && (document.querySelectorAll("html").length > 0 || null) && (document.querySelectorAll("html")[0]!.getAttribute("lang") || null)) || null,
			parentElementsLanguages: (talkieGetParentElementLanguages((document || null) && document && (document.getSelection || null) && (document.getSelection() || null) && (document.getSelection()!.rangeCount > 0 || null) && (document.getSelection()!.getRangeAt || null) && (document.getSelection()!.getRangeAt(0) || null) && (document.getSelection()!.getRangeAt(0).startContainer || null))) || null,
			text: ((document || null) && document && (document.getSelection || null) && (document.getSelection() || null) && document.getSelection()!.toString()) || null,
		};

		return talkieSelectionData;
	} catch (error: unknown) {
		try {
			console.warn("Error while getting the selected text from page, swallowing error.", error);
		} catch {}

		return null;
	}
};
/* eslint-enable no-inner-declarations, complexity, no-console */

export default executeGetFramesSelectionTextAndLanguageCode;
