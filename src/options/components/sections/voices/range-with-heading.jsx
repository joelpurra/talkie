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
    debounce,
} from "../../../../shared/basic";

import translate from "../../../hocs/translate.jsx";

@translate
export default class RangeWithHeading extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            value: props.initialValue,
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.onChange = this.onChange.bind(this);
        this.debouncedOnChange = debounce(this.onChange, 200);
    }

    static defaultProps = {
        voiceName: null,
        min: 0,
        defaultValue: 1,
        initialValue: 1,
        max: 2,
        step: 0.1,
        disabled: true,
    };

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        transformValueBeforeChange: PropTypes.func.isRequired,
        getHeading: PropTypes.func.isRequired,
        ScaleRangeElementClass: PropTypes.func.isRequired,
        voiceName: PropTypes.string,
        min: PropTypes.number.isRequired,
        defaultValue: PropTypes.number.isRequired,
        initialValue: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        disabled: PropTypes.bool,
        translate: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.initialValue) {
            this.setState({
                value: nextProps.initialValue,
            });
        }
    }

    onChange(value) {
        this.props.onChange(value);
    }

    handleInput(value) {
        this.setState({
            value: value,
        });
    }

    handleChange(value) {
        // NOTE: not sure if the change will always have the same value as the most recent input value?
        this.setState({
            value: value,
        });

        const transformedValue = this.props.transformValueBeforeChange(value);

        this.debouncedOnChange(transformedValue);
    }

    render() {
        const heading = this.props.getHeading(this.props.voiceName, this.props.translate);

        return (
            <tbody>
                <tr>
                    <th scope="col">
                        {heading}
                        {" "}
                        ({this.state.value.toFixed(1)})
                    </th>
                </tr>
                <tr>
                    <td>
                        <this.props.ScaleRangeElementClass
                            min={this.props.min}
                            defaultValue={this.props.defaultValue}
                            initialValue={this.state.value}
                            max={this.props.max}
                            step={this.props.step}
                            disabled={this.props.disabled}
                            onInput={this.handleInput}
                            onChange={this.handleChange}
                        />
                    </td>
                </tr>
            </tbody>
        );
    }
}
