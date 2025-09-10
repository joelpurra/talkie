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
} from "../../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Voices, {
	type VoicesStateProps,
} from "../../app/sections/voices.js";
import selectors from "../../selectors/index.mjs";
import {
	actions,
} from "../../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface VoicesContainerProps {}

interface StateProps extends VoicesStateProps {
	sampleTextForLanguageGroup: string | null;
}

interface DispatchProps {
	loadSelectedLanguageCode: typeof actions.voices.loadSelectedLanguageCode;
	loadSelectedLanguageGroup: typeof actions.voices.loadSelectedLanguageGroup;
	loadSelectedVoiceName: typeof actions.voices.loadSelectedVoiceName;
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
	speakTextInVoiceWithOverrides: typeof actions.shared.speaking.speakTextInVoiceWithOverrides;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	// TODO: layer to separate components by selected language group, language code, voice name.
	// TODO: remove the null case for all components which only depended on previously selected data.
	hasSelectedLanguageCode: selectors.voices.getHasSelectedLanguageCode(state),
	hasSelectedLanguageGroup: selectors.voices.getHasSelectedLanguageGroup(state),
	hasSelectedVoiceName: selectors.voices.getHasSelectedVoiceName(state),
	haveVoices: selectors.shared.voices.getHaveVoices(state),
	languageCountForSelectedLanguageGroup: selectors.voices.getLanguageCountForSelectedLanguageGroup(state),
	languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
	navigatorLanguages: selectors.shared.languages.getNavigatorLanguages(state),
	sampleTextForLanguageGroup: state.voices.sampleTextForLanguageGroup,
	selectedLanguageCode: state.voices.selectedLanguageCode,
	selectedLanguageGroup: state.voices.selectedLanguageGroup,
	selectedVoiceName: state.voices.selectedVoiceName,
	voiceCountForSelectedLanguageCode: selectors.voices.getVoiceCountForSelectedLanguageCode(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadSelectedLanguageCode: bindActionCreators(actions.voices.loadSelectedLanguageCode, dispatch),
	loadSelectedLanguageGroup: bindActionCreators(actions.voices.loadSelectedLanguageGroup, dispatch),
	loadSelectedVoiceName: bindActionCreators(actions.voices.loadSelectedVoiceName, dispatch),
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
	speakTextInVoiceWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInVoiceWithOverrides, dispatch),
});

class VoicesContainer<P extends InternalProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleSelectLanguageCodeClick = this.handleSelectLanguageCodeClick.bind(this);
		this.handleSelectLanguageGroupClick = this.handleSelectLanguageGroupClick.bind(this);
		this.handleSelectVoiceNameClick = this.handleSelectVoiceNameClick.bind(this);
		this.speakSampleTextForLanguage = this.speakSampleTextForLanguage.bind(this);
		this.speakSampleTextForVoiceName = this.speakSampleTextForVoiceName.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSelectLanguageCodeClick(selectedLanguageCode: string | null, event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.loadSelectedLanguageCode(selectedLanguageCode);

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSelectLanguageGroupClick(languageGroup: string | null, event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.loadSelectedLanguageGroup(languageGroup);

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSelectVoiceNameClick(voiceName: string | null, event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.loadSelectedVoiceName(voiceName);

		return false;
	}

	speakSampleTextForLanguage(languageCode: string) {
		const text = this.props.sampleTextForLanguageGroup;

		if (typeof text === "string") {
			this.props.speakTextInLanguageWithOverrides({
				languageCode,
				text,
			});
		}
	}

	speakSampleTextForVoiceName(voiceName: string): void {
		const text = this.props.sampleTextForLanguageGroup;

		if (typeof text === "string") {
			this.props.speakTextInVoiceWithOverrides({
				text,
				voiceName,
			});
		}
	}

	override render(): React.ReactNode {
		const {
			hasSelectedLanguageCode,
			hasSelectedLanguageGroup,
			hasSelectedVoiceName,
			haveVoices,
			languageCountForSelectedLanguageGroup,
			languageGroupsCount,
			selectedLanguageGroup,
			selectedLanguageCode,
			selectedVoiceName,
			voiceCountForSelectedLanguageCode,
		} = this.props as P;

		return (
			<Voices
				hasSelectedLanguageCode={hasSelectedLanguageCode}
				hasSelectedLanguageGroup={hasSelectedLanguageGroup}
				hasSelectedVoiceName={hasSelectedVoiceName}
				haveVoices={haveVoices}
				languageCountForSelectedLanguageGroup={languageCountForSelectedLanguageGroup}
				languageGroupsCount={languageGroupsCount}
				selectedLanguageCode={selectedLanguageCode}
				selectedLanguageGroup={selectedLanguageGroup}
				selectedVoiceName={selectedVoiceName}
				speakSampleTextForLanguage={this.speakSampleTextForLanguage}
				speakSampleTextForVoiceName={this.speakSampleTextForVoiceName}
				voiceCountForSelectedLanguageCode={voiceCountForSelectedLanguageCode}
				onSelectLanguageCodeClick={this.handleSelectLanguageCodeClick}
				onSelectLanguageGroupClick={this.handleSelectLanguageGroupClick}
				onSelectVoiceNameClick={this.handleSelectVoiceNameClick}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	VoicesContainer,
) as unknown as React.ComponentType<VoicesContainerProps>;
