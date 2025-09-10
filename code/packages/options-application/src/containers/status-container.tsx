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
	OptionsRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Status, {
	type StatusDispatchProps,
	type StatusStateProps,
} from "../app/sections/status.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StatusContainerProps {}

interface StateProps extends StatusStateProps {}

interface DispatchProps extends StatusDispatchProps {
	loadMostRecentSpeakingEntry: typeof actions.shared.history.loadMostRecentSpeakingEntry;
	loadSpeakingHistory: typeof actions.shared.history.loadSpeakingHistory;
	loadSpeakingHistoryLimit: typeof actions.settings.loadSpeakingHistoryLimit;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, StatusContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	isSpeaking: state.shared.speaking.isSpeaking,
	isSpeakingHistoryEnabled: selectors.settings.getIsSpeakingHistoryEnabled(state),
	mostRecent: state.shared.history.mostRecent,
	speakingHistory: state.shared.history.speakingHistory,
	speakingHistoryCount: selectors.shared.history.getSpeakingHistoryCount(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, StatusContainerProps> = (dispatch) => ({
	loadMostRecentSpeakingEntry: bindActionCreators(actions.shared.history.loadMostRecentSpeakingEntry, dispatch),
	loadSpeakingHistory: bindActionCreators(actions.shared.history.loadSpeakingHistory, dispatch),
	loadSpeakingHistoryLimit: bindActionCreators(actions.settings.loadSpeakingHistoryLimit, dispatch),
	speakTextInVoiceWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInVoiceWithOverrides, dispatch),
	stopSpeaking: bindActionCreators(actions.shared.speaking.stopSpeaking, dispatch),
});

class StatusContainer<P extends StatusContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		this.props.loadMostRecentSpeakingEntry();
		this.props.loadSpeakingHistory();
		this.props.loadSpeakingHistoryLimit();
	}

	override render(): React.ReactNode {
		const {
			isSpeaking,
			isSpeakingHistoryEnabled,
			mostRecent,
			speakingHistory,
			speakingHistoryCount,
			speakTextInVoiceWithOverrides,
			stopSpeaking,
		} = this.props as P;

		return (
			<Status
				isSpeaking={isSpeaking}
				isSpeakingHistoryEnabled={isSpeakingHistoryEnabled}
				mostRecent={mostRecent}
				speakTextInVoiceWithOverrides={speakTextInVoiceWithOverrides}
				speakingHistory={speakingHistory}
				speakingHistoryCount={speakingHistoryCount}
				stopSpeaking={stopSpeaking}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, StatusContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	StatusContainer,
);
