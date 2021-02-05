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
import Main from "../components/main.jsx";

const mapStateToProps = (state) => {
	return {
		activeTabId: state.unshared.navigation.activeTabId,
		isPremiumEdition: state.shared.metadata.isPremiumEdition,
		osType: state.shared.metadata.osType,
		shouldShowBackButton: state.navigation.shouldShowBackButton,
		systemType: state.shared.metadata.systemType,
		versionName: state.shared.metadata.versionName,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: {
			navigation: bindActionCreators(actionCreators.navigation, dispatch),
			sharedNavigation: bindActionCreators(actionCreators.shared.navigation, dispatch),
			sharedVoices: bindActionCreators(actionCreators.shared.voices, dispatch),
		},
	};
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class App extends React.PureComponent {
	static defaultProps = {
		osType: null,
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		activeTabId: PropTypes.string.isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
		osType: PropTypes.string,
		// eslint-disable-next-line react/boolean-prop-naming
		shouldShowBackButton: PropTypes.bool.isRequired,
		systemType: PropTypes.string.isRequired,
		versionName: PropTypes.string.isRequired,
	}

	render() {
		const {
			actions,
			isPremiumEdition,
			versionName,
			systemType,
			osType,
			activeTabId,
			shouldShowBackButton,
		} = this.props;

		return (
			<Main
				actions={actions}
				isPremiumEdition={isPremiumEdition}
				versionName={versionName}
				systemType={systemType}
				osType={osType}
				activeTabId={activeTabId}
				shouldShowBackButton={shouldShowBackButton}
			/>
		);
	}
}
