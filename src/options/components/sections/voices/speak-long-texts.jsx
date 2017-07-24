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
export default class SpeakLongTexts extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        checked: null,
        disabled: true,
    };

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        checked: PropTypes.string,
        disabled: PropTypes.bool,
        translate: PropTypes.func.isRequired,
    };

    handleChange(e) {
        const checked = e.target.checked === true;

        this.props.onChange(checked);
    }

    render() {
        return (
            <tbody>
                <tr>
                    <th scope="col">{this.props.translate("frontend_voicesSpeakLongTextsHeading")}</th>
                </tr>
                <tr>
                    <p>{this.props.translate("frontend_voicesSpeakLongTextsExplanation01")}</p>
                    <p>{this.props.translate("frontend_voicesSpeakLongTextsExplanation02")}</p>
                    <p>
                        <label>
                            <input
                                type="checkbox"
                                checked={this.props.checked}
                                onChange={this.handleChange}
                                disabled={this.props.disabled}
                            />
                            {" "}
                            {this.props.translate("frontend_voicesSpeakLongTextsLabel")}
                        </label>
                    </p>
                </tr>
            </tbody>
        );
    }
}
