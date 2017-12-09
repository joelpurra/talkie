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

import ScaleRange from "./scale-range.jsx";

export default class LogarithmicScaleRange extends React.PureComponent {
    static defaultProps = {
        listName: null,
        min: 0,
        defaultValue: 1,
        initialValue: 1,
        max: 10,
        step: 0.1,
        disabled: true,
    };

    static propTypes = {
        onInput: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
        listName: PropTypes.string.isRequired,
        min: PropTypes.number.isRequired,
        defaultValue: PropTypes.number.isRequired,
        initialValue: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    _toLogarithmicRangeScale(value) {
        const log = Math.round10(Math.log10(value) * 1000, 0);

        return log;
    }

    _fromLogarithmicRangeScale(value) {
        const linear = Math.pow(10, value / 1000);

        return linear;
    }

    handleInput(value) {
        const linearValue = this._fromLogarithmicRangeScale(value);

        this.props.onInput(linearValue);
    }

    handleChange(value) {
        const linearValue = this._fromLogarithmicRangeScale(value);

        this.props.onChange(linearValue);
    }

    render() {
        const {
            listName,
            min,
            defaultValue,
            initialValue,
            max,
            disabled,
        } = this.props;

        return (
            <ScaleRange
                listName={listName}
                min={this._toLogarithmicRangeScale(min)}
                defaultValue={this._toLogarithmicRangeScale(defaultValue)}
                initialValue={this._toLogarithmicRangeScale(initialValue)}
                max={this._toLogarithmicRangeScale(max)}
                step={1}
                disabled={disabled}
                onInput={this.handleInput}
                onChange={this.handleChange}
            />
        );
    }
}
