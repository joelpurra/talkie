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

import SpeakLongTexts from "./text/speak-long-texts.jsx";

export default class Text extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleSpeakLongTextsChange = this.handleSpeakLongTextsChange.bind(this);
    }

    static defaultProps = {
        speakLongTexts: false,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        speakLongTexts: PropTypes.bool.isRequired,
    }

    handleSpeakLongTextsChange(speakLongTexts) {
        this.props.actions.sharedVoices.storeSpeakLongTexts(speakLongTexts);
    }

    render() {
        const {
            speakLongTexts,
        } = this.props;
        return (
            <section>
                <SpeakLongTexts
                    onChange={this.handleSpeakLongTextsChange}
                    speakLongTexts={speakLongTexts}
                    disabled={false}
                />
            </section>
        );
    }
}
