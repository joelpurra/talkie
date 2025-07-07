/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
} from "../../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import DialectVoiceOptions from "../../app/sections/voices/dialect-voice-options.js";
import selectors from "../../selectors/index.mjs";
import {
	actions,
} from "../../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DialectVoiceOptionsContainerProps {}

interface StateProps {
	isEffectiveVoiceNameForLanguageCode: boolean;
	isEffectiveVoiceNameForLanguageGroup: boolean;
	isPremiumEdition: boolean;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	assertedSelectedLanguageCode: string;
	assertedSelectedLanguageGroup: string;
	assertedSelectedVoiceName: string;
}

interface DispatchProps {
	storeEffectiveVoiceNameForLanguage: typeof actions.voices.storeEffectiveVoiceNameForLanguage;
	storeVoicePitchOverride: typeof actions.voices.storeVoicePitchOverride;
	storeVoiceRateOverride: typeof actions.voices.storeVoiceRateOverride;
	speakInSelectedVoiceNameState: typeof actions.voices.speakInSelectedVoiceNameState;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	assertedSelectedLanguageCode: selectors.voices.getAssertedSelectedLanguageCode(state),
	assertedSelectedLanguageGroup: selectors.voices.getAssertedSelectedLanguageGroup(state),
	assertedSelectedVoiceName: selectors.voices.getAssertedSelectedVoiceName(state),
	hasSelectedLanguageCode: selectors.voices.getHasSelectedLanguageCode(state),
	hasSelectedLanguageGroup: selectors.voices.getHasSelectedLanguageGroup(state),
	hasSelectedVoiceName: selectors.voices.getHasSelectedVoiceName(state),
	isEffectiveVoiceNameForLanguageCode: selectors.voices.getIsEffectiveVoiceNameForLanguageCode(state),
	isEffectiveVoiceNameForLanguageGroup: selectors.voices.getIsEffectiveVoiceNameForLanguageGroup(state),
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	navigatorLanguages: selectors.shared.languages.getNavigatorLanguages(state),
	pitchForSelectedVoice: state.voices.pitchForSelectedVoice,
	rateForSelectedVoice: state.voices.rateForSelectedVoice,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	speakInSelectedVoiceNameState: bindActionCreators(actions.voices.speakInSelectedVoiceNameState, dispatch),
	storeEffectiveVoiceNameForLanguage: bindActionCreators(actions.voices.storeEffectiveVoiceNameForLanguage, dispatch),
	storeVoicePitchOverride: bindActionCreators(actions.voices.storeVoicePitchOverride, dispatch),
	storeVoiceRateOverride: bindActionCreators(actions.voices.storeVoiceRateOverride, dispatch),
});

class DialectVoiceOptionsContainer<P extends InternalProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handlePickDefaultClick = this.handlePickDefaultClick.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handlePitchChange = this.handlePitchChange.bind(this);
	}

	handlePickDefaultClick(languageCodeOrGroup: string): void {
		this.props.storeEffectiveVoiceNameForLanguage({
			languageCodeOrGroup,
			voiceName: this.props.assertedSelectedVoiceName,
		});
	}

	handleRateChange(value: number): void {
		this.props.storeVoiceRateOverride(value);
		this.props.speakInSelectedVoiceNameState();
	}

	handlePitchChange(value: number): void {
		this.props.storeVoicePitchOverride(value);
		this.props.speakInSelectedVoiceNameState();
	}

	override render(): React.ReactNode {
		const {
			isEffectiveVoiceNameForLanguageCode,
			isEffectiveVoiceNameForLanguageGroup,
			isPremiumEdition,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			assertedSelectedLanguageCode,
			assertedSelectedLanguageGroup,
			assertedSelectedVoiceName,
		} = this.props as InternalProps;

		return (
			<DialectVoiceOptions
				isEffectiveVoiceNameForLanguageCode={isEffectiveVoiceNameForLanguageCode}
				isEffectiveVoiceNameForLanguageGroup={isEffectiveVoiceNameForLanguageGroup}
				isPremiumEdition={isPremiumEdition}
				pitchForSelectedVoice={pitchForSelectedVoice}
				rateForSelectedVoice={rateForSelectedVoice}
				selectedLanguageCode={assertedSelectedLanguageCode}
				selectedLanguageGroup={assertedSelectedLanguageGroup}
				selectedVoiceName={assertedSelectedVoiceName}
				onPickDefaultClick={this.handlePickDefaultClick}
				onPitchChange={this.handlePitchChange}
				onRateChange={this.handleRateChange}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	DialectVoiceOptionsContainer,
) as unknown as React.ComponentType<DialectVoiceOptionsContainerProps>;
