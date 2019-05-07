/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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

import styled from "../../../../shared/hocs/styled.jsx";

import * as formBase from "../../../../shared/styled/form/form-base.jsx";

import MultilineSelect from "../../../../shared/components/form/multiline-select.jsx";

import translateAttribute from "../../../../shared/hocs/translate.jsx";

@translateAttribute
export default class AvailableVoices extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.styled = {
            effectiveVoiceOption: styled({
                fontWeight: "bold",
            })(formBase.option),
        };
    }

    static defaultProps = {
        voices: [],
        value: null,
        effectiveVoiceNameForSelectedLanguage: null,
        disabled: true,
    };

    static propTypes = {
        voices: PropTypes.arrayOf(PropTypes.shape({
            default: PropTypes.bool.isRequired,
            lang: PropTypes.string.isRequired,
            localService: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            voiceURI: PropTypes.string.isRequired,
        })).isRequired,
        value: PropTypes.string,
        effectiveVoiceNameForSelectedLanguage: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        disabled: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
    };

    handleChange(voiceName) {
        this.props.onChange(voiceName);
    }

    render() {
        const {
            translate,
        } = this.props;

        const translatedVoiceFeatureOnline = translate("frontend_voiceFeatureOnline");

        const voicesOptions = this.props.voices.map(
            (voice) => {
                const isEffectiveVoiceNameForSelectedLanguage = (
                    this.props.effectiveVoiceNameForSelectedLanguage
                    && this.props.effectiveVoiceNameForSelectedLanguage === voice.name
                );

                const VoiceOption = isEffectiveVoiceNameForSelectedLanguage ? this.styled.effectiveVoiceOption : formBase.option;

                let voiceNameAndFeaturesText = voice.name;

                const voiceFeatures = [];

                if (voice.localService === false) {
                    voiceFeatures.push(translatedVoiceFeatureOnline);
                }

                if (voiceFeatures.length > 0) {
                    voiceNameAndFeaturesText += " (";
                    voiceNameAndFeaturesText += voiceFeatures.join(", ");
                    voiceNameAndFeaturesText += ")";
                }

                if (isEffectiveVoiceNameForSelectedLanguage) {
                    voiceNameAndFeaturesText += " ✓";
                }

                return <VoiceOption
                    key={voice.name}
                    // TODO: proper way to store/look up objects?
                    value={voice.name}
                >
                    {voiceNameAndFeaturesText}
                </VoiceOption>;
            }
        );

        return (
            <MultilineSelect
                size={7}
                onChange={this.handleChange}
                value={this.props.value}
                disabled={this.props.disabled}
            >
                {voicesOptions}
            </MultilineSelect>
        );
    }
}
