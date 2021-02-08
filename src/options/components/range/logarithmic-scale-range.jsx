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

import PropTypes from "prop-types";
import React from "react";

import ScaleRange from "./scale-range.jsx";

export default class LogarithmicScaleRange extends React.PureComponent {
	static propTypes = {
		defaultValue: PropTypes.number.isRequired,
		// eslint-disable-next-line react/boolean-prop-naming
		disabled: PropTypes.bool.isRequired,
		initialValue: PropTypes.number.isRequired,
		listName: PropTypes.string.isRequired,
		max: PropTypes.number.isRequired,
		min: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		onInput: PropTypes.func.isRequired,
		// TODO: take step into consideration, at least when reporting back the converted number?
		// eslint-disable-next-line react/no-unused-prop-types
		step: PropTypes.number.isRequired,
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
		const linear = 10 ** (value / 1000);

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
				defaultValue={this._toLogarithmicRangeScale(defaultValue)}
				disabled={disabled}
				initialValue={this._toLogarithmicRangeScale(initialValue)}
				listName={listName}
				max={this._toLogarithmicRangeScale(max)}
				min={this._toLogarithmicRangeScale(min)}
				step={1}
				onChange={this.handleChange}
				onInput={this.handleInput}
			/>
		);
	}
}
