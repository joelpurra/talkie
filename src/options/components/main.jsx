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

import styled from "../../shared/hocs/styled.jsx";

import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";

import NavContainer from "../containers/nav-container.jsx";
import TabContents from "./navigation/tab-contents.jsx";

import Features from "./sections/features.jsx";
import Usage from "./sections/usage.jsx";
import VoicesContainer from "../containers/voices-container.jsx";
import AboutContainer from "../containers/about-container.jsx";

const styles = {
    minWidth: "400px",
    maxWidth: "600px",
    minHeight: "450px",
    maxHeight: "1000px",
    paddingBottom: "1em",
};

@styled(styles)
export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.scrollToTop = this.scrollToTop.bind(this);
        this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

        this.styled = {
            navHeader: styled({
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                minWidth: "400px",
                maxWidth: "600px",
                backgroundColor: "#ffffff",
            })("div"),

            main: styled({
                marginTop: "4em",
            })(layoutBase.main),
        };
    }

    static defaultProps = {
        voicesCount: 0,
        languagesCount: 0,
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
        activeTabId: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        activeTabId: PropTypes.string,
        className: PropTypes.string.isRequired,
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

    handleLegaleseClick(text) {
        const legaleseText = text;
        const legaleseVoice = {
            name: "Zarvox",
            lang: "en-US",
        };

        this.props.actions.sharedVoices.speak(legaleseText, legaleseVoice);
    }

    handleLinkClick(url) {
        this.props.actions.sharedNavigation.openUrlInNewTab(url);
    }

    handleOpenShortKeysConfigurationClick() {
        this.props.actions.sharedNavigation.openShortKeysConfiguration();
    }

    render() {
        const {
            activeTabId,
            isPremiumVersion,
            versionName,
            systemType,
            osType,
            className,
        } = this.props;

        return (
            <div className={className}>
                <this.styled.navHeader>
                    <NavContainer />

                    <layoutBase.hr />
                </this.styled.navHeader>

                <this.styled.main>
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
                        id="voices"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <VoicesContainer />
                    </TabContents>

                    <TabContents
                        id="about"
                        activeTabId={activeTabId}
                        onLinkClick={this.handleLinkClick}
                    >
                        <AboutContainer
                            isPremiumVersion={isPremiumVersion}
                            versionName={versionName}
                            onLicenseClick={this.handleLegaleseClick}
                        />
                    </TabContents>
                </this.styled.main>
            </div>
        );
    }
}
