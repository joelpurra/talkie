/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021 Joel Purra <https://joelpurra.com/>

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

import PropTypes from "prop-types";
import React from "react";
import {
	connect,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

import DynamicEnvironment from "../../split-environments/dynamic-environment.js";
import actionCreators from "../../unshared/actions";
import Nav from "../components/navigation/nav.jsx";

const dynamicEnvironment = new DynamicEnvironment();

const mapStateToProps = (state) => {
	return {
		activeTabId: state.unshared.navigation.activeTabId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators(actionCreators.navigation, dispatch),
	};
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class NavContainer extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleTabChange = this.handleTabChange.bind(this);
	}

	getLocationHash() {
		let locationHash = null;

		if (dynamicEnvironment.isWebExtension() && document.location && typeof document.location.hash === "string" && document.location.hash.length > 0) {
			locationHash = "#" + decodeURIComponent(document.location.hash.replace("#", ""));
		}

		return locationHash;
	}

	setLocationHash(locationHash) {
		// HACK: don't do browser detection.
		// https://stackoverflow.com/questions/41819284/how-to-determine-in-which-browser-your-extension-background-script-is-executing
		// https://stackoverflow.com/a/41820692
		const isFirefox = typeof InstallTrigger !== "undefined";

		// NOTE: this breaks navigation in the options page in the preferences pane in firefox, so skip.
		// TODO: don't disable on other pages (demo, options in normal tab) in firefox.
		if (!isFirefox) {
			document.location.hash = locationHash;
		}
	}

	componentDidMount() {
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
    	activeTabId: PropTypes.string.isRequired,
    	links: PropTypes.arrayOf(
    		PropTypes.shape({
    			url: PropTypes.string,
    			tabId: PropTypes.string,
    			text: PropTypes.string.isRequired,
    		})).isRequired,
    }

    render() {
    	const {
    		activeTabId,
    		links,
    	} = this.props;

    	return (
    		<Nav
    			initialActiveTabId={activeTabId}
    			onTabChange={this.handleTabChange}
    			links={links}
    		/>
    	);
    }
}
