/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import type {
	ReadonlyDeep,
} from "type-fest";

import type LogarithmicScaleRange from "../../../../components/range/logarithmic-scale-range.js";
import type ScaleRange from "../../../../components/range/scale-range.js";

import {
	debounce,
} from "@talkie/shared-application-helpers/basic.mjs";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import {
	type TranslateSync,
} from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import React from "react";

import {
	type ScaleRangeProps,
} from "../../../../components/range/scale-range.js";

export interface RangeWithHeadingProps {
	ScaleRangeElementClass: typeof ScaleRange<ScaleRangeProps> | typeof LogarithmicScaleRange<ScaleRangeProps>;
	getHeading: (voiceName: string | null | undefined, translateSync: TranslateSync) => string;
	initialValue: number;
	transformValueBeforeChange: (value: number) => number;
	voiceName?: string | null;
}

interface RangeWithHeadingState {
	value: number;
}

class RangeWithHeading<P extends RangeWithHeadingProps & ScaleRangeProps & TranslateProps> extends React.PureComponent<P, RangeWithHeadingState> {
	static defaultProps = {
		voiceName: null,
	};

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	static getDerivedStateFromProps(props: ReadonlyDeep<RangeWithHeadingProps>, state: ReadonlyDeep<RangeWithHeadingState>) {
		if (props.initialValue !== state.value) {
			return {
				...state,
				value: props.initialValue,
			};
		}

		return null;
	}

	override state = {
		value: this.props.initialValue,
	};

	debouncedOnChange: (value: number) => void;
	debouncedOnChangeCleanup: () => void;

	constructor(props: P) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.onChange = this.onChange.bind(this);

		[
			this.debouncedOnChange,
			this.debouncedOnChangeCleanup,
		] = debounce(this.onChange, 200);
	}

	override componentWillUnmount(): void {
		this.debouncedOnChangeCleanup();
	}

	onChange(value: number): void {
		this.props.onChange(value);
	}

	handleInput(value: number): void {
		this.setState({
			value,
		});
	}

	handleChange(value: number): void {
		// NOTE: not sure if the change will always have the same value as the most recent input value?
		this.setState({
			value,
		});

		const transformedValue = this.props.transformValueBeforeChange(value);

		this.debouncedOnChange(transformedValue);
	}

	override render(): React.ReactNode {
		const {
			listName,
			getHeading,
			voiceName,
			translateSync,
			ScaleRangeElementClass,
			min,
			defaultValue,
			max,
			step,
			disabled,
		} = this.props as P;

		const heading = getHeading(voiceName, translateSync);

		return (
			<tableBase.tbody>
				<tableBase.tr>
					<tableBase.th colSpan={2} scope="col">
						{heading}
						{" "}
						(
						{this.state.value.toFixed(1)}
						)
					</tableBase.th>
				</tableBase.tr>
				<tableBase.tr>
					<tableBase.td colSpan={2}>
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

export default translateAttribute<RangeWithHeadingProps & ScaleRangeProps & TranslateProps>()(
	RangeWithHeading,
);
