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

import Welcome from "../components/sections/welcome.jsx";

import actionCreators from "../actions";

import {
    getLanguageGroupsFromLanguages,
    getLanguagesFromVoices,
} from "../../shared/utils/transform-voices";

// TODO: use a HOC or something else?
import TalkieLocaleHelper from "../../shared/talkie-locale-helper";

// TODO: use a HOC or something else?
import LocaleProvider from "../../split-environments/locale-provider";

const talkieLocaleHelper = new TalkieLocaleHelper();
const localeProvider = new LocaleProvider();

const mapStateToProps = (state) => {
    const languages = getLanguagesFromVoices(state.shared.voices.voices);
    const languageGroups = getLanguageGroupsFromLanguages(languages);

    return {
        languages: languages,
        languageGroups: languageGroups,
        navigatorLanguages: state.shared.voices.navigatorLanguages,
        voicesCount: state.shared.voices.voices.length,
        languagesCount: languages.length,
        languageGroupsCount: languageGroups.length,
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        systemType: state.shared.metadata.systemType,
        osType: state.shared.metadata.osType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            sharedSpeaking: bindActionCreators(actionCreators.shared.speaking, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class WelcomeContainer extends React.Component {
    static defaultProps = {
        isPremiumVersion: false,
        systemType: false,
        osType: false,
        // voices:[],
        languages: [],
        languageGroups: [],
        navigatorLanguages: [],
        voicesCount: 0,
        languagesCount: 0,
        languageGroupsCount: 0,
        speakTextInLanguageWithOverrides: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        // voices: PropTypes.arrayOf(PropTypes.shape({
        //     default: PropTypes.bool.isRequired,
        //     lang: PropTypes.string.isRequired,
        //     localService: PropTypes.bool.isRequired,
        //     name: PropTypes.string.isRequired,
        //     voiceURI: PropTypes.string.isRequired,
        // })).isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
    }

    render() {
        const {
            actions,
            isPremiumVersion,
            systemType,
            osType,
            voicesCount,
            languagesCount,
            languageGroupsCount,
            languages,
            languageGroups,
            navigatorLanguages,
        } = this.props;

        const availableBrowserLanguageWithInstalledVoice = []
            .concat(navigatorLanguages.filter((navigatorLanguage) => languages.includes(navigatorLanguage)))
            .concat(navigatorLanguages.filter((navigatorLanguage) => languageGroups.includes(navigatorLanguage)));

        const availableBrowserLanguageWithInstalledVoiceAndSampleText = availableBrowserLanguageWithInstalledVoice
            .filter((languageCode) => {
                /* eslint-disable no-sync */
                return !!talkieLocaleHelper.getSampleTextSync(languageCode);
                /* eslint-enable no-sync */
            });

        const firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText = availableBrowserLanguageWithInstalledVoiceAndSampleText[0] || null;

        const sampleTextLanguageCode = firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText || null;
        let sampleText = null;

        if (sampleTextLanguageCode) {
            /* eslint-disable no-sync */
            sampleText = talkieLocaleHelper.getSampleTextSync(firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText);
            /* eslint-enable no-sync */
        }

        const translationLocale = localeProvider.getTranslationLocale();
        const canSpeakInTranslatedLocale = languages.includes(translationLocale) || languageGroups.includes(translationLocale);

        return (
            <Welcome
                isPremiumVersion={isPremiumVersion}
                systemType={systemType}
                osType={osType}
                voicesCount={voicesCount}
                languagesCount={languagesCount}
                languageGroupsCount={languageGroupsCount}
                canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
                sampleTextLanguageCode={sampleTextLanguageCode}
                sampleText={sampleText}
                speakTextInLanguageWithOverrides={actions.sharedSpeaking.speakTextInLanguageWithOverrides}
            />
        );
    }
}
