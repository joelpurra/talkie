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

import React from "react";

import {
	type actions,
} from "../slices/index.mjs";
import progressAttribute, {
	type ProgressProps,
} from "./progress.js";

export interface ProgressUpdaterStateProps extends ProgressProps {}

export interface ProgressUpdaterDispatchProps {
	setCurrent: typeof actions.progress.setCurrent;
	setMax: typeof actions.progress.setMax;
	setMin: typeof actions.progress.setMin;
}

class ProgressUpdater<P extends ProgressUpdaterStateProps & ProgressUpdaterDispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidUpdate(previousProps: P): void {
		const {
			current,
			max,
			min,
			setCurrent,
			setMax,
			setMin,
		} = this.props as ProgressUpdaterDispatchProps & ProgressProps;

		if (previousProps.min !== min) {
			setMin(min);
		}

		if (previousProps.current !== current) {
			setCurrent(current);
		}

		if (previousProps.max !== max) {
			setMax(max);
		}
	}

	override render(): React.ReactNode {
		return null;
	}
}

const ProgressUpdaterWorkaround = progressAttribute<ProgressUpdaterStateProps & ProgressUpdaterDispatchProps>()(
	ProgressUpdater,
);

/**
* @deprecated HACK: fix generic component class type propagation.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ProgressUpdaterTypehack: React.ComponentClass<any> = ProgressUpdaterWorkaround;

export default ProgressUpdaterWorkaround;
