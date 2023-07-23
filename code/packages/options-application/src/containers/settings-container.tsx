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

import Settings from "../app/sections/settings.js";
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
export interface SettingsContainerProps {}

interface StateProps {
	showAdditionalDetails: boolean;
	speakLongTexts: boolean;
}

interface DispatchProps {
	loadShowAdditionalDetails: typeof actions.settings.loadShowAdditionalDetails;
	loadSpeakLongTexts: typeof actions.settings.loadSpeakLongTexts;
	storeShowAdditionalDetails: typeof actions.settings.storeShowAdditionalDetails;
	storeSpeakLongTexts: typeof actions.settings.storeSpeakLongTexts;
}

const mapStateToProps: MapStateToProps<StateProps, SettingsContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	showAdditionalDetails: state.settings.showAdditionalDetails,
	speakLongTexts: state.settings.speakLongTexts,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SettingsContainerProps> = (dispatch) => ({
	loadShowAdditionalDetails: bindActionCreators(actions.settings.loadShowAdditionalDetails, dispatch),
	loadSpeakLongTexts: bindActionCreators(actions.settings.loadSpeakLongTexts, dispatch),
	storeShowAdditionalDetails: bindActionCreators(actions.settings.storeShowAdditionalDetails, dispatch),
	storeSpeakLongTexts: bindActionCreators(actions.settings.storeSpeakLongTexts, dispatch),
});

class TextContainer<P extends SettingsContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		this.props.loadShowAdditionalDetails();
		this.props.loadSpeakLongTexts();
	}

	override render(): React.ReactNode {
		const {
			showAdditionalDetails,
			speakLongTexts,
			storeShowAdditionalDetails,
			storeSpeakLongTexts,
		} = this.props;

		return (
			<Settings
				showAdditionalDetails={showAdditionalDetails}
				speakLongTexts={speakLongTexts}
				storeShowAdditionalDetails={storeShowAdditionalDetails}
				storeSpeakLongTexts={storeSpeakLongTexts}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, SettingsContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	TextContainer,
);
