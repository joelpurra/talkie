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
    promiseTry,
} from "../shared/promise";

import {
    logDebug,
} from "../shared/log";

export default class OnlyLastCaller {
    constructor() {
        this.lastCallerId = 0;
    }

    incrementCallerId() {
        this.lastCallerId++;
    }

    getShouldContinueSpeakingProvider() {
        this.incrementCallerId();
        const callerOnTheAirId = this.lastCallerId;

        logDebug("Start", "getShouldContinueSpeakingProvider", callerOnTheAirId);

        return () => promiseTry(
            () => {
                const isLastCallerOnTheAir = callerOnTheAirId === this.lastCallerId;

                logDebug("Status", "getShouldContinueSpeakingProvider", callerOnTheAirId, isLastCallerOnTheAir);

                return isLastCallerOnTheAir;
            }
        );
    };
}
