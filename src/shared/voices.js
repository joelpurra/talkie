/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://github.com/joelpurra/talkie>

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
    promiseTry,
} from "../shared/promise";

import {
    getBackgroundPage,
} from "../shared/tabs";

export const getVoices = () => promiseTry(
    () => {
        return getBackgroundPage()
            .then((background) => {
                const voices = background.getAllVoices();

                if (!voices || voices.length === 0) {
                    throw new Error("The browser does not have any voices installed.");
                }

                return voices;
            });
    }
);

export const getMappedVoices = () => promiseTry(
    () => {
        return getVoices()
            .then((voices) => {
                const mappedVoices = voices.map(voice => {
                    return {
                        name: voice.name,
                        lang: voice.lang,
                    };
                });

                return mappedVoices;
            });
    }
);

// TODO: check if there are any voices installed, alert user if not.
// checkVoices() {
//     return this.getSynthesizer()
//         .then((synthesizer) => {
//             log("Start", "Voices check");
//
//             return getMappedVoices()
//                 .then((voices) => {
//                     log("Variable", "voices[]", voices.length, voices);
//
//                     log("Done", "Voices check");
//
//                     return synthesizer;
//                 });
//         });
// }
