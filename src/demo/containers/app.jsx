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

import Main from "../components/main.jsx";

import actionCreators from "../actions";

import {
    getLanguageGroupsFromLanguages,
    getLanguagesFromVoices,
} from "../../shared/utils/transform-voices";

const mapStateToProps = (state) => {
    const languages = getLanguagesFromVoices(state.shared.voices.voices);
    const languageGroups = getLanguageGroupsFromLanguages(languages);

    return {
        voices: state.shared.voices.voices,
        languages: languages,
        voicesCount: state.shared.voices.voices.length,
        languagesCount: languages.length,
        languageGroupsCount: languageGroups.length,
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        versionNumber: state.shared.metadata.versionNumber,
        systemType: state.shared.metadata.systemType,
        osType: state.shared.metadata.osType,
        activeTabId: state.unshared.navigation.activeTabId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            sharedSpeaking: bindActionCreators(actionCreators.shared.speaking, dispatch),
            sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
            sharedMetadata: bindActionCreators(actionCreators.shared.metadata, dispatch),
            sharedNavigation: bindActionCreators(actionCreators.shared.navigation, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component {
    static defaultProps = {
        voices: [],
        languages: [],
        voicesCount: 0,
        languagesCount: 0,
        languageGroupsCount: 0,
        isPremiumVersion: false,
        versionNumber: null,
        systemType: null,
        osType: null,
        activeTabId: null,
    };

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
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionNumber: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        activeTabId: PropTypes.string.isRequired,
    }

    render() {
        const {
            actions,
            voices,
            languages,
            voicesCount,
            languagesCount,
            languageGroupsCount,
            isPremiumVersion,
            versionNumber,
            systemType,
            osType,
            activeTabId,
        } = this.props;

        return (
            <Main
                actions={actions}
                voices={voices}
                languages={languages}
                voicesCount={voicesCount}
                languagesCount={languagesCount}
                languageGroupsCount={languageGroupsCount}
                isPremiumVersion={isPremiumVersion}
                versionNumber={versionNumber}
                systemType={systemType}
                osType={osType}
                activeTabId={activeTabId}
            />
        );
    }
}
