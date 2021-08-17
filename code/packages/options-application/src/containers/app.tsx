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

import Main, {
	MainDispatchProps,
} from "../components/main";
import {
	actions,
} from "../slices/index";
import {
	OptionsRootState,
} from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {}

interface StateProps {
	activeTabId: string | null;
	shouldShowBackButton: boolean;
}

interface DispatchProps extends MainDispatchProps {}

const mapStateToProps: MapStateToProps<StateProps, AppProps, OptionsRootState> = (state: ReadonlyDeep<OptionsRootState>) => ({
	activeTabId: state.unshared.tabs.activeTabId,
	shouldShowBackButton: state.navigation.shouldShowBackButton,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AppProps> = (dispatch) => ({
	openUrlInNewTab: bindActionCreators(actions.shared.navigation.openUrlInNewTab, dispatch),
	setShouldShowBackButton: bindActionCreators(actions.navigation.setShouldShowBackButton, dispatch),
});

class App<P extends AppProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			activeTabId,
			openUrlInNewTab,
			setShouldShowBackButton,
			shouldShowBackButton,
		} = this.props;

		return (
			<Main
				activeTabId={activeTabId}
				openUrlInNewTab={openUrlInNewTab}
				setShouldShowBackButton={setShouldShowBackButton}
				shouldShowBackButton={shouldShowBackButton}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, AppProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	App,
);
