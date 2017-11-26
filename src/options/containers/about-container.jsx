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

import About from "../components/sections/about.jsx";

import actionCreators from "../actions";

const mapStateToProps = (state) => {
    return {
        isPremiumVersion: state.shared.metadata.isPremiumVersion,
        versionName: state.shared.metadata.versionName,
        systemType: state.shared.metadata.systemType,
        osType: state.shared.metadata.osType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators.shared.metadata, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AboutContainer extends React.Component {
    componentDidMount() {
        // TODO: is this the best place to load data?
        this.props.actions.loadVersionName();
    }

    static defaultProps = {
        isPremiumVersion: false,
        versionName: null,
        systemType: null,
        osType: null,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        versionName: PropTypes.string.isRequired,
        systemType: PropTypes.string.isRequired,
        osType: PropTypes.string,
        onLicenseClick: PropTypes.func.isRequired,
    }

    render() {
        const {
            isPremiumVersion,
            versionName,
            systemType,
            osType,
            onLicenseClick,
        } = this.props;

        return (
            <About
                isPremiumVersion={isPremiumVersion}
                versionName={versionName}
                systemType={systemType}
                osType={osType}
                onLicenseClick={onLicenseClick}
            />
        );
    }
}
