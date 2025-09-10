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
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";

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

import Settings,
{
	type SettingsDispatchProps,
	type SettingsStateProps,
} from "../app/sections/settings.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

interface SettingsContainerProps {
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
}

interface StateProps extends SettingsStateProps {}

interface DispatchProps extends SettingsDispatchProps {
	askClipboardReadPermission: typeof actions.shared.clipboard.askClipboardReadPermission;
	denyClipboardReadPermission: typeof actions.shared.clipboard.denyClipboardReadPermission;
	loadContinueOnTabRemoved: typeof actions.settings.loadContinueOnTabRemoved;
	loadContinueOnTabUpdatedUrl: typeof actions.settings.loadContinueOnTabUpdatedUrl;
	loadHasClipboardReadPermission: typeof actions.shared.clipboard.loadHasClipboardReadPermission;
	loadShowAdditionalDetails: typeof actions.settings.loadShowAdditionalDetails;
	loadSpeakingHistory: typeof actions.shared.history.loadSpeakingHistory;
	loadSpeakingHistoryLimit: typeof actions.settings.loadSpeakingHistoryLimit;
	loadSpeakLongTexts: typeof actions.settings.loadSpeakLongTexts;
	readFromClipboard: typeof actions.shared.clipboard.readFromClipboard;
	speakFromClipboard: typeof actions.shared.clipboard.speakFromClipboard;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, SettingsContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	clipboardText: state.shared.clipboard.clipboardText,
	continueOnTabRemoved: state.settings.continueOnTabRemoved,
	continueOnTabUpdatedUrl: state.settings.continueOnTabUpdatedUrl,
	hasClipboardReadPermission: state.shared.clipboard.hasClipboardReadPermission,
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	showAdditionalDetails: state.settings.showAdditionalDetails,
	speakLongTexts: state.settings.speakLongTexts,
	speakingHistory: state.shared.history.speakingHistory,
	speakingHistoryCount: selectors.shared.history.getSpeakingHistoryCount(state),
	speakingHistoryLimit: state.settings.speakingHistoryLimit,
	systemType: state.shared.metadata.systemType,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SettingsContainerProps> = (dispatch) => ({
	askClipboardReadPermission: bindActionCreators(actions.shared.clipboard.askClipboardReadPermission, dispatch),
	clearSpeakingHistory: bindActionCreators(actions.shared.history.clearSpeakingHistory, dispatch),
	denyClipboardReadPermission: bindActionCreators(actions.shared.clipboard.denyClipboardReadPermission, dispatch),
	loadContinueOnTabRemoved: bindActionCreators(actions.settings.loadContinueOnTabRemoved, dispatch),
	loadContinueOnTabUpdatedUrl: bindActionCreators(actions.settings.loadContinueOnTabUpdatedUrl, dispatch),
	loadHasClipboardReadPermission: bindActionCreators(actions.shared.clipboard.loadHasClipboardReadPermission, dispatch),
	loadShowAdditionalDetails: bindActionCreators(actions.settings.loadShowAdditionalDetails, dispatch),
	loadSpeakLongTexts: bindActionCreators(actions.settings.loadSpeakLongTexts, dispatch),
	loadSpeakingHistory: bindActionCreators(actions.shared.history.loadSpeakingHistory, dispatch),
	loadSpeakingHistoryLimit: bindActionCreators(actions.settings.loadSpeakingHistoryLimit, dispatch),
	readFromClipboard: bindActionCreators(actions.shared.clipboard.readFromClipboard, dispatch),
	removeSpeakingHistoryEntry: bindActionCreators(actions.shared.history.removeSpeakingHistoryEntry, dispatch),
	speakFromClipboard: bindActionCreators(actions.shared.clipboard.speakFromClipboard, dispatch),
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
		this.props.loadContinueOnTabRemoved();
		this.props.loadContinueOnTabUpdatedUrl();
		this.props.loadHasClipboardReadPermission();
		this.props.loadShowAdditionalDetails();
		this.props.loadSpeakingHistory();
		this.props.loadSpeakingHistoryLimit();
		this.props.loadSpeakLongTexts();
	}

	override render(): React.ReactNode {
		const {
			askClipboardReadPermission,
			clearSpeakingHistory,
			clipboardText,
			continueOnTabRemoved,
			continueOnTabUpdatedUrl,
			denyClipboardReadPermission,
			hasClipboardReadPermission,
			isPremiumEdition,
			loadHasClipboardReadPermission,
			onOpenShortKeysConfigurationClick,
			readFromClipboard,
			removeSpeakingHistoryEntry,
			showAdditionalDetails,
			speakFromClipboard,
			speakingHistory,
			speakingHistoryCount,
			speakingHistoryLimit,
			speakLongTexts,
			storeContinueOnTabRemoved,
			storeContinueOnTabUpdatedUrl,
			storeShowAdditionalDetails,
			storeSpeakingHistoryLimit,
			storeSpeakLongTexts,
			systemType,
		} = this.props as InternalProps;

		return (
			<Settings
				askClipboardReadPermission={askClipboardReadPermission}
				clearSpeakingHistory={clearSpeakingHistory}
				clipboardText={clipboardText}
				continueOnTabRemoved={continueOnTabRemoved}
				continueOnTabUpdatedUrl={continueOnTabUpdatedUrl}
				denyClipboardReadPermission={denyClipboardReadPermission}
				hasClipboardReadPermission={hasClipboardReadPermission}
				isPremiumEdition={isPremiumEdition}
				loadHasClipboardReadPermission={loadHasClipboardReadPermission}
				readFromClipboard={readFromClipboard}
				removeSpeakingHistoryEntry={removeSpeakingHistoryEntry}
				showAdditionalDetails={showAdditionalDetails}
				speakFromClipboard={speakFromClipboard}
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
				onOpenShortKeysConfigurationClick={onOpenShortKeysConfigurationClick}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, SettingsContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	SettingsContainer,
);
