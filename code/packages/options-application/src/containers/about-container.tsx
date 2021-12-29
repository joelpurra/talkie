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
import {
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";

import About, {
	AboutStateProps,
} from "../app/sections/about.js";
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
interface AboutContainerProps {}

interface StateProps extends AboutStateProps {
	sortedByNameVoices: readonly SafeVoiceObject[];
	voiceNames: string[];
}

interface DispatchProps {
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
	speakTextInVoiceWithOverrides: typeof actions.shared.speaking.speakTextInVoiceWithOverrides;
}

interface InternalAboutContainerProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalAboutContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	navigatorLanguage: state.shared.languages.navigatorLanguage,
	osType: state.shared.metadata.osType,
	sortedByNameVoices: selectors.shared.voices.getSortedByNameVoices(state),
	sortedLanguageGroups: selectors.shared.voices.getSortedLanguageGroups(state),
	sortedLanguages: selectors.shared.voices.getSortedLanguages(state),
	sortedNavigatorLanguages: selectors.shared.languages.getSortedNavigatorLanguages(state),
	sortedTranslatedLanguages: selectors.shared.languages.getSortedTranslatedLanguages(state),
	systemType: state.shared.metadata.systemType,
	versionName: state.shared.metadata.versionName,
	voiceNames: selectors.shared.voices.getVoiceNames(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalAboutContainerProps> = (dispatch) => ({
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
	speakTextInVoiceWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInVoiceWithOverrides, dispatch),
});

class AboutContainer<P extends InternalAboutContainerProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
	}

	handleLegaleseClick(text: string): void {
		const legaleseText = text;

		// TODO: helper allowing a specific voice, with a specified text language as fallback.
		const legaleseVoiceName = "Zarvox";
		const legaleseLanguageCode = "en-US";

		if (this.props.voiceNames.includes(legaleseVoiceName)) {
			this.props.speakTextInVoiceWithOverrides({
				text: legaleseText,
				voiceName: legaleseVoiceName,
			});
		} else {
			this.props.speakTextInLanguageWithOverrides({
				languageCode: legaleseLanguageCode,
				text: legaleseText,
			});
		}
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			navigatorLanguage,
			osType,
			sortedByNameVoices,
			sortedLanguageGroups,
			sortedLanguages,
			sortedNavigatorLanguages,
			sortedTranslatedLanguages,
			systemType,
			versionName,
		} = this.props;

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const sortedVoiceNamesAndLanguages = sortedByNameVoices.map((voice) => `${voice.name} (${voice.lang})`);

		return (
			<About
				isPremiumEdition={isPremiumEdition}
				navigatorLanguage={navigatorLanguage}
				osType={osType}
				sortedLanguageGroups={sortedLanguageGroups}
				sortedLanguages={sortedLanguages}
				sortedNavigatorLanguages={sortedNavigatorLanguages}
				sortedTranslatedLanguages={sortedTranslatedLanguages}
				systemType={systemType}
				versionName={versionName}
				voiceNamesAndLanguages={sortedVoiceNamesAndLanguages}
				onLicenseClick={this.handleLegaleseClick}
			/>
		);
	}

	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};
}

export default connect<StateProps, DispatchProps, InternalAboutContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	AboutContainer,
) as unknown as React.ComponentType<AboutContainerProps>;
