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

import PropTypes from "prop-types";
import React from "react";
import {
	connect,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

// TODO: use a HOC or something else?
import TalkieLocaleHelper from "../../shared/talkie-locale-helper";
// TODO: use a HOC or something else?
import LocaleProvider from "../../split-environments/locale-provider";
import actionCreators from "../actions";
import Welcome from "../components/sections/welcome.jsx";
import selectors from "../selectors";

const talkieLocaleHelper = new TalkieLocaleHelper();
const localeProvider = new LocaleProvider();

const mapStateToProps = (state) => {
	return {
		availableBrowserLanguageWithInstalledVoice: selectors.shared.voices.getAvailableBrowserLanguageWithInstalledVoice(state),
		isPremiumEdition: state.shared.metadata.isPremiumEdition,
		languageGroups: selectors.shared.voices.getLanguageGroups(state),
		languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
		languages: selectors.shared.voices.getLanguages(state),
		languagesCount: selectors.shared.voices.getLanguagesCount(state),
		osType: state.shared.metadata.osType,
		systemType: state.shared.metadata.systemType,
		voicesCount: selectors.shared.voices.getVoicesCount(state),
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: {
			sharedSpeaking: bindActionCreators(actionCreators.shared.speaking, dispatch),
			sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
		},
	};
};

export default

// eslint-disable-next-line react/no-unsafe
@connect(mapStateToProps, mapDispatchToProps)
class WelcomeContainer extends React.PureComponent {
	static defaultProps = {
		osType: null,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		availableBrowserLanguageWithInstalledVoice: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
		languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languageGroupsCount: PropTypes.number.isRequired,
		languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languagesCount: PropTypes.number.isRequired,
		osType: PropTypes.string,
		systemType: PropTypes.string.isRequired,
		voicesCount: PropTypes.number.isRequired,
	}

	// eslint-disable-next-line camelcase
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.voicesCount === 0) {
			// NOTE: since this welcome page is the first thing users see when installing Talkie, it's important that the voice list loads.
			// NOTE: sometimes the browser (Firefox?) has not actually loaded the voices (cold cache), and will instead synchronously return an empty array.
			// NOTE: wait a bit between retries, both to allow any voices to load, and to not bog down the system with a loop if there actually are no voices.
			const loadVoicesRetryDelay = 250;

			setTimeout(
				() => {
					// TODO: is this the best place to load data?
					this.props.actions.sharedVoices.loadVoices();
				},
				loadVoicesRetryDelay,
			);
		}
	}

	render() {
		const {
			actions,
			isPremiumEdition,
			systemType,
			osType,
			voicesCount,
			languagesCount,
			languageGroupsCount,
			languages,
			languageGroups,
			availableBrowserLanguageWithInstalledVoice,
		} = this.props;

		// TODO: create action and store as redux state?
		const availableBrowserLanguageWithInstalledVoiceAndSampleText = availableBrowserLanguageWithInstalledVoice
			.find((languageCode) => {
				// eslint-disable-next-line no-sync
				return Boolean(talkieLocaleHelper.getSampleTextSync(languageCode));
			});

		const firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText = availableBrowserLanguageWithInstalledVoiceAndSampleText || null;

		// TODO: create action and store as redux state?
		const sampleTextLanguageCode = firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText || null;
		let sampleText = null;

		if (sampleTextLanguageCode) {
			// eslint-disable-next-line no-sync
			sampleText = talkieLocaleHelper.getSampleTextSync(firstAvailableBrowserLanguageWithInstalledVoiceAndSampleText);
		}

		// TODO: create action and store as redux state?
		const translationLocale = localeProvider.getTranslationLocale();
		const canSpeakInTranslatedLocale = languages.includes(translationLocale) || languageGroups.includes(translationLocale);

		return (
			<Welcome
				canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
				isPremiumEdition={isPremiumEdition}
				languageGroupsCount={languageGroupsCount}
				languagesCount={languagesCount}
				osType={osType}
				sampleText={sampleText}
				sampleTextLanguageCode={sampleTextLanguageCode}
				speakTextInLanguageWithOverrides={actions.sharedSpeaking.speakTextInLanguageWithOverrides}
				systemType={systemType}
				voicesCount={voicesCount}
			/>
		);
	}
}
