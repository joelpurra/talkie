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

import MathHelper from "@talkie/shared-application-helpers/math-helper.mjs";
import React from "react";

import ScaleRange, {
	type ScaleRangeProps,
} from "./scale-range.js";

export default class LogarithmicScaleRange<P extends ScaleRangeProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleInput(value: number): void {
		const linearValue = this._fromLogarithmicRangeScale(value);

		if (typeof this.props.onInput === "function") {
			this.props.onInput(linearValue);
		}
	}

	handleChange(value: number): void {
		const linearValue = this._fromLogarithmicRangeScale(value);

		this.props.onChange(linearValue);
	}

	override render(): React.ReactNode {
		const {
			listName,
			min,
			defaultValue,
			initialValue,
			max,
			disabled,
		} = this.props as P;

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

	private _toLogarithmicRangeScale(value: number): number {
		const log = MathHelper.round10(Math.log10(value) * 1000, 0);

		return log;
	}

	private _fromLogarithmicRangeScale(value: number): number {
		const linear = 10 ** (value / 1000);

		return linear;
	}
}
