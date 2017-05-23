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

import {
    bindActionCreators,
} from "redux";

import {
    connect,
} from "react-redux";

import Nav from "../components/navigation/nav.jsx";

import * as actionCreators from "../actions/navigation";

const mapStateToProps = (state) => {
    return {
        activeTabId: state.navigation.activeTabId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class NavContainer extends React.Component {
    constructor(props) {
        super(props);

        // TODO: better place to put links?
        this.links = [
            {
                tabId: "usage",
                translationKey: "frontend_usageLinkText",
            },
            {
                tabId: "features",
                translationKey: "frontend_featuresLinkText",
            },
            {
                tabId: "voices",
                translationKey: "frontend_voicesLinkText",
            },
            {
                tabId: "donate",
                translationKey: "frontend_donateLinkText",
            },
            {
                tabId: "story",
                translationKey: "frontend_storyLinkText",
            },
            {
                tabId: "about",
                translationKey: "frontend_aboutLinkText",
            },
            {
                tabId: "license",
                translationKey: "frontend_licenseLinkText",
            },
        ];

        this.handleTabChange = this.handleTabChange.bind(this);
    }

    getLocationHash() {
        let locationHash = null;

        if (document.location && typeof document.location.hash === "string" && document.location.hash.length > 0) {
            locationHash = "#" + decodeURIComponent(document.location.hash.replace("#", ""));
        }

        return locationHash;
    }

    setLocationHash(locationHash) {
        document.location.hash = locationHash;
    }

    componentWillMount() {
        const locationHash = this.getLocationHash();

        if (typeof locationHash === "string") {
            const activeTabId = locationHash.replace("#", "");

            this.props.actions.setActiveTabId(activeTabId);
        }
    }

    handleTabChange(activeTabId) {
        this.props.actions.setActiveTabId(activeTabId);

        this.setLocationHash(activeTabId);
    }

    static propTypes = {
        actions: PropTypes.object.isRequired,
        activeTabId: PropTypes.string,
    }

    render() {
        return (
            <Nav
                initialActiveTabId={this.props.activeTabId}
                onTabChange={this.handleTabChange}
                links={this.links}
            />
        );
    }
}
