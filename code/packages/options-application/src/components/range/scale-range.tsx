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

import * as formBase from "@talkie/shared-ui/styled/form/form-base.js";
import React from "react";

import ScaleRangeDatalist from "./scale-range-datalist.js";

export interface ScaleRangeProps {
	defaultValue: number;
	disabled: boolean;
	initialValue: number;
	listName: string;
	max: number;
	min: number;
	onChange: (value: number) => void;
	onInput?: (value: number) => void;
	step: number;
}

export default class ScaleRange<P extends ScaleRangeProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleInput(event: Readonly<React.ChangeEvent<HTMLInputElement>>): void {
		const value = Number.parseFloat(event.target.value);

		if (typeof this.props.onInput === "function") {
			this.props.onInput(value);
		}
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleChange(event: Readonly<React.ChangeEvent<HTMLInputElement>>): void {
		const value = Number.parseFloat(event.target.value);

		this.props.onChange(value);
	}

	override render(): React.ReactNode {
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
			<>
				<formBase.range
					disabled={disabled}
					list={listName}
					max={max}
					min={min}
					step={step}
					type="range"
					value={initialValue}
					onChange={this.handleChange}
					onInput={this.handleInput}
				/>

				<ScaleRangeDatalist
					disabled={disabled}
					listName={listName}
					steps={steps}
				/>
			</>
		);
	}
}
