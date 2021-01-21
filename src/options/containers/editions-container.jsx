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

import React from "react";
import PropTypes from "prop-types";

import {
    bindActionCreators,
} from "redux";

import {
    connect,
} from "react-redux";

import Editions from "../components/sections/editions.jsx";

import actionCreators from "../actions";

const mapStateToProps = (state) => {
    return {
        isPremiumEdition: state.shared.metadata.isPremiumEdition,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            sharedMetadata: bindActionCreators(actionCreators.shared.metadata, dispatch),
        },
    };
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class EditionsContainer extends React.PureComponent {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        isPremiumEdition: PropTypes.bool.isRequired,
    }

    render() {
        const {
            actions,
            isPremiumEdition,
        } = this.props;

        return (
            <Editions
                actions={actions}
                isPremiumEdition={isPremiumEdition}
            />
        );
    }
}
