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
export default class Features extends React.PureComponent {
    constructor(props) {
        super(props);

        this.styled = {
            summaryH4: styled({
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
        isPremiumVersion: false,
        systemType: false,
        osType: false,
    };

    static propTypes = {
        isPremiumVersion: PropTypes.bool.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    }

    render() {
        const {
            isPremiumVersion,
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
                    {/* TODO: translate */}
                    Have a question? Need help with something? For fast answers to common questions, see the frequently asked questions below. If that does not give you an answer, please send me any questions you might have. I would be happy if your experience using {translate("extensionShortName")} is smooth and enjoyable!
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
                    {/* TODO: translate */}
                    Frequently asked questions
                </textBase.h2>

                <textBase.h3>
                    {/* TODO: translate */}
                    Voices
                </textBase.h3>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            How does Talkie detect installed voices?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        The voice come from both from the operating system (Windows, ChromeOS, macOS, Linux, etcetera) and in your current browser (Google Chrome, Firefox, etcetera). This also means that you can download and install any voices you would like to have on your computer, and Talkie should recognize them automatically.
                    </textBase.p>
                </layoutBase.details>

                <Discretional
                    enabled={devModeShowAll || osType === "win"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How can I install more voices in Talkie on Windows?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            {/* TODO: translate */}
                            You can add more voices from both Microsoft and others; see separate installation instructions. <textBase.a href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3">Windows 10</textBase.a>, <textBase.a href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130">Windows 8</textBase.a>, <textBase.a href="https://www.microsoft.com/en-us/download/details.aspx?id=27224">Windows 7</textBase.a>, <textBase.a href="http://espeak.sourceforge.net">eSpeak (open source)</textBase.a>.
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "cros"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How can I install more voices in Talkie on ChromeOS?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            {/* TODO: translate */}
                            Any additions to ChromeOS should be available in the Chrome Web Store. One example is <textBase.a href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb">US English Female Text-to-speech (by Google)</textBase.a>.
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "mac"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How can I install more voices in Talkie on macOS?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            {/* TODO: translate */}
                            Additional voices can be automatically installed from the macOS system preferences for speech; see separate installation instructions. <textBase.a href="https://support.apple.com/kb/PH25378">macOS Sierra (10.12)</textBase.a>.
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                <Discretional
                    enabled={devModeShowAll || osType === "linux"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How can I install more voices in Talkie on Linux?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            {/* TODO: translate */}
                            Currently not sure how to install additional voices, as I have not tried it myself. It is also a matter of if and how browsers detect installed voices. See separate installation instructions. Please let me know what your expirences are! <textBase.a href="http://espeak.sourceforge.net">eSpeak (open source)</textBase.a>.
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can you add support for <em>&lt;a new voice&gt;</em> in Talkie?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Yes and no. Talkie does not include any voices in itself, but uses the voices which are already installed on your computer. You can install any additional voices you would like.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can you add support for <em>&lt;a new language&gt;</em> in Talkie?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Yes and no. As Talkie uses the voices which are installed on your computer, you need to install a new voice which supports the language you would like to use.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Does Talkie work offline?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Yes, if the voices installed are also available offline. You can see in the list of voices which are marked as online.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Does Talkie Premium have more voices than Talkie?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        No, Talkie Premium has the exact same voices as Talkie. You can install more voices on your system, and they are equally available. In Talkie Premium you are able to customize the voice selection per language though.
                    </textBase.p>
                </layoutBase.details>

                <textBase.h3>
                    {/* TODO: translate */}
                    Bugs
                </textBase.h3>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Why does Talkie stop reading after 20-30 words or a few seconds?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Google Chrome (and presumably other Chromium based browsers) have had this issue/bug since at least year 2014. Talkie has some workarounds in place, and an option to enable/disable reading text in shorter parts. I will continue to improve the workaround, but until the Chromium team works it might not work 100%. If you experience this issue, please let me know which browser and version, operating system and version, and language/voice you are using.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Why does Talkie sometime have a long pause between sentences and words?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        There are two reasons. Firstly, if the active voice is online it needs to download the speech file before playing it. This means an added pause which is depending on your internet connection speed. You can check which voices are online in the list of voices. The second reason is that the workaround for speaking long texts chops up the text in shorter parts, usually per sentence or per clause. This can add an extra pause for each pause. You can enable reading long texts as one part in the options, which should remove the pause on supported systems.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Does Talkie work in Google Docs?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Unfortunately, no. It turns out that Google Docs (as well as Google Spreadsheet, Google Drive, and similar) is not a website but a special &quot;application in the browser&quot; created by Google. Talkie cannot access the selected text, nor add context menu items. I will investigate further if there is some way to add Google Docs support to Talkie.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Should I report bugs?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Yes, please! Use either the support page or contact me directly. Please include as much information as possible, such as which browser and version, operating system and version, and language/voice you are using. Also include information regarding specific websites where you see the bug, preferably with a link.
                    </textBase.p>
                </layoutBase.details>

                <textBase.h3>
                    {/* TODO: translate */}
                    General
                </textBase.h3>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can Talkie read PDF files?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Usually! If you can select the text in the PDF, right click on it and choose Talkie in the menu. If the text cannot be selected, if it is part of an image, then it will not work.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Does Talkie have a word limit?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        No. Talkie has unlimited usage — you can read as many words and as long texts as you like.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I request new features?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Certainly! Just contact me through the support or project pages.
                    </textBase.p>
                </layoutBase.details>

                {/* NOTE: can't change shortcut keys in Firefox */}
                <Discretional
                    enabled={devModeShowAll || systemType === "chrome"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How to change shortcut keys in Google Chrome?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            There is a Keyboard shortcuts editor, which you can find at the bottom of the Extensions page in Google Chrome.
                            {" "}
                            <textBase.a
                                href={configure("urls.shortcut-keys")}
                                onClick={this.handleOpenShortKeysConfigurationClick}
                            >
                                {translate("frontend_usageShortcutKeyAlternative04")}
                            </textBase.a>
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                {/* NOTE: can't change shortcut keys in Firefox */}
                <Discretional
                    enabled={devModeShowAll || systemType === "webextension"}
                >
                    <layoutBase.details>
                        <layoutBase.summary>
                            <this.styled.summaryH4>
                                {/* TODO: translate */}
                                How to change shortcut keys in Firefox?
                            </this.styled.summaryH4>
                        </layoutBase.summary>
                        <textBase.p>
                            Unfortunately, that does not seem possible at this time. Please ask the Firefox team to add this feature!
                        </textBase.p>
                    </layoutBase.details>
                </Discretional>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I help develop Talkie?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Certainly! It would be great to get help translating Talkie, to test Talkie on new systems, to investigate bugs, and to add new features. Please see the project page for instructions.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I help Talkie in any other way?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Yes — please tell your friends about Talkie! Perhaps send a link to your favorite internet celebrity, online group, or newsletter. You can even ask your boss to install it on all the computers at work, or your teacher to install it at school. Spreading the word about Talkie is very much appreciated!
                    </textBase.p>

                    <textBase.p>
                        <this.styled.sharingIcons />

                        <textBase.a href={configure("urls.rate")}>
                            {translate("frontend_rateIt")}
                        </textBase.a>
                    </textBase.p>
                </layoutBase.details>

                <textBase.h3>
                    {/* TODO: translate */}
                    Talkie Premium
                </textBase.h3>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Why does Talkie Premium cost money?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        It takes quite a lot of time and effort to develop Talkie — hundreds of hours so far. To financially support the development some features are only available to Talkie Premium users.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I pay for Talkie Premium using PayPal, bank transfer, etcetera?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                            Unfortunately not yet. Talkie Premium is currently only offered through the Chrome Web Store, where the only option is to use Google Payments.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I get a refund?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                            Sure! You can either cancel the payment in Google Payments, or contact me directly. See the <textBase.a href="https://support.google.com/chrome_webstore/">Chrome Web Store Help Center</textBase.a>.
                    </textBase.p>
                </layoutBase.details>

                <layoutBase.details>
                    <layoutBase.summary>
                        <this.styled.summaryH4>
                            {/* TODO: translate */}
                            Can I get a free copy of Talkie Premium to try it out?
                        </this.styled.summaryH4>
                    </layoutBase.summary>
                    <textBase.p>
                        {/* TODO: translate */}
                        Sure! I can send you a copy of the latest version of Talkie Premium, but then it will not have automatic updates when the next version is released.
                    </textBase.p>
                </layoutBase.details>
            </section>
        );
    }
}
