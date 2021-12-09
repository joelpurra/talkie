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

import {
	ScaleRangeProps,
} from "@talkie/shared-application/components/range/scale-range.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate.js";
import * as tableBase from "@talkie/shared-application/styled/table/table-base.js";
import {
	debounce,
} from "@talkie/shared-application-helpers/basic.mjs";
import {
	TranslateSync,
} from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import React from "react";
import {
	ReadonlyDeep,
} from "type-fest";

export interface RangeWithHeadingProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	ScaleRangeElementClass: any;
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

	override state = {
		value: this.props.initialValue,
	};

	debouncedOnChange: (value: number) => void;

	constructor(props: P) {
		super(props);

		this.handleInput = this.handleInput.bind(this);
		this.handleChange = this.handleChange.bind(this);

		this.onChange = this.onChange.bind(this);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.debouncedOnChange = debounce(this.onChange as any, 200);
	}

	static getDerivedStateFromProps(props: ReadonlyDeep<RangeWithHeadingProps>, state: ReadonlyDeep<RangeWithHeadingState>) {
		if (props.initialValue !== state.value) {
			return {
				...state,
				value: props.initialValue,
			};
		}

		return null;
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
		} = this.props;

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
