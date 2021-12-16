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

import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import {
	TranslateSync,
} from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import React from "react";

import ScaleRange, {
	ScaleRangeProps,
} from "../../../../components/range/scale-range.js";
import RangeWithHeading, {
	RangeWithHeadingProps,
} from "./range-with-heading.js";

export interface PitchProps extends Pick<RangeWithHeadingProps & ScaleRangeProps, "defaultValue" | "disabled" | "initialValue" | "listName" | "max" | "min" | "onChange" | "step" | "voiceName"> {}

class Pitch<P extends PitchProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.transformValueBeforeChange = this.transformValueBeforeChange.bind(this);
		this.getHeading = this.getHeading.bind(this);
	}

	transformValueBeforeChange<T>(value: T): T {
		return value;
	}

	getHeading(voiceName: string | null | undefined, translateSync: TranslateSync): string {
		let heading = null;

		heading = typeof voiceName === "string" && voiceName.length > 0
			? translateSync("frontend_voicesPitchHeading", [
				voiceName,
			])
			: translateSync("frontend_voicesPitchEmptyHeading");

		return heading;
	}

	override render(): React.ReactNode {
		const {
			defaultValue,
			disabled,
			initialValue,
			listName,
			max,
			min,
			onChange,
			step,
			voiceName,
		} = this.props;

		return (
			<RangeWithHeading
				ScaleRangeElementClass={ScaleRange}
				defaultValue={defaultValue}
				disabled={disabled}
				getHeading={this.getHeading}
				initialValue={initialValue}
				listName={listName}
				max={max}
				min={min}
				step={step}
				transformValueBeforeChange={this.transformValueBeforeChange}
				voiceName={voiceName}
				onChange={onChange}
			/>
		);
	}

	static defaultProps = {
		voiceName: null,
	};
}

export default translateAttribute<PitchProps & TranslateProps>()(
	Pitch,
);
