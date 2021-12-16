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
import {
	ReadonlyDeep,
} from "type-fest";

import Text from "../app/sections/text.js";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextContainerProps {}

interface StateProps {
	speakLongTexts: boolean;
}

interface DispatchProps {
	loadSpeakLongTexts: typeof actions.settings.loadSpeakLongTexts;
	storeSpeakLongTexts: typeof actions.settings.storeSpeakLongTexts;
}

const mapStateToProps: MapStateToProps<StateProps, TextContainerProps, OptionsRootState> = (state: ReadonlyDeep<OptionsRootState>) => ({
	speakLongTexts: state.settings.speakLongTexts,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TextContainerProps> = (dispatch) => ({
	loadSpeakLongTexts: bindActionCreators(actions.settings.loadSpeakLongTexts, dispatch),
	storeSpeakLongTexts: bindActionCreators(actions.settings.storeSpeakLongTexts, dispatch),
});

class TextContainer<P extends TextContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		this.props.loadSpeakLongTexts();
	}

	override render(): React.ReactNode {
		const {
			storeSpeakLongTexts,
			speakLongTexts,
		} = this.props;

		return (
			<Text
				speakLongTexts={speakLongTexts}
				storeSpeakLongTexts={storeSpeakLongTexts}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, TextContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	TextContainer,
);
