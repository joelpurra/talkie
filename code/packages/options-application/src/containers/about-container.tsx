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

import About, {
	AboutStateProps,
} from "../components/sections/about";
import selectors from "../selectors/index";
import {
	actions,
} from "../slices/index";
import {
	OptionsRootState,
} from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AboutContainerProps {}

interface StateProps extends AboutStateProps {
	voices: readonly SafeVoiceObject[];
}

interface DispatchProps {
	loadNavigatorLanguage: typeof actions.shared.voices.loadNavigatorLanguage;
	loadNavigatorLanguages: typeof actions.shared.voices.loadNavigatorLanguages;
	speakInVoice: typeof actions.shared.speaking.speakInVoice;
}

interface InternalAboutContainerProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalAboutContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	languageGroups: selectors.shared.voices.getLanguageGroups(state),
	languages: selectors.shared.voices.getLanguages(state),
	navigatorLanguage: state.shared.voices.navigatorLanguage,
	navigatorLanguages: selectors.shared.voices.getNavigatorLanguages(state),
	osType: state.shared.metadata.osType,
	systemType: state.shared.metadata.systemType,
	translatedLanguages: state.shared.voices.translatedLanguages,
	versionName: state.shared.metadata.versionName,
	voices: selectors.shared.voices.getVoices(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalAboutContainerProps> = (dispatch) => ({
	loadNavigatorLanguage: bindActionCreators(actions.shared.voices.loadNavigatorLanguage, dispatch),
	loadNavigatorLanguages: bindActionCreators(actions.shared.voices.loadNavigatorLanguages, dispatch),
	speakInVoice: bindActionCreators(actions.shared.speaking.speakInVoice, dispatch),
});

class AboutContainer<P extends InternalAboutContainerProps> extends React.PureComponent<P> {
	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};

	constructor(props: P) {
		super(props);

		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
	}

	override componentDidMount(): void {
		// TODO: is this the best place to load data?
		this.props.loadNavigatorLanguage();
		this.props.loadNavigatorLanguages();
	}

	handleLegaleseClick(text: string): void {
		const legaleseText = text;
		const legaleseVoice = {
			lang: "en-US",
			name: "Zarvox",
		};

		this.props.speakInVoice({
			text: legaleseText,
			voice: legaleseVoice,
		});
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			versionName,
			systemType,
			osType,
			navigatorLanguage,
			navigatorLanguages,
			translatedLanguages,
			voices,
			languages,
			languageGroups,
		} = this.props;

		// TODO: voices/languages may already be sorted externally, but internally sorting at lower code/abstraction levels seems inefficient?
		const sortedNavigatorLanguages = navigatorLanguages.slice().sort((a, b) => a.localeCompare(b));
		const sortedLanguages = languages.slice().sort((a, b) => a.localeCompare(b));
		const sortedLanguageGroups = languageGroups.slice().sort((a, b) => a.localeCompare(b));
		const sortedTranslatedLanguages = translatedLanguages.slice().sort((a, b) => a.localeCompare(b));

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const sortedVoiceNames = voices.map((voice) => `${voice.name} (${voice.lang})`);
		sortedVoiceNames.sort((a, b) => a.localeCompare(b));

		return (
			<About
				isPremiumEdition={isPremiumEdition}
				languageGroups={sortedLanguageGroups}
				languages={sortedLanguages}
				navigatorLanguage={navigatorLanguage}
				navigatorLanguages={sortedNavigatorLanguages}
				osType={osType}
				systemType={systemType}
				translatedLanguages={sortedTranslatedLanguages}
				versionName={versionName}
				voiceNames={sortedVoiceNames}
				onLicenseClick={this.handleLegaleseClick}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalAboutContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	AboutContainer,
) as unknown as React.ComponentType<AboutContainerProps>;
