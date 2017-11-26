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

import Discretional from "../../../shared/components/discretional.jsx";
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
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
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
        } = this.props;

        return (
            <section>
                <p>
                    <TalkieVersionIcon
                        isPremiumVersion={isPremiumVersion}
                    />
                    Talkie
                    {" "}
                    {versionName}
                    {" "}
                    ({systemType}/{osType})
                </p>

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
                    <Discretional
                        enabled={!isPremiumVersion}
                    >
                        <listBase.li>
                            <textBase.a href={configure("urls.store-premium")}>
                                Talkie Premium
                            </textBase.a>
                        </listBase.li>
                    </Discretional>
                </listBase.ul>

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
