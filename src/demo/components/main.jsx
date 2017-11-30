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

import configureAttribute from "../../shared/hocs/configure.jsx";
import translateAttribute from "../../shared/hocs/translate.jsx";
import styled from "../../shared/hocs/styled.jsx";

import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";

import NavContainer from "../../shared/containers/nav-container.jsx";
import TabContents from "../../shared/components/navigation/tab-contents.jsx";

import Header from "./header.jsx";
import Footer from "./footer.jsx";

import About from "./sections/about.jsx";
import Features from "./sections/features.jsx";
import Support from "./sections/support.jsx";
import Usage from "./sections/usage.jsx";
import VoicesContainer from "../containers/voices-container.jsx";
import Welcome from "./sections/welcome.jsx";

const widthStyles = {
    minWidth: "400px",
    maxWidth: "1000px",
};

const styles = Object.assign(
    {},
    widthStyles,
    {
        minHeight: "450px",
        paddingBottom: "1em",
    }
);

@configureAttribute
@translateAttribute
@styled(styles)
export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
        this.playWelcomeMessage = this.playWelcomeMessage.bind(this);

        // TODO: better place to put navigation menu links?
        this.links = [
            {
                tabId: "welcome",
                // TODO: translate.
                text: "Welcome",
                // text: this.props.translate("frontend_welcomeLinkText"),
            },
            {
                tabId: "voices",
                text: this.props.translate("frontend_voicesLinkText"),
            },
            {
                tabId: "usage",
                text: this.props.translate("frontend_usageLinkText"),
            },
            {
                tabId: "features",
                text: this.props.translate("frontend_featuresLinkText"),
            },
            {
                tabId: "support",
                // TODO: translate.
                text: "Support",
                // text: this.props.translate("frontend_supportLinkText"),
            },
            {
                tabId: "about",
                text: this.props.translate("frontend_aboutLinkText"),
            },
        ];

        this.styled = {
            navHeader: styled(Object.assign(
                {},
                widthStyles,
                {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#ffffff",
                }
            ))("div"),

            main: styled({
                marginTop: "8em",
            })(layoutBase.main),

            footerHr: styled({
                marginTop: "3em",
            })(layoutBase.hr),
        };
    }

    static defaultProps = {
        isPremiumVersion: false,
        versionNumber: null,
        versionName: null,
        systemType: null,
        osType: null,
        voicesCount: 0,
        languagesCount: 0,
        languageGroupsCount: 0,
        activeTabId: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionNumber: PropTypes.string.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        languageGroupsCount: PropTypes.number.isRequired,
        activeTabId: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        translate: PropTypes.func.isRequired,
        configure: PropTypes.func.isRequired,
    };

    componentDidMount() {
        // NOTE: execute outside the synchronous rendering.
        setTimeout(() => this.scrollToTop(), 100);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeTabId !== nextProps.activeTabId) {
            this.scrollToTop();
        }
    }

    scrollToTop() {
        // NOTE: feels like this might be the wrong place to put this? Is there a better place?
        // NOTE: due to schuffling around elements, there's some confusion regarding which element to apply scrolling to.
        document.body.scrollTop = 0;
        window.scroll(0, 0);
    }

    handleOpenShortKeysConfigurationClick() {
        this.props.actions.sharedNavigation.openShortKeysConfiguration();
    }

    handleLinkClick(url) {
        this.props.actions.sharedNavigation.openUrlInNewTab(url);
    }

    playWelcomeMessage() {
        // TODO: translate.
        const text = `Welcome to ${this.props.translate("extensionShortName")}! You are now using one of the best text-to-speech browser extensions in the world!`;
        // const text = this.props.translate(...);

        const voice = {
            lang: this.props.translate("extensionLocale"),
        };

        this.props.actions.sharedVoices.speak(text, voice);
    }

    render() {
        const {
            activeTabId,
            isPremiumVersion,
            versionNumber,
            versionName,
            systemType,
            osType,
            voicesCount,
            languagesCount,
            languageGroupsCount,
            className,
        } = this.props;

        const linksToShow = this.links;

        return (
            <div className={className}>
                <this.styled.navHeader>
                    <Header
                        isPremiumVersion={isPremiumVersion}
                    />

                    <NavContainer
                        links={linksToShow}
                    />

                    <layoutBase.hr />
                </this.styled.navHeader>

                <layoutBase.hr />

                <this.styled.main
                    onClick={this.handleClick}
                >
                    <TabContents
                        id="welcome"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <Welcome
                            isPremiumVersion={isPremiumVersion}
                            systemType={systemType}
                            osType={osType}
                            voicesCount={voicesCount}
                            languagesCount={languagesCount}
                            languageGroupsCount={languageGroupsCount}
                            playWelcomeMessage={this.playWelcomeMessage}
                        />
                    </TabContents>

                    <TabContents
                        id="voices"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <VoicesContainer />
                    </TabContents>

                    <TabContents
                        id="usage"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <Usage
                            isPremiumVersion={isPremiumVersion}
                            systemType={systemType}
                            osType={osType}
                            onOpenShortKeysConfigurationClick={this.handleOpenShortKeysConfigurationClick}
                        />
                    </TabContents>

                    <TabContents
                        id="features"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <Features
                            isPremiumVersion={isPremiumVersion}
                            systemType={systemType}
                        />
                    </TabContents>

                    <TabContents
                        id="support"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <Support
                            isPremiumVersion={isPremiumVersion}
                            systemType={systemType}
                            osType={osType}
                        />
                    </TabContents>

                    <TabContents
                        id="about"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <About
                            isPremiumVersion={isPremiumVersion}
                            versionName={versionName}
                            systemType={systemType}
                            osType={osType}
                            onLicenseClick={this.handleLegaleseClick}
                        />
                    </TabContents>
                </this.styled.main>

                <this.styled.footerHr />

                <Footer
                    isPremiumVersion={isPremiumVersion}
                    versionNumber={versionNumber}
                />
            </div>
        );
    }
}
