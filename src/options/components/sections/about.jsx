/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";

import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";

export default
@configureAttribute
@translateAttribute
class About extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
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
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    handleLegaleseClick(e) {
        const legaleseText = e.target.textContent;

        this.props.onLicenseClick(legaleseText);
    }

    render() {
        const {
            configure,
            isPremiumVersion,
            translate,
            versionName,
            systemType,
            osType,
            navigatorLanguage,
            navigatorLanguages,
            translatedLanguages,
            voices,
            languages,
            languageGroups,
        } = this.props;

        const voiceNames = voices.map((voice) => `${voice.name} (${voice.lang})`);
        voiceNames.sort();

        return (
            <section>
                <listBase.ul>
                    <listBase.li>
                        <textBase.a href={configure("urls.support-feedback")}>
                            {translate("frontend_supportAndFeedback")}
                        </textBase.a>
                    </listBase.li>
                    <listBase.li>
                        <textBase.a href={configure("urls.rate")}>
                            {translate("frontend_rateIt")}
                        </textBase.a>
                    </listBase.li>
                    <listBase.li>
                        <textBase.a href={configure("urls.project")}>
                            {translate("frontend_aboutProjectPageLinkText")}
                        </textBase.a>
                    </listBase.li>
                    <listBase.li>
                        <textBase.a href={configure("urls.github")}>
                            {translate("frontend_aboutCodeOnGithubLinkText")}
                        </textBase.a>
                    </listBase.li>
                </listBase.ul>

                <textBase.h2>
                    {translate("frontend_systemHeading")}
                </textBase.h2>

                <listBase.dl>
                    <listBase.dt>
                        {translate("frontend_systemInstalledVersionHeading")}
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        <TalkieVersionIcon
                            isPremiumVersion={isPremiumVersion}
                        />
                        Talkie
                        {" "}
                        {versionName}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemBrowserTypeHeading")}
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {systemType}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemOSHeading")}
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {osType}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemBrowserLanguageHeading")}
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {navigatorLanguage}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemBrowserLanguagesHeading")}
                        {" "}
                        ({navigatorLanguages.length})
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {navigatorLanguages.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemInstalledLanguagesHeading")}
                        {" "}
                        ({languageGroups.length})
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {languageGroups.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemInstalledDialectsHeading")}
                        {" "}
                            ({languages.length})
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {languages.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemInstalledVoicesHeading")}
                        {" "}
                        ({voices.length})
                    </listBase.dt>
                    <listBase.dd>
                        {voiceNames.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemTalkieUILanguageHeading")}
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {translate("extensionLocale")}
                    </listBase.dd>

                    <listBase.dt>
                        {translate("frontend_systemTalkieUILanguagesHeading")}
                        {" "}
                        ({translatedLanguages.length})
                    </listBase.dt>
                    <listBase.dd
                        lang="en"
                    >
                        {translatedLanguages.join(", ")}
                    </listBase.dd>
                </listBase.dl>

                <textBase.h2>
                    {translate("frontend_licenseHeading")}
                </textBase.h2>
                <p>
                    <span
                        lang="en"
                        onClick={this.handleLegaleseClick}
                    >
                        {translate("frontend_licenseGPLDescription")}
                    </span>
                    <br />
                    <textBase.a
                        href={configure("urls.gpl")}
                        lang="en"
                    >
                        {translate("frontend_licenseGPLLinkText")}
                    </textBase.a>
                </p>
                <p>
                    {translate("frontend_licenseCLADescription")}
                    <br />
                    <textBase.a href={configure("urls.cla")}
                        lang="en"
                    >
                        {translate("frontend_licenseCLALinkText")}
                    </textBase.a>
                </p>
            </section>
        );
    }
}
