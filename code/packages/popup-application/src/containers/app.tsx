/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type {
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";

import type {
	PopupRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import VoicesLoader from "@talkie/shared-ui/components/loaders/voices-loader.js";
import IsSpeakingListenerContainer from "@talkie/shared-ui/containers/is-speaking-listener-container.js";
import {
	type ProgressUpdaterDispatchProps,
	ProgressUpdaterTypehack,
} from "@talkie/shared-ui/hocs/progress-updater.js";
import React from "react";
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

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<MainStateProps, AppProps, PopupRootState> = (state: Readonly<PopupRootState>) => ({
	errorCount: selectors.shared.errors.getErrorsCount(state),
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	isSpeaking: state.shared.speaking.isSpeaking,
	versionNumber: state.shared.metadata.versionNumber,
});

const mapDispatchToProps: MapDispatchToPropsFunction<MainDispatchProps & ProgressUpdaterDispatchProps, AppProps> = (dispatch) => ({
	iconClick: bindActionCreators(actions.shared.speaking.iconClick, dispatch),
	openExternalUrlInNewTab: bindActionCreators(actions.shared.navigation.openExternalUrlInNewTab, dispatch),
	openOptionsPage: bindActionCreators(actions.shared.navigation.openOptionsPage, dispatch),
	setCurrent: bindActionCreators(actions.shared.progress.setCurrent, dispatch),
	setMax: bindActionCreators(actions.shared.progress.setMax, dispatch),
	setMin: bindActionCreators(actions.shared.progress.setMin, dispatch),
});

class App<P extends AppProps & MainStateProps & MainDispatchProps & ProgressUpdaterDispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			errorCount,
			iconClick,
			isPremiumEdition,
			isSpeaking,
			openExternalUrlInNewTab,
			openOptionsPage,
			setCurrent,
			setMax,
			setMin,
			versionNumber,
		} = this.props as P;

		return (
			<>
				<VoicesLoader/>

				<IsSpeakingListenerContainer/>

				{/* eslint-disable-next-line @typescript-eslint/no-deprecated */}
				<ProgressUpdaterTypehack
					setCurrent={setCurrent}
					setMax={setMax}
					setMin={setMin}
				/>

				<Main
					errorCount={errorCount}
					iconClick={iconClick}
					isPremiumEdition={isPremiumEdition}
					isSpeaking={isSpeaking}
					openExternalUrlInNewTab={openExternalUrlInNewTab}
					openOptionsPage={openOptionsPage}
					versionNumber={versionNumber}
				/>
			</>
		);
	}
}

export default connect<MainStateProps, MainDispatchProps, AppProps, PopupRootState>(mapStateToProps, mapDispatchToProps)(
	App,
);
