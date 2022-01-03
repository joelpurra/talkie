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
import IsSpeakingListenerContainer from "@talkie/shared-ui/containers/is-speaking-listener-container.js";
import ProgressUpdater, {
	type ProgressUpdaterDispatchProps,
} from "@talkie/shared-ui/hocs/progress-updater.js";
import React from "react";
import type {
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	connect,
} from "react-redux";

import Main, {
	type MainDispatchProps,
	type MainStateProps,
} from "../app/main.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

const {
	bindActionCreators,
} = toolkit;

interface StateProps extends MainStateProps {}

interface DispatchProps extends MainDispatchProps {}

export interface AppProps extends StateProps, DispatchProps {}

interface InternalProps extends StateProps, DispatchProps, ProgressUpdaterDispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	activeTabId: state.tabs.activeTabId,
	errorCount: selectors.shared.errors.getErrorsCount(state),
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	osType: state.shared.metadata.osType,
	showAdditionalDetails: state.settings.showAdditionalDetails,
	systemType: state.shared.metadata.systemType,
	versionNumber: state.shared.metadata.versionNumber,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	openExternalUrlInNewTab: bindActionCreators(actions.shared.navigation.openExternalUrlInNewTab, dispatch),
	openOptionsPage: bindActionCreators(actions.shared.navigation.openOptionsPage, dispatch),
	openShortKeysConfiguration: bindActionCreators(actions.shared.navigation.openShortKeysConfiguration, dispatch),
	setCurrent: bindActionCreators(actions.shared.progress.setCurrent, dispatch),
	setMax: bindActionCreators(actions.shared.progress.setMax, dispatch),
	setMin: bindActionCreators(actions.shared.progress.setMin, dispatch),
});

class App<P extends InternalProps> extends React.PureComponent<P> {
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
			openExternalUrlInNewTab,
			openOptionsPage,
			openShortKeysConfiguration,
			osType,
			setCurrent,
			setMax,
			setMin,
			showAdditionalDetails,
			systemType,
			versionNumber,
		} = this.props;

		return (
			<>
				<IsSpeakingListenerContainer/>

				<ProgressUpdater
					setCurrent={setCurrent}
					setMax={setMax}
					setMin={setMin}
				/>

				<Main
					activeTabId={activeTabId}
					errorCount={errorCount}
					isPremiumEdition={isPremiumEdition}
					openExternalUrlInNewTab={openExternalUrlInNewTab}
					openOptionsPage={openOptionsPage}
					openShortKeysConfiguration={openShortKeysConfiguration}
					osType={osType ?? null}
					showAdditionalDetails={showAdditionalDetails}
					systemType={systemType}
					versionNumber={versionNumber}
				/>
			</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	App,
);
