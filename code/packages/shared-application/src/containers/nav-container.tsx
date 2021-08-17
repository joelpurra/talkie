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

import DynamicEnvironment from "@talkie/split-environment/dynamic-environment";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";
import {
	ReadonlyDeep,
} from "type-fest";

import Nav from "../components/navigation/nav";
import {
	SharedRootState,
} from "../store";
import {
	actions,
} from "../unshared/slices/index";
import {
	NavContainerProps,
} from "./nav-container-types";

interface StateProps {
	activeTabId: string | null;
}

interface DispatchProps {
	setActiveTabId: typeof actions.tabs.setActiveTabId;
}

const dynamicEnvironment = new DynamicEnvironment();

const mapStateToProps: MapStateToProps<StateProps, NavContainerProps, SharedRootState> = (state: ReadonlyDeep<SharedRootState>) => ({
	activeTabId: state.unshared.tabs.activeTabId,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, NavContainerProps> = (dispatch) => ({
	setActiveTabId: bindActionCreators(actions.tabs.setActiveTabId, dispatch),
});

class NavContainer<P extends NavContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleTabChange = this.handleTabChange.bind(this);
	}

	getLocationHash(): string | null {
		// TODO: move to getLocationHash action?
		let locationHash = null;

		if (dynamicEnvironment.isWebExtension() && document.location && typeof document.location.hash === "string" && document.location.hash.length > 0) {
			locationHash = "#" + decodeURIComponent(document.location.hash.replace("#", ""));
		}

		return locationHash;
	}

	setLocationHash(locationHash: string): void {
		// TODO: move to setActiveTabId/setLocationHash action?
		// HACK: don't do browser detection.
		// https://stackoverflow.com/questions/41819284/how-to-determine-in-which-browser-your-extension-background-script-is-executing
		// https://stackoverflow.com/a/41820692
		// @ts-expect-error: Cannot find name 'InstallTrigger'. ts(2304)
		const isFirefox = typeof InstallTrigger !== "undefined";

		// NOTE: this breaks navigation in the options page in the preferences pane in firefox, so skip.
		// TODO: don't disable on other pages (demo, options in normal tab) in firefox.
		if (!isFirefox) {
			document.location.hash = locationHash;
		}
	}

	override componentDidMount(): void {
		const locationHash = this.getLocationHash();

		if (typeof locationHash === "string") {
			const activeTabId = locationHash.replace("#", "");

			this.props.setActiveTabId(activeTabId);
		}
	}

	handleTabChange(activeTabId: string): void {
		this.props.setActiveTabId(activeTabId);
		this.setLocationHash(activeTabId);
	}

	override render(): React.ReactNode {
		const {
			activeTabId,
			links,
		} = this.props;

		return (
			<Nav
				initialActiveTabId={activeTabId}
				links={links}
				onTabChange={this.handleTabChange}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, NavContainerProps, SharedRootState>(mapStateToProps, mapDispatchToProps)(
	NavContainer,
);
