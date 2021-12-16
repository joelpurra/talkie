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

import IsSpeakingUpdater, {
	IsSpeakingUpdaterDispatchProps,
} from "@talkie/shared-ui/hocs/is-speaking-updater.js";
import ProgressUpdater, {
	ProgressUpdaterDispatchProps,
} from "@talkie/shared-ui/hocs/progress-updater.js";
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
} from "../app/main.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";
import type {
	PopupRootState,
} from "../store/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<MainStateProps, AppProps, PopupRootState> = (state: Readonly<PopupRootState>) => ({
	errorCount: selectors.shared.errors.getErrorsCount(state as any),
	isPremiumEdition: (state as any).shared.metadata.isPremiumEdition,
	versionNumber: (state as any).shared.metadata.versionNumber,
});

const mapDispatchToProps: MapDispatchToPropsFunction<MainDispatchProps & IsSpeakingUpdaterDispatchProps & ProgressUpdaterDispatchProps, AppProps> = (dispatch) => ({
	iconClick: bindActionCreators(actions.shared.speaking.iconClick, dispatch),
	openOptionsPage: bindActionCreators(actions.shared.navigation.openOptionsPage, dispatch),
	openUrlInNewTab: bindActionCreators(actions.shared.navigation.openUrlInNewTab, dispatch),
	setCurrent: bindActionCreators(actions.shared.progress.setCurrent, dispatch),
	setIsSpeaking: bindActionCreators(actions.shared.speaking.setIsSpeaking, dispatch),
	setMax: bindActionCreators(actions.shared.progress.setMax, dispatch),
	setMin: bindActionCreators(actions.shared.progress.setMin, dispatch),
});

class App<P extends AppProps & MainStateProps & MainDispatchProps & IsSpeakingUpdaterDispatchProps & ProgressUpdaterDispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			errorCount,
			iconClick,
			isPremiumEdition,
			openOptionsPage,
			openUrlInNewTab,
			setCurrent,
			setIsSpeaking,
			setMax,
			setMin,
			versionNumber,
		} = this.props;

		return (
			<>
				<IsSpeakingUpdater
					setIsSpeaking={setIsSpeaking}
				/>

				<ProgressUpdater
					setCurrent={setCurrent}
					setMax={setMax}
					setMin={setMin}
				/>

				<Main
					errorCount={errorCount}
					iconClick={iconClick}
					isPremiumEdition={isPremiumEdition}
					openOptionsPage={openOptionsPage}
					openUrlInNewTab={openUrlInNewTab}
					versionNumber={versionNumber}
				/>
			</>
		);
	}
}

export default connect<MainStateProps, MainDispatchProps, AppProps, PopupRootState>(mapStateToProps, mapDispatchToProps)(
	App,
);
