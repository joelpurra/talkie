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

import * as formBase from "../../../shared/styled/form/form-base.jsx";
import ScaleRangeDatalist from "./scale-range-datalist.jsx";

export default class ScaleRange extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

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
		step: PropTypes.number.isRequired,
	};

	handleInput(event) {
		const value = Number.parseFloat(event.target.value);

		this.props.onInput(value);
	}

	handleChange(event) {
		const value = Number.parseFloat(event.target.value);

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

				<ScaleRangeDatalist steps={steps} listName={listName}/>
			</div>
		);
	}
}
