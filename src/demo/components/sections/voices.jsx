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

// TODO: proper data handling.
import {
    getLanguageForVoiceNameFromVoices,
    getLanguageGroupsFromLanguages,
    getVoicesByLanguagesByLanguageGroupFromVoices,
} from "../../../shared/utils/transform-voices";

import LanguageHelper from "../../../shared/language-helper";

import styled from "../../../shared/hocs/styled.jsx";

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";

import Icon from "../../../shared/components/icon/icon.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";

import translateAttribute from "../../../shared/hocs/translate.jsx";

const languageHelper = new LanguageHelper();

@translateAttribute
export default class Voices extends React.Component {
    constructor(props) {
        super(props);

        this.handleSpeakClickForLanguage = this.handleSpeakClickForLanguage.bind(this);
        this.handleSpeakClickForVoice = this.handleSpeakClickForVoice.bind(this);

        this.styled = {
            summaryH3: styled({
                display: "inline-block",
                margin: 0,
                marginTop: 0,
                marginBottom: 0,
                padding: "0.5em",
            })(textBase.h3),

            hr: styled({
                marginLeft: 0,
                marginRight: 0,
            })(layoutBase.hr),

            clickableLi: styled({
                cursor: "pointer",
            })(listBase.li),
        };

        this.styled.clickableNoBulletLi = styled({
            listStyle: "none",
            marginLeft: "-2em",
        })(this.styled.clickableLi);
    }

    static defaultProps = {
        actions: {},
        voices: [],
        languages: [],
        navigatorLanguages: [],
        isPremiumVersion: false,
        osType: null,
        sampleText: null,
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
        navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        osType: PropTypes.string,
        sampleText: PropTypes.string.isRequired,
        translate: PropTypes.func.isRequired,
    }

    getSampleTextForLanguage(languageCode) {
        /* eslint-disable no-sync */
        return languageHelper.getSampleTextSync(languageCode);
        /* eslint-enable no-sync */
    }

    getSampleTextForVoicename(voiceName) {
        const voices = this.props.voices;
        const voice = getLanguageForVoiceNameFromVoices(voices, voiceName);
        const languageCode = voice.lang;

        /* eslint-disable no-sync */
        return languageHelper.getSampleTextSync(languageCode);
        /* eslint-enable no-sync */
    }

    getTextDirectionForLanguageGroup(languageGroup) {
        /* eslint-disable no-sync */
        return languageHelper.getBidiDirectionSync(languageGroup);
        /* eslint-enable no-sync */
    }

    getTextDirectionClassNameForLanguageGroup(languageGroup) {
        const direction = this.getTextDirectionForLanguageGroup(languageGroup);
        let className = null;

        switch (direction) {
        case "ltr":
            className = "text-direction-ltr";
            break;
        case "rtl":
            className = "text-direction-rtl";
            break;
        default:
            throw new Error("Unknown text direction");
        }

        return className;
    }

    handleSpeakClickForLanguage(languageCode, e) {
        e.preventDefault();
        e.stopPropagation();

        const text = this.getSampleTextForLanguage(languageCode);
        const voice = {
            lang: languageCode,
            // name: null,
            // rate: ...,
            // pitch: ...,
        };

        this.props.actions.sharedVoices.speak(text, voice);

        return false;
    }

    handleSpeakClickForVoice(voiceName, e) {
        e.preventDefault();
        e.stopPropagation();

        const text = this.getSampleTextForVoicename(voiceName);
        const voice = {
            // lang: null,
            name: voiceName,
            // rate: ...,
            // pitch: ...,
        };

        this.props.actions.sharedVoices.speak(text, voice);

        return false;
    }

    getVoicesListItems(voices, showCode) {
        return voices.map((voice) => {
            let voiceNameAndFeaturesText = voice.name;

            const voiceFeatures = [];

            if (showCode) {
                voiceFeatures.push(voice.lang);
            }

            if (voice.localService === false) {
                // TODO: translate.
                voiceFeatures.push("online");
            }

            if (voiceFeatures.length > 0) {
                voiceNameAndFeaturesText += " (";
                voiceNameAndFeaturesText += voiceFeatures.join(", ");
                voiceNameAndFeaturesText += ")";
            }

            return (
                <this.styled.clickableNoBulletLi
                    key={voice.name}
                    onClick={this.handleSpeakClickForVoice.bind(null, voice.name)}
                >
                    <Icon className="icon-voices" />
                    {voiceNameAndFeaturesText}
                </this.styled.clickableNoBulletLi>
            );
        });
    }

    getVoicesListItemsWithCode(voices) {
        return this.getVoicesListItems(voices, true);
    }

    getVoicesListItemsWithoutCode(voices) {
        return this.getVoicesListItems(voices, false);
    }

    getLanguagesListItems(languages) {
        return languages.map((language) =>
            <this.styled.clickableLi
                key={language}
                onClick={this.handleSpeakClickForLanguage.bind(null, language)}
            >
                {language}
            </this.styled.clickableLi>
        );
    }

    getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroupFromVoices, languagesPerGroup, languagesFilter, languageGroup) {
        const filteredLanguagesPerGroup = languagesPerGroup
            .filter((language) => !languagesFilter || languagesFilter.includes(language));

        return filteredLanguagesPerGroup.map((language) => {
            const voicesPerLanguage = voicesByLanguagesByLanguageGroupFromVoices[languageGroup][language];

            return (
                <this.styled.clickableLi
                    key={language}
                    onClick={this.handleSpeakClickForLanguage.bind(null, language)}
                >
                    {language}
                    <listBase.ul>
                        {this.getVoicesListItemsWithoutCode(voicesPerLanguage)}
                    </listBase.ul>
                </this.styled.clickableLi>
            );
        });
    }

    getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voices, languagesFilter) {
        const languageGroupsFilter = (languagesFilter && getLanguageGroupsFromLanguages(languagesFilter)) || null;
        const voicesByLanguagesByLanguageGroupFromVoices = getVoicesByLanguagesByLanguageGroupFromVoices(voices);

        const languageGroups = Object.keys(voicesByLanguagesByLanguageGroupFromVoices);
        languageGroups.sort();

        const filteredLanguageGroups = languageGroups
            .filter((languageGroup) => !languageGroupsFilter || languageGroupsFilter.includes(languageGroup));

        return filteredLanguageGroups
            .map((languageGroup, index) =>
            {
                const languagesPerGroup = Object.keys(voicesByLanguagesByLanguageGroupFromVoices[languageGroup]);
                languagesPerGroup.sort();

                return (
                    <div
                        key={languageGroup}>
                        <layoutBase.details>
                            <layoutBase.summary>
                                <this.styled.summaryH3>
                                    {languageGroup}
                                </this.styled.summaryH3>
                            </layoutBase.summary>

                            <textBase.blockquote
                                className={this.getTextDirectionClassNameForLanguageGroup(languageGroup)}
                                onClick={this.handleSpeakClickForLanguage.bind(null, languageGroup)}
                            >
                                {this.getSampleTextForLanguage(languageGroup)}
                            </textBase.blockquote>

                            <listBase.ul>
                                {this.getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroupFromVoices, languagesPerGroup, languagesFilter, languageGroup)}
                            </listBase.ul>
                        </layoutBase.details>

                        {((index + 1) < filteredLanguageGroups.length) && <this.styled.hr />}
                    </div>
                );
            }
            );
    }

    render() {
        const {
            osType,
            isPremiumVersion,
            languages,
            navigatorLanguages,
            sampleText,
            translate,
            voices,
        } = this.props;

        const voicesCount = voices.length;
        const languagesCount = languages.length;

        const languageGroups = getLanguageGroupsFromLanguages(languages);
        const languageGroupsCount = languageGroups.length;

        return (
            <section>
                <textBase.p>
                    {translate("frontend_voicesDescription")}
                </textBase.p>

                <PremiumSection>
                    {/* TODO: translate */}
                    Change voice setting with Talkie Premium
                </PremiumSection>

                <textBase.h2>
                    {/* TODO: translate */}
                    Your preferred browser languages
                </textBase.h2>

                {this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voices, navigatorLanguages)}

                <textBase.h2>
                    {/* TODO: translate */}
                    All Installed languages ({languageGroupsCount}), dialects ({languagesCount}), and voices ({voicesCount})
                </textBase.h2>

                {this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voices, null)}
            </section>
        );
    }
}
