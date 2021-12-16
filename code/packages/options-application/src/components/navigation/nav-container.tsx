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

import toolkit from "@reduxjs/toolkit";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	actions,
} from "../../slices/index.mjs";
import type {
	OptionsRootState,
} from "../../store/index.mjs";
import Nav from "./nav.js";
import {
	NavContainerProps,
} from "./nav-container-types.mjs";

const {
	bindActionCreators,
} = toolkit;

interface StateProps {
	activeTabId: string | null;
}

interface DispatchProps {
	loadActiveTabFromLocationHash: typeof actions.tabs.loadActiveTabFromLocationHash;
	setActiveTabId: typeof actions.tabs.setActiveTabId;
}

const mapStateToProps: MapStateToProps<StateProps, NavContainerProps, OptionsRootState> = (state: ReadonlyDeep<OptionsRootState>) => ({
	activeTabId: state.tabs.activeTabId,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, NavContainerProps> = (dispatch) => ({
	loadActiveTabFromLocationHash: bindActionCreators(actions.tabs.loadActiveTabFromLocationHash, dispatch),
	setActiveTabId: bindActionCreators(actions.tabs.setActiveTabId, dispatch),
});

class NavContainer<P extends NavContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.componentCleanup = this.componentCleanup.bind(this);
		this.handleHashChange = this.handleHashChange.bind(this);
		this.handleTabChange = this.handleTabChange.bind(this);
	}

	override componentDidMount(): void {
		window.addEventListener("beforeunload", this.componentCleanup);
		window.addEventListener("hashchange", this.handleHashChange);
	}

	override componentWillUnmount(): void {
		this.componentCleanup();
	}

	componentCleanup() {
		window.removeEventListener("beforeunload", this.componentCleanup);
		window.removeEventListener("hashchange", this.handleHashChange);
	}

	handleHashChange(): void {
		this.props.loadActiveTabFromLocationHash();
	}

	handleTabChange(activeTabId: string): void {
		this.props.setActiveTabId(activeTabId);
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

export default connect<StateProps, DispatchProps, NavContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	NavContainer,
);
