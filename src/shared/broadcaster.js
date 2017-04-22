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
    logError,
} from "../shared/log";

import {
    promiseTry,
} from "../shared/promise";

export default class Broadcaster {
    constructor() {
        this.actionRespondingMap = {};
        this.actionListeningMap = {};
    }

    registerRespondingAction(actionName, respondingActionHandler) {
        return promiseTry(
            () => {
                if (this.actionRespondingMap[actionName]) {
                    throw new Error("Only one responding handler allowed at the moment: " + actionName);
                }

                this.actionRespondingMap[actionName] = respondingActionHandler;
            }
        );
    }

    registerListeningAction(actionName, listeningActionHandler) {
        return promiseTry(
            () => {
                this.actionListeningMap[actionName] = (this.actionListeningMap[actionName] || []).concat(listeningActionHandler);
            }
        );
    }

    broadcastEvent(actionName, actionData) {
        return new Promise(
            (resolve, reject) => {
                try {
                    // logDebug("Start", "Sending message", actionName, actionData);

                    const respondingAction = this.actionRespondingMap[actionName] || null;
                    const listeningActions = this.actionListeningMap[actionName] || [];

                    if (respondingAction === null && listeningActions.length === 0) {
                        // NOTE: there was no matching action registered.
                        // throw new Error("There was no matching action: " + actionName);

                        return resolve(undefined);
                    }

                    listeningActions.forEach((listeningAction) => {
                        listeningAction(actionName, actionData);
                    });

                    let respondingActionResult = null;
                    let respondingActionError = null;

                    if (respondingAction) {
                        respondingAction(actionName, actionData)
                            .then((result) => {
                                respondingActionResult = result;

                                return result;
                            })
                            .catch((error) => {
                                respondingActionError = error;

                                throw error;
                            });
                    }

                    if (respondingActionError) {
                        return reject(respondingActionError);
                    }

                    return resolve(respondingActionResult);
                } catch (error) {
                    logError("Error", "catch", "Sending message", actionName, actionData);

                    return reject(error);
                }
            }
        );
    }
}
