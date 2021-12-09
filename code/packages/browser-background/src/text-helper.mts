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
	lastOrThrow,
} from "@talkie/shared-application-helpers/basic.mjs";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class, unicorn/no-static-only-class
export default class TextHelper {
	static splitTextToParagraphs = (text: string): string[] =>
		// NOTE: in effect discarding empty paragraphs.
		text.split(/[\n\r\u2028\u2029]+/)
	;

	static splitTextToSentencesOfMaxLength = (text: string, maxPartLength: number): string[] => {
		// TODO: avoid helpers or use library.
		const appendToText = (texts: Readonly<string[]>, text: string): string[] => {
			const last = lastOrThrow(texts);

			if (last === "") {
				return texts.slice(0, -1).concat(text);
			}

			return texts.slice(0, -1).concat(`${last} ${text}`);
		};

		// NOTE: in effect merging multiple whitespaces in row to a single separator/space.
		const spacedTextParts = text.split(/\s+/);
		const naturalPauseRx = /(^--?$|[.,!?:;]$)/;

		// eslint-disable-next-line unicorn/no-array-reduce
		const textParts: Readonly<string[]> = spacedTextParts.reduce(
			(splitTextParts: Readonly<string[]>, spacedTextPart: Readonly<string>) => {
				if (naturalPauseRx.test(spacedTextPart)) {
					// NOTE: this text is/has a natural pause so append text to the current part, then end the part by starting a new (empty) part.
					return appendToText(splitTextParts, spacedTextPart).concat("");
				}

				if ((lastOrThrow(splitTextParts).length + 1 + spacedTextPart.length) < maxPartLength) {
					// NOTE: there is still "room" in the part, append text.
					return appendToText(splitTextParts, spacedTextPart);
				}

				// NOTE: there was no more "room" in the part, start a new part with the text.
				return splitTextParts.concat(spacedTextPart);
			},
			[
				"",
			],
		);

		// NOTE: cleaning empty strings "just in case".
		const cleanTextParts = textParts.filter((textPart) => textPart.trim().length > 0);

		return cleanTextParts;
	};
}
