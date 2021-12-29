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

export type BubbledLinkClickHandler = (url: ReadonlyDeep<URL>) => void;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export function handleBubbledLinkClick(handleUrl: BubbledLinkClickHandler, event: ReadonlyDeep<React.MouseEvent>): false | undefined {
	let element: HTMLElement | null = event.target as HTMLElement;

	do {
		if (element.tagName === "A") {
			const href = element.getAttribute("href");

			if (typeof href === "string" && href.startsWith("https://")) {
				event.preventDefault();
				event.stopPropagation();

				const url = new URL(href);

				handleUrl(url);

				// NOTE: stop propagation.
				return false;
			}

			// TODO: warn about mismatched link style?
		}

		element = element.parentElement;
	} while (element);

	// NOTE: do not stop propagation.
	return undefined;
}
