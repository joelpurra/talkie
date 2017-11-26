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
        navigatorLanguages: state.shared.voices.navigatorLanguages,
        sampleText: state.shared.voices.sampleText,
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        osType: state.shared.metadata.osType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class VoicesContainer extends React.Component {
    componentDidMount() {
        // TODO: is this the best place to load data?
        this.props.actions.sharedVoices.loadVoices();
        this.props.actions.sharedVoices.loadSampleText();
        this.props.actions.sharedVoices.loadNavigatorLanguages();
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
        navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        sampleText: PropTypes.string,
        isPremiumVersion: PropTypes.bool.isRequired,
        osType: PropTypes.string,
    }

    render() {
        const {
            actions,
            isPremiumVersion,
            osType,
            languages,
            navigatorLanguages,
            sampleText,
            voices,
        } = this.props;

        return (
            <Voices
                actions={actions}
                voices={voices}
                languages={languages}
                navigatorLanguages={navigatorLanguages}
                sampleText={sampleText}
                isPremiumVersion={isPremiumVersion}
                osType={osType}
            />
        );
    }
}
