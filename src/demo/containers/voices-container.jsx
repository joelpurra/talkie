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
import actionCreators from "../actions";
import Voices from "../components/sections/voices.jsx";
import selectors from "../selectors";

const talkieLocaleHelper = new TalkieLocaleHelper();

const mapStateToProps = (state) => {
	return {
		languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
		languagesCount: selectors.shared.voices.getLanguagesCount(state),
		navigatorLanguages: selectors.shared.voices.getNavigatorLanguages(state),
		voices: selectors.shared.voices.getVoices(state),
		voicesByLanguagesByLanguageGroup: selectors.shared.voices.getVoicesByLanguagesByLanguageGroup(state),
		voicesCount: selectors.shared.voices.getVoicesCount(state),
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
class VoicesContainer extends React.PureComponent {
	static propTypes = {
		actions: PropTypes.object.isRequired,
		languageGroupsCount: PropTypes.number.isRequired,
		languagesCount: PropTypes.number.isRequired,
		navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		voices: PropTypes.arrayOf(PropTypes.shape({
			"default": PropTypes.bool.isRequired,
			lang: PropTypes.string.isRequired,
			localService: PropTypes.bool.isRequired,
			name: PropTypes.string.isRequired,
			voiceURI: PropTypes.string.isRequired,
		})).isRequired,
		voicesByLanguagesByLanguageGroup: PropTypes.objectOf(
			PropTypes.objectOf(
				PropTypes.arrayOf(PropTypes.shape({
					"default": PropTypes.bool.isRequired,
					lang: PropTypes.string.isRequired,
					localService: PropTypes.bool.isRequired,
					name: PropTypes.string.isRequired,
					voiceURI: PropTypes.string.isRequired,
				})).isRequired,
			).isRequired,
		).isRequired,
		voicesCount: PropTypes.number.isRequired,
	}

	render() {
		const {
			actions,
			languageGroupsCount,
			languagesCount,
			navigatorLanguages,
			voices,
			voicesByLanguagesByLanguageGroup,
			voicesCount,
		} = this.props;

		return (
			<Voices
				actions={actions}
				voices={voices}
				voicesByLanguagesByLanguageGroup={voicesByLanguagesByLanguageGroup}
				navigatorLanguages={navigatorLanguages}
				voicesCount={voicesCount}
				languagesCount={languagesCount}
				languageGroupsCount={languageGroupsCount}
				talkieLocaleHelper={talkieLocaleHelper}
			/>
		);
	}
}
