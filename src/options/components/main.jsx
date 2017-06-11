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

import TabContents from "./navigation/tab-contents.jsx";

import Features from "./sections/features.jsx";

import Usage from "./sections/usage.jsx";

import VoicesContainer from "../containers/voices-container.jsx";

import AboutContainer from "../containers/about-container.jsx";

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
    }

    static defaultProps = {
        voicesCount: 0,
        languagesCount: 0,
        isPremiumVersion: false,
        versionName: null,
        activeTabId: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string,
        activeTabId: PropTypes.string,
    };

    componentWillMount() {
        // TODO: is this the best place to load data?
        this.props.actions.metadata.loadIsPremium();

        // TODO: is this the best place to load data?
        this.props.actions.metadata.loadVersionName();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeTabId !== nextProps.activeTabId) {
                    // NOTE: feels like this might be the wrong place to put this? Is there a better place?
            document.body.scrollTop = 0;
        }
    }

    handleLegaleseClick(text) {
        const legaleseText = text;
        const legaleseVoice = {
            name: "Zarvox",
            lang: "en-US",
        };

        this.props.actions.voices.speak(legaleseText, legaleseVoice);
    }

    handleLinkClick(url) {
        this.props.actions.navigation.openUrlInNewTab(url);
    }

    handleOpenShortKeysConfigurationClick() {
        this.props.actions.navigation.openShortKeysConfiguration();
    }

    render() {
        return (
            <main>
                {/*
                    <p>TODO REMOVE versionName {this.props.versionName}</p>

                    <p>TODO REMOVE isPremiumVersion {"" + this.props.isPremiumVersion}</p>

                    <p>TODO REMOVE voicesCount {this.props.voicesCount}</p>

                    <p>TODO REMOVE languagesCount {this.props.languagesCount}</p>

                    <p>TODO REMOVE activeTabId {this.props.activeTabId}</p>
                */}

                <TabContents
                    id="usage"
                    activeTabId={this.props.activeTabId}
                    onLinkClick={this.handleLinkClick}
                >
                    <Usage
                        onOpenShortKeysConfigurationClick={this.handleOpenShortKeysConfigurationClick}
                    />
                </TabContents>

                <TabContents
                    id="features"
                    activeTabId={this.props.activeTabId}
                    onLinkClick={this.handleLinkClick}
                >
                    <Features />
                </TabContents>

                <TabContents
                    id="voices"
                    activeTabId={this.props.activeTabId}
                    onLinkClick={this.handleLinkClick}
                >
                    <VoicesContainer />
                </TabContents>

                <TabContents
                    id="about"
                    activeTabId={this.props.activeTabId}
                    onLinkClick={this.handleLinkClick}
                >
                    <AboutContainer
                        versionName={this.props.versionName}
                        onLicenseClick={this.handleLegaleseClick}
                    />
                </TabContents>
            </main>
        );
    }
}
