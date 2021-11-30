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
import {
	bindActionCreators,
} from "redux";

import DialectVoiceOptions, {
} from "../../components/sections/voices/dialect-voice-options";
import selectors from "../../selectors/index";
import {
	actions,
} from "../../slices/index";
import type {
	OptionsRootState,
} from "../../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DialectVoiceOptionsContainerProps {}

interface StateProps {
	isEffectiveVoiceNameForLanguageCode: boolean;
	isEffectiveVoiceNameForLanguageGroup: boolean;
	isPremiumEdition: boolean;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	selectedLanguageCode: string | null;
	selectedLanguageGroup: string | null;
	selectedVoiceName: string | null;
	hasSelectedLanguageCode: boolean;
	hasSelectedVoiceName: boolean;
}

interface DispatchProps {
	storeEffectiveVoiceNameForLanguage: typeof actions.voices.storeEffectiveVoiceNameForLanguage;
	storeVoicePitchOverride: typeof actions.voices.storeVoicePitchOverride;
	storeVoiceRateOverride: typeof actions.voices.storeVoiceRateOverride;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	hasSelectedLanguageCode: selectors.voices.getHasSelectedLanguageCode(state),
	hasSelectedLanguageGroup: selectors.voices.getHasSelectedLanguageGroup(state),
	hasSelectedVoiceName: selectors.voices.getHasSelectedVoiceName(state),
	isEffectiveVoiceNameForLanguageCode: selectors.voices.getIsEffectiveVoiceNameForLanguageCode(state),
	isEffectiveVoiceNameForLanguageGroup: selectors.voices.getIsEffectiveVoiceNameForLanguageGroup(state),
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	navigatorLanguages: selectors.shared.languages.getNavigatorLanguages(state),
	pitchForSelectedVoice: state.voices.pitchForSelectedVoice,
	rateForSelectedVoice: state.voices.rateForSelectedVoice,
	selectedLanguageCode: state.voices.selectedLanguageCode,
	selectedLanguageGroup: state.voices.selectedLanguageGroup,
	selectedVoiceName: state.voices.selectedVoiceName,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
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
		if (
			this.props.hasSelectedVoiceName
			// NOTE: type safety check duplication.
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			&& typeof this.props.selectedVoiceName === "string"
		) {
			this.props.storeEffectiveVoiceNameForLanguage({
				languageCodeOrGroup,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	handleRateChange(value: number): void {
		if (
			this.props.hasSelectedVoiceName
			// NOTE: type safety check duplication.
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			&& typeof this.props.selectedVoiceName === "string"
		) {
			this.props.storeVoiceRateOverride({
				rate: value,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	handlePitchChange(value: number): void {
		if (
			this.props.hasSelectedLanguageCode
			// NOTE: type safety check duplication.
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			&& typeof this.props.selectedVoiceName === "string"
		) {
			this.props.storeVoicePitchOverride({
				pitch: value,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	override render(): React.ReactNode {
		const {
			isEffectiveVoiceNameForLanguageCode,
			isEffectiveVoiceNameForLanguageGroup,
			isPremiumEdition,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			selectedLanguageCode,
			selectedLanguageGroup,
			selectedVoiceName,
		} = this.props as InternalProps;

		if (!selectedLanguageGroup) {
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			throw new TypeError("selectedLanguageGroup");
		}

		if (!selectedLanguageCode) {
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			throw new TypeError("selectedLanguageCode");
		}

		if (!selectedVoiceName) {
			// TODO: ensure this component never receives null values, since it should never be shown for that state.
			throw new TypeError("selectedVoiceName");
		}

		return (
			<DialectVoiceOptions
				isEffectiveVoiceNameForLanguageCode={isEffectiveVoiceNameForLanguageCode}
				isEffectiveVoiceNameForLanguageGroup={isEffectiveVoiceNameForLanguageGroup}
				isPremiumEdition={isPremiumEdition}
				pitchForSelectedVoice={pitchForSelectedVoice}
				rateForSelectedVoice={rateForSelectedVoice}
				selectedLanguageCode={selectedLanguageCode}
				selectedLanguageGroup={selectedLanguageGroup}
				selectedVoiceName={selectedVoiceName}
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
