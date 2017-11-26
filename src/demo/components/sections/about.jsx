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
import SocialShareIcon from "../../../shared/components/icon/social-share-icon.jsx";
import TalkieVersionIcon from "../../../shared/components/icon/talkie-version-icon.jsx";

@configureAttribute
@translateAttribute
export default class About extends React.Component {
    static defaultProps = {
        isPremiumVersion: false,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            configure,
            isPremiumVersion,
            translate,
        } = this.props;

        return (
            <section>
                <p>
                    <TalkieVersionIcon
                        isPremiumVersion={isPremiumVersion}
                    />
                    {translate("extensionShortName")}
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
                    {translate("frontend_shareHeading")}
                </textBase.h2>

                <listBase.inlineUl>
                    <listBase.inlineLi>
                        <textBase.a href={configure("urls.share.twitter")}>
                            <SocialShareIcon mode="standalone" size="2em" network="twitter" />
                        </textBase.a>
                    </listBase.inlineLi>
                    <listBase.inlineLi>
                        <textBase.a href={configure("urls.share.facebook")}>
                            <SocialShareIcon mode="standalone" size="2em" network="facebook" />
                        </textBase.a>
                    </listBase.inlineLi>
                    <listBase.inlineLi>
                        <textBase.a href={configure("urls.share.googleplus")}>
                            <SocialShareIcon mode="standalone" size="2em" network="googleplus" />
                        </textBase.a>
                    </listBase.inlineLi>
                    <listBase.inlineLi>
                        <textBase.a href={configure("urls.share.linkedin")}>
                            <SocialShareIcon mode="standalone" size="2em" network="linkedin" />
                        </textBase.a>
                    </listBase.inlineLi>
                </listBase.inlineUl>

                <textBase.h2>
                    {translate("frontend_storyHeading")}
                </textBase.h2>
                <p>
                    {translate("frontend_storyDescription")}
                </p>
                <p>
                    {translate("frontend_storyThankYou")}
                </p>
                <p>
                    —
                    <textBase.a href="https://joelpurra.com/">
                        Joel Purra
                    </textBase.a>
                </p>
            </section>
        );
    }
}
