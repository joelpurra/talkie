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

import {
	LanguagesByLanguageGroup,
	VoicesByLanguage,
	VoicesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

import Voices from "../components/sections/voices";
import selectors from "../selectors/index";
import {
	actions,
} from "../slices/index";
import {
	OptionsRootState,
} from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VoicesContainerProps {}

interface StateProps {
	effectiveVoiceNameForSelectedLanguage?: string | null;
	isPremiumEdition: boolean;
	languageGroups: readonly string[];
	languages: readonly string[];
	languagesByLanguageGroup: LanguagesByLanguageGroup;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	sampleText?: string | null;
	selectedLanguageCode?: string | null;
	selectedVoiceName?: string | null;
	voices: readonly SafeVoiceObject[];
	voicesByLanguage: VoicesByLanguage<SafeVoiceObject>;
	voicesByLanguageGroup: VoicesByLanguageGroup<SafeVoiceObject>;
}

interface DispatchProps {
	loadSampleText: typeof actions.voices.loadSampleText;
	loadSelectedLanguageCode: typeof actions.voices.loadSelectedLanguageCode;
	loadSelectedVoiceName: typeof actions.voices.loadSelectedVoiceName;
	setSampleText: typeof actions.voices.setSampleText;
	storeEffectiveVoiceNameForLanguage: typeof actions.voices.storeEffectiveVoiceNameForLanguage;
	storeVoicePitchOverride: typeof actions.voices.storeVoicePitchOverride;
	storeVoiceRateOverride: typeof actions.voices.storeVoiceRateOverride;
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, VoicesContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	effectiveVoiceNameForSelectedLanguage: state.voices.effectiveVoiceNameForSelectedLanguage,
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	languageGroups: selectors.shared.voices.getLanguageGroups(state),
	languages: selectors.shared.voices.getLanguages(state),
	languagesByLanguageGroup: selectors.shared.voices.getLanguagesByLanguageGroup(state),
	pitchForSelectedVoice: state.voices.pitchForSelectedVoice,
	rateForSelectedVoice: state.voices.rateForSelectedVoice,
	sampleText: state.voices.sampleText,
	selectedLanguageCode: state.voices.selectedLanguageCode,
	selectedVoiceName: state.voices.selectedVoiceName,
	voices: selectors.shared.voices.getVoices(state),
	voicesByLanguage: selectors.shared.voices.getVoicesByLanguage(state),
	voicesByLanguageGroup: selectors.shared.voices.getVoicesByLanguageGroup(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, VoicesContainerProps> = (dispatch) => ({
	loadSampleText: bindActionCreators(actions.voices.loadSampleText, dispatch),
	loadSelectedLanguageCode: bindActionCreators(actions.voices.loadSelectedLanguageCode, dispatch),
	loadSelectedVoiceName: bindActionCreators(actions.voices.loadSelectedVoiceName, dispatch),
	setSampleText: bindActionCreators(actions.voices.setSampleText, dispatch),
	storeEffectiveVoiceNameForLanguage: bindActionCreators(actions.voices.storeEffectiveVoiceNameForLanguage, dispatch),
	storeVoicePitchOverride: bindActionCreators(actions.voices.storeVoicePitchOverride, dispatch),
	storeVoiceRateOverride: bindActionCreators(actions.voices.storeVoiceRateOverride, dispatch),
});

class VoicesContainer<P extends VoicesContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	static defaultProps = {
		effectiveVoiceNameForSelectedLanguage: null,
		sampleText: null,
		selectedLanguageCode: null,
		selectedVoiceName: null,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		// TODO: is this the best place to load data?
		this.props.loadSampleText();
	}

	override render(): React.ReactNode {
		const {
			effectiveVoiceNameForSelectedLanguage,
			isPremiumEdition,
			languageGroups,
			languages,
			languagesByLanguageGroup,
			loadSelectedLanguageCode,
			loadSelectedVoiceName,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			sampleText,
			selectedLanguageCode,
			selectedVoiceName,
			setSampleText,
			storeEffectiveVoiceNameForLanguage,
			storeVoicePitchOverride,
			storeVoiceRateOverride,
			voices,
			voicesByLanguage,
			voicesByLanguageGroup,
		} = this.props as VoicesContainerProps & StateProps & DispatchProps;

		// TODO: voices/languages may already be sorted externally, but internally sorting at lower code/abstraction levels seems inefficient?
		const sortedLanguages = languages.slice().sort((a, b) => a.localeCompare(b));
		const sortedLanguageGroups = languageGroups.slice().sort((a, b) => a.localeCompare(b));

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const sortedVoices = voices.slice().sort((a, b) => a.name.localeCompare(b.name));

		for (const voices of Object.values(voicesByLanguage)) {
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		for (const voices of Object.values(voicesByLanguageGroup)) {
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			voices.sort((a, b) => a.name.localeCompare(b.name));
		}

		for (const languages of Object.values(languagesByLanguageGroup)) {
			languages.sort((a, b) => a.localeCompare(b));
		}

		return (
			<Voices
				effectiveVoiceNameForSelectedLanguage={effectiveVoiceNameForSelectedLanguage}
				isPremiumEdition={isPremiumEdition}
				languageGroups={sortedLanguageGroups}
				languages={sortedLanguages}
				languagesByLanguageGroup={languagesByLanguageGroup}
				loadSelectedLanguageCode={loadSelectedLanguageCode}
				loadSelectedVoiceName={loadSelectedVoiceName}
				pitchForSelectedVoice={pitchForSelectedVoice}
				rateForSelectedVoice={rateForSelectedVoice}
				sampleText={sampleText}
				selectedLanguageCode={selectedLanguageCode}
				selectedVoiceName={selectedVoiceName}
				setSampleText={setSampleText}
				storeEffectiveVoiceNameForLanguage={storeEffectiveVoiceNameForLanguage}
				storeVoicePitchOverride={storeVoicePitchOverride}
				storeVoiceRateOverride={storeVoiceRateOverride}
				voices={sortedVoices}
				voicesByLanguage={voicesByLanguage}
				voicesByLanguageGroup={voicesByLanguageGroup}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, VoicesContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	VoicesContainer,
);
