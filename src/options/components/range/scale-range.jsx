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

import * as formBase from "../../../shared/styled/form/form-base.jsx";

import ScaleRangeDatalist from "./scale-range-datalist.jsx";

export default class ScaleRange extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    static defaultProps = {
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
        min: PropTypes.number.isRequired,
        defaultValue: PropTypes.number.isRequired,
        initialValue: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        disabled: PropTypes.bool.isRequired,
    };

    generateId() {
        const rnd = (Math.pow(10, 10) + (Math.random() * Math.pow(10, 10)));

        return "ScaleRange-" + rnd.toFixed(0) + "-List";
    }

    componentWillMount() {
        const id = this.generateId();

        this.setState({
            id: id,
        });
    }

    handleInput(e) {
        const value = parseFloat(e.target.value);

        this.props.onInput(value);
    }

    handleChange(e) {
        const value = parseFloat(e.target.value);

        this.props.onChange(value);
    }

    render() {
        const steps = [
            this.props.min,
            this.props.defaultValue,
            this.props.max,
        ];

        return (
            <div>
                <formBase.range
                    type="range"
                    min={this.props.min}
                    value={this.props.initialValue}
                    max={this.props.max}
                    step={this.props.step}
                    list={this.state.id}
                    disabled={this.props.disabled || null}
                    onInput={this.handleInput}
                    onChange={this.handleChange}
                />

                <ScaleRangeDatalist steps={steps} id={this.state.id} />
            </div>
        );
    }
}
