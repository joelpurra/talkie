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

import translateAttribute from "../../../../shared/hocs/translate.jsx";

import * as tableBase from "../../../../shared/styled/table/table-base.jsx";
import * as formBase from "../../../../shared/styled/form/form-base.jsx";

import Checkbox from "../../../../shared/components/form/checkbox.jsx";

@translateAttribute
export default class SpeakLongTexts extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
        speakLongTexts: false,
        disabled: true,
    };

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        speakLongTexts: PropTypes.bool.isRequired,
        disabled: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
    };

    handleChange(speakLongTexts) {
        this.props.onChange(speakLongTexts);
    }

    render() {
        const {
            speakLongTexts,
            disabled,
            translate,
        } = this.props;

        return (
            <tableBase.tbody>
                <tableBase.tr>
                    <tableBase.th scope="col">
                        {translate("frontend_voicesSpeakLongTextsHeading")}
                    </tableBase.th>
                </tableBase.tr>
                <tableBase.tr>
                    <tableBase.td>
                        <p>
                            {translate("frontend_voicesSpeakLongTextsExplanation01")}
                        </p>
                        <p>
                            {translate("frontend_voicesSpeakLongTextsExplanation02")}
                        </p>
                        <p>
                            <label>
                                <Checkbox
                                    checked={speakLongTexts}
                                    onChange={this.handleChange}
                                    disabled={disabled}
                                />
                                {" "}
                                {translate("frontend_voicesSpeakLongTextsLabel")}
                            </label>
                        </p>
                    </tableBase.td>
                </tableBase.tr>
            </tableBase.tbody>
        );
    }
}
