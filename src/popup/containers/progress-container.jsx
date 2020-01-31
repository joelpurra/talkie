/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019 Joel Purra <https://joelpurra.com/>

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
    connect,
} from "react-redux";

import Progress from "../components/sections/progress.jsx";

const mapStateToProps = (state) => {
    return {
        min: state.shared.progress.min,
        current: state.shared.progress.current,
        max: state.shared.progress.max,
    };
};

const mapDispatchToProps = (/* eslint-disable no-unused-vars */dispatch/* eslint-enable no-unused-vars */) => {
    return {};
};

export default
@connect(mapStateToProps, mapDispatchToProps)
class ProgressContainer extends React.PureComponent {
    static propTypes = {
        min: PropTypes.number.isRequired,
        current: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
    }

    render() {
        const {
            min,
            current,
            max,
        } = this.props;

        return (
            <Progress
                min={min}
                current={current}
                max={max}
            />
        );
    }
}
