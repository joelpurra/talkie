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

import {
	debounce,
} from "../../../../shared/basic";
import * as tableBase from "../../../../shared/styled/table/table-base.jsx";

export default

// eslint-disable-next-line react/no-unsafe
class RangeWithHeading extends React.PureComponent {
	constructor(props) {
		super(props);

		// eslint-disable-next-line react/state-in-constructor
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
	};

	static propTypes = {
		ScaleRangeElementClass: PropTypes.func.isRequired,
		defaultValue: PropTypes.number.isRequired,
		// eslint-disable-next-line react/boolean-prop-naming
		disabled: PropTypes.bool.isRequired,
		getHeading: PropTypes.func.isRequired,
		initialValue: PropTypes.number.isRequired,
		listName: PropTypes.string.isRequired,
		max: PropTypes.number.isRequired,
		min: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		step: PropTypes.number.isRequired,
		transformValueBeforeChange: PropTypes.func.isRequired,
		translate: PropTypes.func.isRequired,
		voiceName: PropTypes.string,
	}

	// eslint-disable-next-line camelcase
	UNSAFE_componentWillReceiveProps(nextProps) {
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
			value,
		});
	}

	handleChange(value) {
		// NOTE: not sure if the change will always have the same value as the most recent input value?
		this.setState({
			value,
		});

		const transformedValue = this.props.transformValueBeforeChange(value);

		this.debouncedOnChange(transformedValue);
	}

	render() {
		const {
			listName,
			getHeading,
			voiceName,
			translate,
			ScaleRangeElementClass,
			min,
			defaultValue,
			max,
			step,
			disabled,
		} = this.props;

		const heading = getHeading(voiceName, translate);

		return (
			<tableBase.tbody>
				<tableBase.tr>
					<tableBase.th scope="col">
						{heading}
						{" "}
						(
						{this.state.value.toFixed(1)}
						)
					</tableBase.th>
				</tableBase.tr>
				<tableBase.tr>
					<tableBase.td>
						<ScaleRangeElementClass
							defaultValue={defaultValue}
							disabled={disabled}
							initialValue={this.state.value}
							listName={listName}
							max={max}
							min={min}
							step={step}
							onChange={this.handleChange}
							onInput={this.handleInput}
						/>
					</tableBase.td>
				</tableBase.tr>
			</tableBase.tbody>
		);
	}
}
