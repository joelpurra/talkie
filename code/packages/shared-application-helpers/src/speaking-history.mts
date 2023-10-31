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

/* eslint-disable no-bitwise, unicorn/prefer-math-trunc, unicorn/prefer-code-point */
/**
 * Calculate a hash (number) for a given string. It is not intended to be secure, just fairly unique.
 *
 * @link https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 * @link https://stackoverflow.com/a/34842797
 *
 * @param s Any string.
 * @returns Hash of the given string.
 */
const hashCode = (s: string): number => [
	...s,
].reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0);
/* eslint-enable no-bitwise, unicorn/prefer-math-trunc, unicorn/prefer-code-point */

export const getSpeakingHistoryEntryTextHash = (text: string): number => {
	// NOTE: probably doesn't help much, but would like to avoid very similar-looking duplicate history entries.
	// NOTE: leading/trailing/consecutive whitespaces are ignored by the speech synthesizer anyhow.
	const normalizedText = text
		.replaceAll(/\s+/g, " ")
		.trim();

	return hashCode(normalizedText);
};
