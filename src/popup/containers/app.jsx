/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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
import PropTypes from "prop-types";

import {
    bindActionCreators,
} from "redux";

import {
    connect,
} from "react-redux";

import IsSpeakingUpdater from "../hocs/is-speaking-updater.jsx";
import ProgressUpdater from "../hocs/progress-updater.jsx";
import Main from "../components/main.jsx";

import actionCreators from "../actions";

const mapStateToProps = (state) => {
    return {
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        versionNumber: state.shared.metadata.versionNumber,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            sharedSpeaking: bindActionCreators(actionCreators.shared.speaking, dispatch),
            sharedNavigation: bindActionCreators(actionCreators.shared.navigation, dispatch),
            sharedProgress: bindActionCreators(actionCreators.shared.progress, dispatch),
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionNumber: PropTypes.string.isRequired,
    }

    render() {
        const {
            actions,
            isPremiumVersion,
            versionNumber,
        } = this.props;

        return (
            <div>
                <IsSpeakingUpdater
                    actions={actions}
                />

                <ProgressUpdater
                    actions={actions}
                />

                <Main
                    actions={actions}
                    isPremiumVersion={isPremiumVersion}
                    versionNumber={versionNumber}
                />
            </div>
        );
    }
}
