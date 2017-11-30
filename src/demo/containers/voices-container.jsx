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
    getLanguageGroupsFromLanguages,
    getLanguagesFromVoices,
} from "../../shared/utils/transform-voices";

// TODO: use a HOC or something else?
import TalkieLocaleHelper from "../../shared/talkie-locale-helper";

const talkieLocaleHelper = new TalkieLocaleHelper();

const mapStateToProps = (state) => {
    const languages = getLanguagesFromVoices(state.shared.voices.voices);
    const languageGroups = getLanguageGroupsFromLanguages(languages);

    return {
        voices: state.shared.voices.voices,
        navigatorLanguages: state.shared.voices.navigatorLanguages,
        voicesCount: state.shared.voices.voices.length,
        languagesCount: languages.length,
        languageGroupsCount: languageGroups.length,
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
    static propTypes = {
        actions: PropTypes.object.isRequired,
        voices: PropTypes.arrayOf(PropTypes.shape({
            default: PropTypes.bool.isRequired,
            lang: PropTypes.string.isRequired,
            localService: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            voiceURI: PropTypes.string.isRequired,
        })).isRequired,
        navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
    }

    render() {
        const {
            actions,
            languageGroupsCount,
            languagesCount,
            navigatorLanguages,
            voices,
            voicesCount,
        } = this.props;

        return (
            <Voices
                actions={actions}
                voices={voices}
                navigatorLanguages={navigatorLanguages}
                voicesCount={voicesCount}
                languagesCount={languagesCount}
                languageGroupsCount={languageGroupsCount}
                talkieLocaleHelper={talkieLocaleHelper}
            />
        );
    }
}
