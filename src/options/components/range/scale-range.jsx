/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020 Joel Purra <https://joelpurra.com/>

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

import * as formBase from "../../../shared/styled/form/form-base.jsx";

import ScaleRangeDatalist from "./scale-range-datalist.jsx";

export default class ScaleRange extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

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

    handleInput(e) {
        const value = parseFloat(e.target.value);

        this.props.onInput(value);
    }

    handleChange(e) {
        const value = parseFloat(e.target.value);

        this.props.onChange(value);
    }

    render() {
        const {
            min,
            defaultValue,
            max,
            initialValue,
            step,
            listName,
            disabled,
        } = this.props;

        const steps = [
            min,
            defaultValue,
            max,
        ];

        return (
            <div>
                <formBase.range
                    type="range"
                    min={min}
                    value={initialValue}
                    max={max}
                    step={step}
                    list={listName}
                    disabled={disabled || null}
                    onInput={this.handleInput}
                    onChange={this.handleChange}
                />

                <ScaleRangeDatalist steps={steps} listName={listName} />
            </div>
        );
    }
}
