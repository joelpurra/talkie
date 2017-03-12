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

/* global
api:false,
chrome:false,
*/

const buttonDefaultTitle = chrome.i18n.getMessage("buttonDefaultTitle");
const buttonStopTitle = chrome.i18n.getMessage("buttonStopTitle");

const disablePopup = () => {
    const disablePopupOptions = {
        popup: "",
    };

    chrome.browserAction.setPopup(disablePopupOptions);

    const disableIconTitleOptions = {
        title: buttonStopTitle,
    };

    chrome.browserAction.setTitle(disableIconTitleOptions);
};

const enablePopup = () => {
    const enablePopupOptions = {
        popup: "src/popup/popup.html",
    };

    chrome.browserAction.setPopup(enablePopupOptions);

    const enableIconTitleOptions = {
        title: buttonDefaultTitle,
    };

    chrome.browserAction.setTitle(enableIconTitleOptions);
};

api.buttonPopup = {
    disablePopup,
    enablePopup,
};
