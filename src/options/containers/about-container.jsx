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
import About from "../components/sections/about.jsx";
import selectors from "../selectors";

const mapStateToProps = (state) => {
	return {
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
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: {
			sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
		},
	};
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class AboutContainer extends React.PureComponent {
	componentDidMount() {
		// TODO: is this the best place to load data?
		this.props.actions.sharedVoices.loadVoices();
		this.props.actions.sharedVoices.loadNavigatorLanguage();
		this.props.actions.sharedVoices.loadNavigatorLanguages();
	}

	static defaultProps = {
		navigatorLanguage: null,
		osType: null,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
		languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		navigatorLanguage: PropTypes.string,
		navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		onLicenseClick: PropTypes.func.isRequired,
		osType: PropTypes.string,
		systemType: PropTypes.string.isRequired,
		translatedLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		versionName: PropTypes.string.isRequired,
		voices: PropTypes.arrayOf(PropTypes.shape({
			"default": PropTypes.bool.isRequired,
			lang: PropTypes.string.isRequired,
			localService: PropTypes.bool.isRequired,
			name: PropTypes.string.isRequired,
			voiceURI: PropTypes.string.isRequired,
		})).isRequired,
	}

	render() {
		const {
			isPremiumEdition,
			versionName,
			systemType,
			osType,
			navigatorLanguage,
			navigatorLanguages,
			translatedLanguages,
			onLicenseClick,
			voices,
			languages,
			languageGroups,
		} = this.props;

		return (
			<About
				isPremiumEdition={isPremiumEdition}
				languageGroups={languageGroups}
				languages={languages}
				navigatorLanguage={navigatorLanguage}
				navigatorLanguages={navigatorLanguages}
				osType={osType}
				systemType={systemType}
				translatedLanguages={translatedLanguages}
				versionName={versionName}
				voices={voices}
				onLicenseClick={onLicenseClick}
			/>
		);
	}
}
