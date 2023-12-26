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
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Settings,
{
	type SettingsDispatchProps,
	type SettingsStateProps,
} from "../app/sections/settings.js";
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SettingsContainerProps {}

interface StateProps extends SettingsStateProps {}

interface DispatchProps extends SettingsDispatchProps {
	loadShowAdditionalDetails: typeof actions.settings.loadShowAdditionalDetails;
	loadSpeakLongTexts: typeof actions.settings.loadSpeakLongTexts;
	loadSpeakingHistory: typeof actions.shared.speaking.loadSpeakingHistory;
	loadSpeakingHistoryLimit: typeof actions.settings.loadSpeakingHistoryLimit;
	loadContinueOnTabRemoved: typeof actions.settings.loadContinueOnTabRemoved;
	loadContinueOnTabUpdatedUrl: typeof actions.settings.loadContinueOnTabUpdatedUrl;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, SettingsContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	continueOnTabRemoved: state.settings.continueOnTabRemoved,
	continueOnTabUpdatedUrl: state.settings.continueOnTabUpdatedUrl,
	showAdditionalDetails: state.settings.showAdditionalDetails,
	speakLongTexts: state.settings.speakLongTexts,
	speakingHistory: state.shared.speaking.history,
	speakingHistoryCount: selectors.shared.speaking.getSpeakingHistoryCount(state),
	speakingHistoryLimit: state.settings.speakingHistoryLimit,
	systemType: state.shared.metadata.systemType,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SettingsContainerProps> = (dispatch) => ({
	clearSpeakingHistory: bindActionCreators(actions.shared.speaking.clearSpeakingHistory, dispatch),
	loadContinueOnTabRemoved: bindActionCreators(actions.settings.loadContinueOnTabRemoved, dispatch),
	loadContinueOnTabUpdatedUrl: bindActionCreators(actions.settings.loadContinueOnTabUpdatedUrl, dispatch),
	loadShowAdditionalDetails: bindActionCreators(actions.settings.loadShowAdditionalDetails, dispatch),
	loadSpeakLongTexts: bindActionCreators(actions.settings.loadSpeakLongTexts, dispatch),
	loadSpeakingHistory: bindActionCreators(actions.shared.speaking.loadSpeakingHistory, dispatch),
	loadSpeakingHistoryLimit: bindActionCreators(actions.settings.loadSpeakingHistoryLimit, dispatch),
	removeSpeakingHistoryEntry: bindActionCreators(actions.shared.speaking.removeSpeakingHistoryEntry, dispatch),
	storeContinueOnTabRemoved: bindActionCreators(actions.settings.storeContinueOnTabRemoved, dispatch),
	storeContinueOnTabUpdatedUrl: bindActionCreators(actions.settings.storeContinueOnTabUpdatedUrl, dispatch),
	storeShowAdditionalDetails: bindActionCreators(actions.settings.storeShowAdditionalDetails, dispatch),
	storeSpeakLongTexts: bindActionCreators(actions.settings.storeSpeakLongTexts, dispatch),
	storeSpeakingHistoryLimit: bindActionCreators(actions.settings.storeSpeakingHistoryLimit, dispatch),
});

interface InternalProps extends SettingsContainerProps, StateProps, DispatchProps {}

class SettingsContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		this.props.loadShowAdditionalDetails();
		this.props.loadSpeakLongTexts();
		this.props.loadSpeakingHistoryLimit();
		this.props.loadSpeakingHistory();
		this.props.loadContinueOnTabRemoved();
		this.props.loadContinueOnTabUpdatedUrl();
	}

	override render(): React.ReactNode {
		const {
			clearSpeakingHistory,
			removeSpeakingHistoryEntry,
			showAdditionalDetails,
			speakLongTexts,
			speakingHistory,
			speakingHistoryCount,
			speakingHistoryLimit,
			continueOnTabRemoved,
			continueOnTabUpdatedUrl,
			storeShowAdditionalDetails,
			storeSpeakLongTexts,
			storeSpeakingHistoryLimit,
			storeContinueOnTabRemoved,
			storeContinueOnTabUpdatedUrl,
			systemType,
		} = this.props as InternalProps;

		return (
			<Settings
				clearSpeakingHistory={clearSpeakingHistory}
				continueOnTabRemoved={continueOnTabRemoved}
				continueOnTabUpdatedUrl={continueOnTabUpdatedUrl}
				removeSpeakingHistoryEntry={removeSpeakingHistoryEntry}
				showAdditionalDetails={showAdditionalDetails}
				speakLongTexts={speakLongTexts}
				speakingHistory={speakingHistory}
				speakingHistoryCount={speakingHistoryCount}
				speakingHistoryLimit={speakingHistoryLimit}
				storeContinueOnTabRemoved={storeContinueOnTabRemoved}
				storeContinueOnTabUpdatedUrl={storeContinueOnTabUpdatedUrl}
				storeShowAdditionalDetails={storeShowAdditionalDetails}
				storeSpeakLongTexts={storeSpeakLongTexts}
				storeSpeakingHistoryLimit={storeSpeakingHistoryLimit}
				systemType={systemType}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, SettingsContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	SettingsContainer,
);
