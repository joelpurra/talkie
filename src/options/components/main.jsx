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

import License from "./sections/license.jsx";

import Story from "./sections/story.jsx";

import Usage from "./sections/usage.jsx";

import DonateContainer from "../containers/donate-container.jsx";

import VoicesContainer from "../containers/voices-container.jsx";

import AboutContainer from "../containers/about-container.jsx";

export default class Main extends React.Component {
    constructor(props) {
        super(props);

        this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
    }

    static defaultProps = {
        voicesCount: 0,
        languagesCount: 0,
        hideDonations: false,
        isPremiumVersion: false,
        versionName: null,
        activeTabId: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        voicesCount: PropTypes.number.isRequired,
        languagesCount: PropTypes.number.isRequired,
        hideDonations: PropTypes.bool.isRequired,
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

    handleLegaleseClick(text) {
        const legaleseText = text;
        const legaleseVoice = {
            name: "Zarvox",
            lang: "en-US",
        };

        this.props.actions.voices.speak(legaleseText, legaleseVoice);
    }

    render() {
        return (
            <main>
                {/*
                    <p>TODO REMOVE versionName {this.props.versionName}</p>

                    <p>TODO REMOVE isPremiumVersion {"" + this.props.isPremiumVersion}</p>

                    <p>TODO REMOVE hideDonations {"" + this.props.hideDonations}</p>

                    <p>TODO REMOVE voicesCount {this.props.voicesCount}</p>

                    <p>TODO REMOVE languagesCount {this.props.languagesCount}</p>

                    <p>TODO REMOVE activeTabId {this.props.activeTabId}</p>
                */}

                <TabContents
                    id="usage"
                    activeTabId={this.props.activeTabId}
                >
                    <Usage />
                </TabContents>

                <TabContents
                    id="features"
                    activeTabId={this.props.activeTabId}
                >
                    <Features />
                </TabContents>

                <TabContents
                    id="voices"
                    activeTabId={this.props.activeTabId}
                >
                    <VoicesContainer />
                </TabContents>

                <TabContents
                    id="donate"
                    activeTabId={this.props.activeTabId}
                >
                    <DonateContainer />
                </TabContents>

                <TabContents
                    id="story"
                    activeTabId={this.props.activeTabId}
                >
                    <Story />
                </TabContents>

                <TabContents
                    id="about"
                    activeTabId={this.props.activeTabId}
                >
                    <AboutContainer
                        versionName={this.props.versionName}
                    />
                </TabContents>

                <TabContents
                    id="license"
                    activeTabId={this.props.activeTabId}
                >
                    <License
                        onClick={this.handleLegaleseClick}
                    />
                </TabContents>
            </main>
        );
    }
}
