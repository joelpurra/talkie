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

import About from "../components/sections/about.jsx";

import actionCreators from "../actions";
import selectors from "../selectors";

const mapStateToProps = (state) => {
    return {
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        versionName: state.shared.metadata.versionName,
        systemType: state.shared.metadata.systemType,
        osType: state.shared.metadata.osType,
        voices: selectors.shared.voices.getVoices(state),
        languages: selectors.shared.voices.getLanguages(state),
        languageGroups: selectors.shared.voices.getLanguageGroups(state),
        navigatorLanguage: state.shared.voices.navigatorLanguage,
        navigatorLanguages: selectors.shared.voices.getNavigatorLanguages(state),
        translatedLanguages: state.shared.voices.translatedLanguages,
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
export default class AboutContainer extends React.PureComponent {
    componentDidMount() {
        // TODO: is this the best place to load data?
        this.props.actions.sharedVoices.loadVoices();
        this.props.actions.sharedVoices.loadNavigatorLanguage();
        this.props.actions.sharedVoices.loadNavigatorLanguages();
    }

    static defaultProps = {
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
        voices: [],
        languages: [],
        languageGroups: [],
        navigatorLanguage: null,
        navigatorLanguages: [],
        translatedLanguages: [],
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        voices: PropTypes.arrayOf(PropTypes.shape({
            default: PropTypes.bool.isRequired,
            lang: PropTypes.string.isRequired,
            localService: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            voiceURI: PropTypes.string.isRequired,
        })).isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        navigatorLanguage: PropTypes.string,
        navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        translatedLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        onLicenseClick: PropTypes.func.isRequired,
    }

    render() {
        const {
            isPremiumVersion,
            versionName,
            systemType,
            osType,
            navigatorLanguage,
            navigatorLanguages,
            translatedLanguages,
            onLicenseClick,
            voices,
            languages,
            languageGroups,
        } = this.props;

        return (
            <About
                isPremiumVersion={isPremiumVersion}
                versionName={versionName}
                systemType={systemType}
                osType={osType}
                voices={voices}
                languages={languages}
                languageGroups={languageGroups}
                navigatorLanguage={navigatorLanguage}
                navigatorLanguages={navigatorLanguages}
                translatedLanguages={translatedLanguages}
                onLicenseClick={onLicenseClick}
            />
        );
    }
}
