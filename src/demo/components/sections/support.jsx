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

import Discretional from "../../../shared/components/discretional.jsx";
import SharingIcons from "../../../shared/components/sharing/sharing-icons.jsx";

@configureAttribute
@translateAttribute
export default class Support extends React.PureComponent {
    constructor(props) {
        super(props);

        this.styled = {
            summaryHeading: styled({
                display: "inline-block",
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: "0.5em",
                paddingRight: "0.5em",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
            })(textBase.h4),

            sharingIcons: styled({
                display: "inline-block",
                verticalAlign: "middle",
                fontSize: "0.5em",
            })(SharingIcons),
        };
    }

    static defaultProps = {
        systemType: null,
        osType: null,
    };

    static propTypes = {
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    standardFaqEntry(id) {
        const {
            translate,
        } = this.props;

        const paddedId = id.toString(10).padStart(3, "0");

        return (
            <layoutBase.details>
                <layoutBase.summary>
                    <this.styled.summaryHeading>
                        {translate(`frontend_faq${paddedId}Q`)}
                    </this.styled.summaryHeading>
                </layoutBase.summary>
                <textBase.p>
                    {translate(`frontend_faq${paddedId}A`)}
                </textBase.p>
            </layoutBase.details>
        );
    }

    render() {
        const {
            systemType,
            osType,
            translate,
            configure,
        } = this.props;

        // TODO: configuration.
        const devModeShowAll = false;

        return (
            <section>
                <textBase.p>
                    {translate("frontend_supportDescription", [
                        translate("extensionShortName"),
                    ])}
                </textBase.p>

                <listBase.ul>
                    <listBase.li>
                        <textBase.a href={configure("urls.support-feedback")}>
                            {translate("frontend_supportAndFeedback")}
                        </textBase.a>
                    </listBase.li>
                    <listBase.li>
                        <textBase.a href={configure("urls.project")}>
                            {translate("frontend_aboutProjectPageLinkText")}
                        </textBase.a>
                    </listBase.li>
                </listBase.ul>

                <textBase.h2>
                    {translate("frontend_faqHeading")}
                </textBase.h2>

                <textBase.h3>
                    {translate("frontend_faqVoicesHeading")}
                </textBase.h3>

                {this.standardFaqEntry(1)}

                <Discretional
                    enabled={devModeShowAll || osType === "win"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq002Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        {/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
                        <textBase.p>
                            {translate("frontend_faq002A")}
                        </textBase.p>

                        <listBase.ul>
                            <listBase.li>
                                <textBase.a
                                    href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
                                    lang="en"
                                >
                                    Windows 10
                                </textBase.a>: Settings &gt;&nbsp;Time&nbsp;&amp;&nbsp;Language &gt;&nbsp;Language
                                {/* TODO: translate system settings path. */}
                            </listBase.li>
                            <listBase.li>
                                <textBase.a
                                    href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130"
                                    lang="en"
                                >
                                    Windows 8
                                </textBase.a>
                            </listBase.li>
                            <listBase.li>
                                <textBase.a
                                    href="https://www.microsoft.com/en-us/download/details.aspx?id=27224"
                                    lang="en"
                                >
                                    Windows 7
                                </textBase.a>
                            </listBase.li>
                        </listBase.ul>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "cros"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq003Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        {/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
                        <textBase.p>
                            {translate("frontend_faq003A")}
                        </textBase.p>

                        <listBase.ul>
                            <listBase.li>
                                <textBase.a
                                    href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb"
                                    lang="en"
                                >
                                     US English Female Text-to-speech (by Google)
                                </textBase.a>
                            </listBase.li>
                        </listBase.ul>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "mac"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq004Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        {/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
                        <textBase.p>
                            {translate("frontend_faq004A")}
                        </textBase.p>

                        <listBase.ul>
                            <listBase.li>
                                <textBase.a
                                    href="https://support.apple.com/kb/index?page=search&amp;q=VoiceOver+language&amp;product=PF6&amp;doctype=PRODUCT_HELP,HOWTO_ARTICLES&amp;locale=en_US"
                                    lang="en"
                                >
                                        macOS
                                </textBase.a>: System&nbsp;Preferences &gt;&nbsp;Accessibility &gt;&nbsp;Speech &gt;&nbsp;System&nbsp;voice &gt;&nbsp;Customize...
                                {/* TODO: translate system settings path. */}
                            </listBase.li>
                        </listBase.ul>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "linux"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq005Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        {/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
                        <textBase.p>
                            {translate("frontend_faq005A")}
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                {this.standardFaqEntry(6)}
                {this.standardFaqEntry(7)}
                {this.standardFaqEntry(8)}
                {this.standardFaqEntry(9)}

                <textBase.h3>
                    {translate("frontend_faqBugsHeading")}
                </textBase.h3>

                {this.standardFaqEntry(10)}
                {this.standardFaqEntry(11)}
                {this.standardFaqEntry(12)}
                {this.standardFaqEntry(13)}

                <textBase.h3>
                    {translate("frontend_faqGeneralHeading")}
                </textBase.h3>

                {this.standardFaqEntry(14)}
                {this.standardFaqEntry(15)}
                {this.standardFaqEntry(16)}

                {/* NOTE: can't change shortcut keys in Firefox */}
                <Discretional
                    enabled={devModeShowAll || systemType === "chrome"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq017Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        <textBase.p>
                            {translate("frontend_faq017A")}
                        </textBase.p>

                        <listBase.ul>
                            <listBase.li>
                                <textBase.a
                                    href={configure("urls.shortcut-keys")}
                                    onClick={this.handleOpenShortKeysConfigurationClick}
                                >
                                    {translate("frontend_usageShortcutKeyAlternative04")}
                                </textBase.a>
                            </listBase.li>
                        </listBase.ul>
                    </layoutBase.details>
                </Discretional>

                {/* NOTE: can't change shortcut keys in Firefox */}
                <Discretional
                    enabled={devModeShowAll || systemType === "webextension"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryHeading>
                                {translate("frontend_faq018Q")}
                            </this.styled.summaryHeading>
                        </layoutBase.summary>
                        <textBase.p>
                            {translate("frontend_faq018A")}
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                {this.standardFaqEntry(19)}

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryHeading>
                            {translate("frontend_faq020Q")}
                        </this.styled.summaryHeading>
                    </layoutBase.summary>
                    <textBase.p>
                        {translate("frontend_faq020A")}
                    </textBase.p>

                    <div>
                        <this.styled.sharingIcons />

                        <textBase.a href={configure("urls.rate")}>
                            {translate("frontend_rateIt")}
                        </textBase.a>
                    </div>
                </layoutBase.details>

                <textBase.h3>
                    {translate("frontend_faqTalkiePremiumHeading")}
                </textBase.h3>

                {this.standardFaqEntry(21)}
                {this.standardFaqEntry(22)}

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryHeading>
                            {translate("frontend_faq023Q")}
                        </this.styled.summaryHeading>
                    </layoutBase.summary>
                    <textBase.p>
                        {translate("frontend_faq023A")}
                    </textBase.p>

                    <listBase.ul>
                        <listBase.li>
                            <textBase.a
                                href="https://support.google.com/chrome_webstore/"
                                lang="en"
                            >
                                     Chrome Web Store Help Center
                            </textBase.a>
                        </listBase.li>
                    </listBase.ul>
                </layoutBase.details>

                {this.standardFaqEntry(24)}
            </section>
        );
    }
}
