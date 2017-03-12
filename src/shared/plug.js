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

const executePlug = () => promiseTry(
    () => {
        return Promise.resolve()
            .then(() => executeLogToPageWithColor("Thank you for using Talkie!"))
            .then(() => executeLogToPageWithColor("https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk"))
            .then(() => executeLogToPageWithColor("Created by Joel Purra. Released under GNU General Public License version 3.0 (GPL-3.0)"))
            .then(() => executeLogToPageWithColor("https://joelpurra.com/"))
            .then(() => executeLogToPageWithColor("If you like Talkie, send a link to your friends -- and consider donating to support further open source development."))
            .then(() => executeLogToPageWithColor("https://joelpurra.com/donate/"));
    }
);

const executeGetTalkieWasPluggedCode = "window.talkieWasPlugged;";
const executeGetTalkieWasPlugged = () => executeScriptInTopFrame(executeGetTalkieWasPluggedCode);

const executeSetTalkieWasPluggedCode = "window.talkieWasPlugged = true;";
const executeSetTalkieWasPlugged = () => executeScriptInTopFrame(executeSetTalkieWasPluggedCode);

const executePlugOnce = () => {
    return executeGetTalkieWasPlugged()
        .then((talkieWasPlugged) => {
            if (talkieWasPlugged && talkieWasPlugged.toString() !== "true") {
                return executePlug()
                    .then(() => executeSetTalkieWasPlugged());
            }

            return true;
        });
};
