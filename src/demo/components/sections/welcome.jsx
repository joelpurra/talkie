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

import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as buttonBase from "../../../shared/styled/button/button-base.jsx";

import Discretional from "../../../shared/components/discretional.jsx";
import VersionSection from "../../../shared/components/section/version-section.jsx";
import FreeSection from "../../../shared/components/section/free-section.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";
import TalkieFreeIcon from "../../../shared/components/icon/talkie-free-icon.jsx";
import TalkiePremiumIcon from "../../../shared/components/icon/talkie-premium-icon.jsx";

@configureAttribute
@translateAttribute
export default class Features extends React.Component {
    constructor(props) {
        super(props);

        this.handlePlayWelcomeMessageButtonClick = this.handlePlayWelcomeMessageButtonClick.bind(this);

        this.styled = {
            heroDiv: styled({
                fontSize: "2em",
                lineHeight: "1.5em",
            })("div"),
        };
    }

    static defaultProps = {
        isPremiumVersion: false,
        systemType: false,
        osType: false,
        voicesCount: 0,
        languagesCount: 0,
        languageGroupsCount: 0,
        playWelcomeMessage: null,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
        playWelcomeMessage: PropTypes.func.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.playWelcomeMessage();
    }

    handlePlayWelcomeMessageButtonClick(e) {
        this.props.playWelcomeMessage();
    }

    render() {
        const {
            isPremiumVersion,
            systemType,
            osType,
            voicesCount,
            languagesCount,
            languageGroupsCount,
            translate,
            configure,
        } = this.props;

        // TODO: configuration.
        const devModeShowAll = false;

        return (
            <section>
                <VersionSection
                    isPremiumVersion={isPremiumVersion}
                >
                    <this.styled.heroDiv>
                        <textBase.p>
                            {/* TODO: translate */}
                        Welcome to {translate("extensionShortName")}! You are now using one of the best text-to-speech browser extensions in the world! You can go ahead and test it by selecting this text, and then clicking the
                            <TalkieVersionIcon
                                isPremiumVersion={isPremiumVersion}
                            />
                            {translate("extensionShortName")} button in the browser bar.
                        </textBase.p>
                    </this.styled.heroDiv>
                </VersionSection>

                <textBase.h2>
                    {/* TODO: translate */}
                    Want to install more voices?
                </textBase.h2>

                <textBase.p>
                    {/* TODO: translate */}
                    Talkie can currently find <strong>{languageGroupsCount} languages</strong> with <strong>{languagesCount} dialects</strong>, and <strong>{voicesCount} voices</strong> installed on your system.
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
                        Additional voices can be automatically installed from the system preferences for speech; see separate installation instructions. <textBase.a href="https://support.apple.com/kb/PH25378">macOS Sierra (10.12)</textBase.a>.
                        </textBase.span>
                    </Discretional>

                    <Discretional
                        enabled={devModeShowAll || osType === "linux"}
                    >
                        <textBase.span>
                            {/* TODO: translate */}
                        Currently not sure, as I have not tried installing voices myself on any distributions. It is also a matter of if and how browers detect any installed voices. See separate installation instructions. Please let me know what your expirences are! <textBase.a href="http://espeak.sourceforge.net">eSpeak (open source)</textBase.a>.
                        </textBase.span>
                    </Discretional>
                </textBase.p>
            </section>
        );
    }
}
