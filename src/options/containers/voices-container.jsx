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

import actionCreators from "../actions";
import Voices from "../components/sections/voices.jsx";
import selectors from "../selectors";

const mapStateToProps = (state) => {
	return {
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: {
			sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
			voices: bindActionCreators(actionCreators.voices, dispatch),
		},
	};
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class VoicesContainer extends React.PureComponent {
	componentDidMount() {
		// TODO: is this the best place to load data?
		this.props.actions.sharedVoices.loadVoices();
		this.props.actions.voices.loadSampleText();
	}

	static defaultProps = {
		effectiveVoiceNameForSelectedLanguage: null,
		sampleText: null,
		selectedLanguageCode: null,
		selectedVoiceName: null,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		effectiveVoiceNameForSelectedLanguage: PropTypes.string,
		isPremiumEdition: PropTypes.bool.isRequired,
		languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languagesByLanguageGroup: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		).isRequired,
		pitchForSelectedVoice: PropTypes.number.isRequired,
		rateForSelectedVoice: PropTypes.number.isRequired,
		sampleText: PropTypes.string,
		selectedLanguageCode: PropTypes.string,
		selectedVoiceName: PropTypes.string,
		voices: PropTypes.arrayOf(PropTypes.shape({
			"default": PropTypes.bool.isRequired,
			lang: PropTypes.string.isRequired,
			localService: PropTypes.bool.isRequired,
			name: PropTypes.string.isRequired,
			voiceURI: PropTypes.string.isRequired,
		})).isRequired,
		voicesByLanguage: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.shape({
				"default": PropTypes.bool.isRequired,
				lang: PropTypes.string.isRequired,
				localService: PropTypes.bool.isRequired,
				name: PropTypes.string.isRequired,
				voiceURI: PropTypes.string.isRequired,
			})).isRequired,
		).isRequired,
		voicesByLanguageGroup: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.shape({
				"default": PropTypes.bool.isRequired,
				lang: PropTypes.string.isRequired,
				localService: PropTypes.bool.isRequired,
				name: PropTypes.string.isRequired,
				voiceURI: PropTypes.string.isRequired,
			})).isRequired,
		).isRequired,
	}

	render() {
		const {
			actions,
			voices,
			voicesByLanguage,
			voicesByLanguageGroup,
			languages,
			languageGroups,
			languagesByLanguageGroup,
			selectedLanguageCode,
			selectedVoiceName,
			effectiveVoiceNameForSelectedLanguage,
			sampleText,
			rateForSelectedVoice,
			pitchForSelectedVoice,
			isPremiumEdition,
		} = this.props;

		return (
			<Voices
				actions={actions}
				effectiveVoiceNameForSelectedLanguage={effectiveVoiceNameForSelectedLanguage}
				isPremiumEdition={isPremiumEdition}
				languageGroups={languageGroups}
				languages={languages}
				languagesByLanguageGroup={languagesByLanguageGroup}
				pitchForSelectedVoice={pitchForSelectedVoice}
				rateForSelectedVoice={rateForSelectedVoice}
				sampleText={sampleText}
				selectedLanguageCode={selectedLanguageCode}
				selectedVoiceName={selectedVoiceName}
				voices={voices}
				voicesByLanguage={voicesByLanguage}
				voicesByLanguageGroup={voicesByLanguageGroup}
			/>
		);
	}
}
