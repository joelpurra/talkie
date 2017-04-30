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
    logDebug,
    logError,
} from "../shared/log";

export const loggedPromise = (...args) => {
    const fn = args.pop();

    return (...fnArgs) => {
        return Promise.resolve()
            .then(() => {
                logDebug("Start", "loggedPromise", ...args, ...fnArgs);

                return undefined;
            })
            .then(() => fn(...fnArgs))
            .then((result) => {
                logDebug("Done", "loggedPromise", ...args, ...fnArgs, result);

                return result;
            })
            .catch((error) => {
                logError("loggedPromise", ...args, ...fnArgs, error);

                throw error;
            });
    };
};
