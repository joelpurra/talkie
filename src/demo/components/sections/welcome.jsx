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

import configureAttribute from "../../../shared/hocs/configure.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import styled from "../../../shared/hocs/styled.jsx";

import * as textBase from "../../../shared/styled/text/text-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import HeroVersionSection from "../../../shared/components/hero-section/hero-version-section.jsx";
import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";
import SharingIcons from "../../../shared/components/sharing/sharing-icons.jsx";

@configureAttribute
@translateAttribute
export default class Welcome extends React.Component {
    constructor(props) {
        super(props);

        this.playWelcomeMessage = this.playWelcomeMessage.bind(this);
        this.selectTextInElement = this.selectTextInElement.bind(this);

        this.spokeSample = false;
        this.welcomeSampleTextElement = null;

        this.styled = {
            heroDiv: styled({
                marginBottom: "2em",
            })("div"),

            heroVersionSection: styled({
                // NOTE: atomic css class ordering seems to not work well in this case.
                marginBottom: 0,
            })(HeroVersionSection),

            sampleHeroP: styled({
                marginTop: 0,
            })(textBase.p),

            welcomeHeroP: styled({
                marginTop: 0,
                marginBottom: 0,
            })(textBase.p),

            sharingDiv: styled({
                marginTop: "-4em",
                marginLeft: "6em",
                marginRight: "6em",
            })("div"),

            sharingIcons: styled({
                display: "inline-block",
                verticalAlign: "middle",
            })(SharingIcons),
        };
    }

    static defaultProps = {
        isPremiumVersion: false,
        systemType: false,
        osType: false,
        voicesCount: 0,
        languagesCount: 0,
        languageGroupsCount: 0,
        sampleText: null,
        sampleTextLanguageCode: null,
        speakTextInLanguageWithOverrides: null,
        canSpeakInTranslatedLocale: false,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
        sampleText: PropTypes.string,
        sampleTextLanguageCode: PropTypes.string,
        speakTextInLanguageWithOverrides: PropTypes.func.isRequired,
        canSpeakInTranslatedLocale: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.playWelcomeMessage();
    }

    componentDidUpdate() {
        this.playWelcomeMessage();
    }

    playWelcomeMessage() {
        if (!this.welcomeSampleTextElement) {
            return;
        }

        if (this.spokeSample) {
            return;
        }

        this.spokeSample = true;

        this.selectTextInElement(this.welcomeSampleTextElement);

        const welcomeSample = this.getWelcomeSample();
        const text = welcomeSample.text;
        const languageCode = welcomeSample.languageCode;

        this.props.speakTextInLanguageWithOverrides(text, languageCode);
    }

    selectTextInElement(element) {
        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.selectAllChildren(element);
    }

    getWelcomeSample() {
        const hasSampleText = !!this.props.sampleText;
        const welcomeSampleText = this.props.sampleText;
        const welcomeSampleTextLanguage = this.props.sampleTextLanguageCode;

        const welcomeSample = {
            hasSampleText: hasSampleText,
            text: welcomeSampleText,
            languageCode: welcomeSampleTextLanguage,
        };

        return welcomeSample;
    }

    render() {
        const {
            isPremiumVersion,
            systemType,
            osType,
            voicesCount,
            languagesCount,
            languageGroupsCount,
            canSpeakInTranslatedLocale,
            translate,
            configure,
        } = this.props;

        // TODO: configuration.
        const devModeShowAll = false;

        // TODO: pretty name.
        const systemTypePrettyName = systemType;

        // TODO: pretty name.
        const osTypePrettyName = osType;

        const welcomeSample = this.getWelcomeSample();

        return (
            <section>
                <this.styled.heroDiv>
                    <this.styled.heroVersionSection
                        isPremiumVersion={isPremiumVersion}
                    >
                        <Discretional
                            enabled={welcomeSample.hasSampleText}
                        >
                            <this.styled.sampleHeroP>
                                <span
                                    lang={welcomeSample.languageCode}
                                    ref={(welcomeSampleTextElement) => {
                                        this.welcomeSampleTextElement = welcomeSampleTextElement;
                                    }}
                                >
                                    {welcomeSample.text}
                                </span>
                            </this.styled.sampleHeroP>
                        </Discretional>

                        <this.styled.welcomeHeroP>
                            Welcome to {translate("extensionShortName")}! You are now using one of the best text-to-speech browser extensions in the world.

                            <Discretional
                                enabled={canSpeakInTranslatedLocale}
                            >
                                {" "}
                                Go ahead and select this text, then click the
                                <TalkieVersionIcon
                                    isPremiumVersion={isPremiumVersion}
                                />
                                {translate("extensionShortName")} button in the browser toolbar. Enjoy!
                            </Discretional>
                        </this.styled.welcomeHeroP>
                    </this.styled.heroVersionSection>

                    <this.styled.sharingDiv>
                        <this.styled.sharingIcons />

                        <textBase.a href={configure("urls.rate")}>
                            {translate("frontend_rateIt")}
                        </textBase.a>
                    </this.styled.sharingDiv>
                </this.styled.heroDiv>

                <textBase.h2>
                    {/* TODO: translate */}
                    Want to install more voices?
                </textBase.h2>

                <textBase.p>
                    {/* TODO: translate */}
                    Talkie can currently find
                    {" "}
                    <strong>
                        {voicesCount} voices
                    </strong>
                    {" "}
                    enabling
                    {" "}
                    <strong>
                        {languageGroupsCount} languages
                    </strong>
                    {" "}
                    in
                    {" "}
                    <strong>
                        {languagesCount} dialects
                    </strong>
                    {" "}
                    installed in your {systemTypePrettyName} browser running on a {osTypePrettyName} operating system.
                    {" "}
                    <Discretional
                        enabled={devModeShowAll || osType === "win"}
                    >
                        <textBase.span>
                            {/* TODO: translate */}
                            You can add more voices from both Microsoft and others; see separate installation instructions. <textBase.a href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3">Windows 10</textBase.a>, <textBase.a href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130">Windows 8</textBase.a>, <textBase.a href="https://www.microsoft.com/en-us/download/details.aspx?id=27224">Windows 7</textBase.a>, <textBase.a href="http://espeak.sourceforge.net">eSpeak (open source)</textBase.a>.
                        </textBase.span>
                    </Discretional>

                    <Discretional
                        enabled={devModeShowAll || osType === "cros"}
                    >
                        <textBase.span>
                            {/* TODO: translate */}
                            Any additions to ChromeOS should be available in the Chrome Web Store. One example is <textBase.a href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb">US English Female Text-to-speech (by Google)</textBase.a>.
                        </textBase.span>
                    </Discretional>

                    <Discretional
                        enabled={devModeShowAll || osType === "mac"}
                    >
                        <textBase.span>
                            {/* TODO: translate */}
                            Additional voices can be automatically installed from the macOS system preferences for speech; see separate installation instructions. <textBase.a href="https://support.apple.com/kb/PH25378">macOS Sierra (10.12)</textBase.a>.
                        </textBase.span>
                    </Discretional>

                    <Discretional
                        enabled={devModeShowAll || osType === "linux"}
                    >
                        <textBase.span>
                            {/* TODO: translate */}
                            Currently not sure how to install additional voices, as I have not tried it myself. It is also a matter of if and how browsers detect installed voices. See separate installation instructions. Please let me know what your expirences are! <textBase.a href="http://espeak.sourceforge.net">eSpeak (open source)</textBase.a>.
                        </textBase.span>
                    </Discretional>
                </textBase.p>
            </section>
        );
    }
}
