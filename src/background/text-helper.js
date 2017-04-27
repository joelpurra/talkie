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

import {
    last,
} from "../shared/basic";

export default class TextHelper {}

TextHelper.splitTextToParagraphs = (text) => {
    // NOTE: in effect discarding empty paragraphs.
    return text.split(/\n+/);
};

TextHelper.splitTextToSentencesOfMaxLength = (text, maxPartLength) => {
    // NOTE: in effect merging multiple spaces in row to a single space.
    const spacedTextParts = text.split(/ +/);

    const naturalPauseRx = /(^--?$|[.,!?:;]$)/;

    const textParts = spacedTextParts.reduce((newParts, spacedTextPart) => {
        const appendToText = (ttt) => {
            if (last(newParts) === "") {
                newParts[newParts.length - 1] = ttt;
            } else {
                newParts[newParts.length - 1] += " " + ttt;
            }
        };

        const appendPart = (ttt) => {
            newParts[newParts.length] = ttt;
        };

        if (naturalPauseRx.test(spacedTextPart)) {
            appendToText(spacedTextPart);

            appendPart("");
        } else if ((last(newParts).length + 1 + spacedTextPart.length) < maxPartLength) {
            appendToText(spacedTextPart);
        } else {
            appendPart(spacedTextPart);
        }

        return newParts;
    }, [""]);

    // NOTE: cleaning empty strings "just in case".
    const cleanTextParts = textParts.filter((textPart) => textPart.trim().length > 0);

    return cleanTextParts;
};
