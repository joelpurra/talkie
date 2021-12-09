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
import toolkit from "@reduxjs/toolkit";
const {
	bindActionCreators,
} = toolkit;

import Main, {
	MainDispatchProps,
	MainStateProps,
} from "../components/main.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

interface StateProps extends MainStateProps {}

interface DispatchProps extends MainDispatchProps {}

export interface AppProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, AppProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	activeTabId: state.unshared.tabs.activeTabId,
	errorCount: selectors.shared.errors.getErrorsCount(state),
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	osType: state.shared.metadata.osType,
	systemType: state.shared.metadata.systemType,
	versionNumber: state.shared.metadata.versionNumber,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AppProps> = (dispatch) => ({
	openOptionsPage: bindActionCreators(actions.shared.navigation.openOptionsPage, dispatch),
	openShortKeysConfiguration: bindActionCreators(actions.shared.navigation.openShortKeysConfiguration, dispatch),
	openUrlInNewTab: bindActionCreators(actions.shared.navigation.openUrlInNewTab, dispatch),
});

class App<P extends AppProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			activeTabId,
			errorCount,
			isPremiumEdition,
			openOptionsPage,
			openShortKeysConfiguration,
			openUrlInNewTab,
			osType,
			systemType,
			versionNumber,
		} = this.props;

		return (
			<Main
				activeTabId={activeTabId}
				errorCount={errorCount}
				isPremiumEdition={isPremiumEdition}
				openOptionsPage={openOptionsPage}
				openShortKeysConfiguration={openShortKeysConfiguration}
				openUrlInNewTab={openUrlInNewTab}
				osType={osType ?? null}
				systemType={systemType}
				versionNumber={versionNumber}
			/>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	App,
);
