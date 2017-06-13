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

// import {
//     bindActionCreators,
// } from "redux";

import {
    connect,
} from "react-redux";

import StyleRoot from "../components/style-root.jsx";

// import actionCreators from "../actions";

const mapStateToProps = (state) => {
    return {
        isSpeaking: state.shared.speaking.isSpeaking,
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        versionName: state.shared.metadata.versionName,
        systemType: state.shared.metadata.systemType,
        osType: state.shared.metadata.osType,
    };
};

const mapDispatchToProps = (/* eslint-disable no-unused-vars */dispatch/* eslint-enable no-unused-vars */) => {
    return {};
};

@connect(mapStateToProps, mapDispatchToProps)
export default class StateRoot extends React.Component {
    static defaultProps = {
        isSpeaking: false,
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        isSpeaking: PropTypes.bool.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string,
        systemType: PropTypes.string,
        osType: PropTypes.string,
        children: PropTypes.element.isRequired,
    }

    render() {
        const {
            isSpeaking,
            isPremiumVersion,
            versionName,
            systemType,
            osType,
          } = this.props;

        return (
            <StyleRoot
                isSpeaking={isSpeaking}
                isPremiumVersion={isPremiumVersion}
                versionName={versionName}
                systemType={systemType}
                osType={osType}
            >
                {React.Children.only(this.props.children)}
            </StyleRoot>
        );
    }
}
