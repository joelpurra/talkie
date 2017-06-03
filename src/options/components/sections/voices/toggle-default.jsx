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

import React from "react";
import PropTypes from "prop-types";

import translate from "../../../hocs/translate.jsx";

@translate
export default class ToggleDefault extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    static defaultProps = {
        languageCode: null,
        voiceName: null,
        disabled: true,
    };

    static propTypes = {
        onClick: PropTypes.func.isRequired,
        languageCode: PropTypes.string,
        voiceName: PropTypes.string,
        disabled: PropTypes.bool,
        translate: PropTypes.func.isRequired,
    };

    handleClick(/* eslint-disable no-unused-vars */e/* eslint-enable no-unused-vars */) {
        this.props.onClick();
    }

    render() {
        let buttonText = null;

        if (this.props.languageCode === null || this.props.voiceName === null) {
            buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageEmptySelection");
        } else {
            const messageDetailsPlaceholders = [this.props.languageCode, this.props.voiceName];

            buttonText = browser.i18n.getMessage("frontend_voicesSetAsLanguageUseVoiceAsDefault", messageDetailsPlaceholders);
        }

        return (
            <tbody>
                <tr>
                    <td>
                        <button
                            disabled={this.props.disabled}
                            onClick={this.handleClick}
                        >
                            {buttonText}
                        </button>
                    </td>
                </tr>
            </tbody>
        );
    }
}
