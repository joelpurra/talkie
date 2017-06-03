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

export default class Plug {
    constructor(contentLogger, execute, configuration) {
        this.contentLogger = contentLogger;
        this.execute = execute;
        this.configuration = configuration;

        this.executeGetTalkieWasPluggedCode = "(function(){ return window.talkieWasPlugged; }());";
        this.executeSetTalkieWasPluggedCode = "(function(){ window.talkieWasPlugged = true; }());";
    }

    executePlug() {
        return promiseTry(
            () => {
                return Promise.resolve()
                    // TODO: premium version of the same message?
                    .then(() => this.contentLogger.logToPageWithColor("Thank you for using Talkie!"))
                    .then(() => this.contentLogger.logToPageWithColor("https://joelpurra.com/projects/talkie/"))
                    .then(() => this.contentLogger.logToPageWithColor("Created by Joel Purra. Released under GNU General Public License version 3.0 (GPL-3.0)"))
                    .then(() => this.contentLogger.logToPageWithColor("https://joelpurra.com/"))
                    .then(() => this.contentLogger.logToPageWithColor("If you like Talkie, send a link to your friends -- and consider upgrading to Talkie Premium to support further open source development."));
            }
        );
    }

    executeGetTalkieWasPlugged() {
        return this.execute.scriptInTopFrameWithTimeout(this.executeGetTalkieWasPluggedCode, 1000);
    }

    executeSetTalkieWasPlugged() {
        return this.execute.scriptInTopFrameWithTimeout(this.executeSetTalkieWasPluggedCode, 1000);
    }

    once() {
        return this.executeGetTalkieWasPlugged()
            .then((talkieWasPlugged) => {
                if (talkieWasPlugged && talkieWasPlugged.toString() !== "true") {
                    return this.executePlug()
                        .then(() => this.executeSetTalkieWasPlugged());
                }

                return undefined;
            });
    }
}
