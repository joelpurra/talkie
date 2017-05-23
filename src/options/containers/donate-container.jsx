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

import Donate from "../components/sections/donate.jsx";

import * as actionCreators from "../actions/donations";

const mapStateToProps = (state) => {
    return {
        hideDonations: state.donations.hideDonations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actionCreators, dispatch),
    };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class DonateContainer extends React.Component {
    constructor(props) {
        super(props);

        this.handleHideDonationsChange = this.handleHideDonationsChange.bind(this);
    }

    componentWillMount() {
        // TODO: is this the best place to load data?
        this.props.actions.loadHideDonations();
    }

    static propTypes = {
        actions: PropTypes.object.isRequired,
        hideDonations: PropTypes.bool.isRequired,
    }

    handleHideDonationsChange(value) {
        this.props.actions.storeHideDonations(value);
    }

    render() {
        const {
            hideDonations,
          } = this.props;

        return (
            <Donate
                hideDonations={hideDonations}
                onChange={this.handleHideDonationsChange}
            />
        );
    }
}
