/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import {
	type TranslateSync,
} from "@talkie/split-environment-interfaces/itranslator-provider.mjs";
import React from "react";

import LogarithmicScaleRange from "../../../../components/range/logarithmic-scale-range.js";
import {
	type ScaleRangeProps,
} from "../../../../components/range/scale-range.js";
import RangeWithHeading, {
	type RangeWithHeadingProps,
} from "./range-with-heading.js";

export interface RateProps extends Pick<RangeWithHeadingProps & ScaleRangeProps, "defaultValue" | "disabled" | "initialValue" | "listName" | "max" | "min" | "onChange" | "step" | "voiceName"> {}

class Rate<P extends RateProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		voiceName: null,
	};

	constructor(props: P) {
		super(props);

		this.transformValueBeforeChange = this.transformValueBeforeChange.bind(this);
		this.getHeading = this.getHeading.bind(this);
	}

	transformValueBeforeChange(value: number): number {
		// NOTE: step 0.1 for outside this component.
		const rounded = MathHelper.round10(value, -1);

		return rounded;
	}

	getHeading(voiceName: string | null | undefined, translateSync: TranslateSync): string {
		let heading = null;

		heading = typeof voiceName === "string" && voiceName.length > 0
			? translateSync("frontend_voicesRateHeading", [
				voiceName,
			])
			: translateSync("frontend_voicesRateEmptyHeading");

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
		} = this.props as P;

		return (
			<RangeWithHeading
				ScaleRangeElementClass={LogarithmicScaleRange}
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
}

export default translateAttribute<RateProps & TranslateProps>()(
	Rate,
);

