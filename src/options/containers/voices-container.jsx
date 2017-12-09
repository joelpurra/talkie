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

import {
    bindActionCreators,
} from "redux";

import {
    connect,
} from "react-redux";

import Voices from "../components/sections/voices.jsx";

import actionCreators from "../actions";

import {
    getLanguagesFromVoices,
} from "../../shared/utils/transform-voices";

const mapStateToProps = (state) => {
    return {
        voices: state.shared.voices.voices,
        languages: getLanguagesFromVoices(state.shared.voices.voices),
        selectedLanguageCode: state.voices.selectedLanguageCode,
        selectedVoiceName: state.voices.selectedVoiceName,
        effectiveVoiceNameForSelectedLanguage: state.voices.effectiveVoiceNameForSelectedLanguage,
        sampleText: state.voices.sampleText,
        rateForSelectedVoice: state.voices.rateForSelectedVoice,
        pitchForSelectedVoice: state.voices.pitchForSelectedVoice,
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            voices: bindActionCreators(actionCreators.voices, dispatch),
            sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class VoicesContainer extends React.PureComponent {
    componentDidMount() {
        // TODO: is this the best place to load data?
        this.props.actions.sharedVoices.loadVoices();
        this.props.actions.voices.loadSampleText();
    }

    static propTypes = {
        actions: PropTypes.object.isRequired,
        voices: PropTypes.arrayOf(PropTypes.shape({
            default: PropTypes.bool.isRequired,
            lang: PropTypes.string.isRequired,
            localService: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            voiceURI: PropTypes.string.isRequired,
        })).isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        selectedLanguageCode: PropTypes.string,
        selectedVoiceName: PropTypes.string,
        effectiveVoiceNameForSelectedLanguage: PropTypes.string,
        sampleText: PropTypes.string,
        rateForSelectedVoice: PropTypes.number.isRequired,
        pitchForSelectedVoice: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
    }

    render() {
        const {
            actions,
            voices,
            languages,
            selectedLanguageCode,
            selectedVoiceName,
            effectiveVoiceNameForSelectedLanguage,
            sampleText,
            rateForSelectedVoice,
            pitchForSelectedVoice,
            isPremiumVersion,
        } = this.props;

        return (
            <Voices
                actions={actions}
                voices={voices}
                languages={languages}
                selectedLanguageCode={selectedLanguageCode}
                selectedVoiceName={selectedVoiceName}
                effectiveVoiceNameForSelectedLanguage={effectiveVoiceNameForSelectedLanguage}
                sampleText={sampleText}
                rateForSelectedVoice={rateForSelectedVoice}
                pitchForSelectedVoice={pitchForSelectedVoice}
                isPremiumVersion={isPremiumVersion}
            />
        );
    }
}
