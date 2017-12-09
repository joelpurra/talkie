/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

export function handleBubbledLinkClick(handleUrl, e) {
    let element = e.target;

    do {
        if (element.tagName === "A") {
            const href = element.getAttribute("href");

            if (typeof href === "string" && href.startsWith("https://")) {
                e.preventDefault();
                e.stopPropagation();

                handleUrl(href);

                return false;
            }

            // TODO: warn about mismatched link style?
        }

        element = element.parentElement;
    } while (element);
}
