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

// TODO: move to a file?
// TODO: read from manifest.json?
// TODO: allow overrides?
const configuration = {
    urls: {
        options: "chrome://extensions?options=enfbcfmmdpdminapkflljhbfeejjhjjk",
        main: "https://github.com/joelpurra/talkie",
        chromewebstore: "https://chrome.google.com/webstore/detail/talkie/enfbcfmmdpdminapkflljhbfeejjhjjk",
        donate: "https://joelpurra.com/donate",
    },
};

const extensionShortName = chrome.i18n.getMessage("extensionShortName");

const uiLocale = chrome.i18n.getMessage("@@ui_locale");
const messagesLocale = chrome.i18n.getMessage("extensionLocale");
