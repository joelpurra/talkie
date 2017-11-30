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

import * as textBase from "../../../shared/styled/text/text-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";

import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";

@configureAttribute
@translateAttribute
export default class About extends React.Component {
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
                    {/* TODO: translate */}
                    {translate("frontend_systemHeading")}
                    System details
                </textBase.h2>

                <listBase.dl>
                    <listBase.dt>
                        Installed version
                    </listBase.dt>
                    <listBase.dd>
                        <TalkieVersionIcon
                            isPremiumVersion={isPremiumVersion}
                        />
                        Talkie
                        {" "}
                        {versionName}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Browser type
                    </listBase.dt>
                    <listBase.dd>
                        {systemType}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Operating system type
                    </listBase.dt>
                    <listBase.dd>
                        {osType}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Preferred browser language
                    </listBase.dt>
                    <listBase.dd>
                        {navigatorLanguage}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Preferred browser languages ({navigatorLanguages.length})
                    </listBase.dt>
                    <listBase.dd>
                        {navigatorLanguages.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Installed voice languages ({languageGroups.length})
                    </listBase.dt>
                    <listBase.dd>
                        {languageGroups.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Installed voice dialects ({languages.length})
                    </listBase.dt>
                    <listBase.dd>
                        {languages.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Installed voices ({voices.length})
                    </listBase.dt>
                    <listBase.dd>
                        {voiceNames.join(", ")}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Talkie user interface language
                    </listBase.dt>
                    <listBase.dd>
                        {translate("extensionLocale")}
                    </listBase.dd>

                    <listBase.dt>
                        {/* TODO: translate */}
                        Talkie user interface languages ({translatedLanguages.length})
                    </listBase.dt>
                    <listBase.dd>
                        {translatedLanguages.join(", ")}
                    </listBase.dd>
                </listBase.dl>

                <textBase.h2>
                    {translate("frontend_licenseHeading")}
                </textBase.h2>
                <p>
                    <span
                        onClick={this.handleLegaleseClick}
                    >
                        {translate("frontend_licenseGPLDescription")}
                    </span>
                    <br />
                    <textBase.a href={configure("urls.gpl")}>
                        {translate("frontend_licenseGPLLinkText")}
                    </textBase.a>
                </p>
                <p>
                    {translate("frontend_licenseCLADescription")}
                    <br />
                    <textBase.a href={configure("urls.cla")}>
                        {translate("frontend_licenseCLALinkText")}
                    </textBase.a>
                </p>
            </section>
        );
    }
}
