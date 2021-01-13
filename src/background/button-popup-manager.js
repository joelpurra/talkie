/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

export default class ButtonPopupManager {
    constructor(translator, metadataManager) {
        this.translator = translator;
        this.metadataManager = metadataManager;
    }

    _getExtensionShortName() {
        return promiseTry(
            () => this.metadataManager.isPremiumEdition()
                .then((isPremiumEdition) => {
                    // TODO: move resolving the name to a layer on top of the translator?
                    const extensionShortName = isPremiumEdition
                        ? this.translator.translate("extensionShortName_Premium")
                        : this.translator.translate("extensionShortName_Free");

                    return extensionShortName;
                }),
        );
    }

    _getButtonDefaultTitle() {
        return promiseTry(
            () => this._getExtensionShortName()
                .then((extensionShortName) => this.translator.translate("buttonDefaultTitle", [extensionShortName])),
        );
    }

    _getButtonStopTitle() {
        return promiseTry(
            () => this.translator.translate("buttonStopTitle"),
        );
    }

    _disablePopupSync(buttonStopTitle) {
        const disablePopupOptions = {
            popup: "",
        };

        browser.browserAction.setPopup(disablePopupOptions);

        const disableIconTitleOptions = {
            title: buttonStopTitle,
        };

        browser.browserAction.setTitle(disableIconTitleOptions);
    }

    _enablePopupSync(buttonDefaultTitle) {
        const enablePopupOptions = {
            popup: "src/popup/popup.html",
        };

        browser.browserAction.setPopup(enablePopupOptions);

        const enableIconTitleOptions = {
            title: buttonDefaultTitle,
        };

        browser.browserAction.setTitle(enableIconTitleOptions);
    }

    disablePopup() {
        return promiseTry(
            /* eslint-disable no-sync */
            () => this._getButtonStopTitle()
                .then((buttonStopTitle) => this._disablePopupSync(buttonStopTitle)),
            /* eslint-enable no-sync */
        );
    }

    enablePopup() {
        return promiseTry(
            /* eslint-disable no-sync */
            () => this._getButtonDefaultTitle()
                .then((buttonDefaultTitle) => this._enablePopupSync(buttonDefaultTitle)),
            /* eslint-enable no-sync */
        );
    }
}
