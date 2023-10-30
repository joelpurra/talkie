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
	type TalkieProgressData,
} from "@talkie/shared-ui/talkie-progress.mjs";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Progress from "../app/sections/progress.js";
import type {
	PopupRootState,
} from "../store/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProgressContainerProps {}

interface StateProps extends TalkieProgressData {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, ProgressContainerProps, PopupRootState> = (state: Readonly<PopupRootState>) => ({
	current: state.shared.progress.current,
	max: state.shared.progress.max,
	min: state.shared.progress.min,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ProgressContainerProps> = (_dispatch) => ({});

class ProgressContainer<P extends ProgressContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			min,
			current,
			max,
		} = this.props;

		return (
			<Progress
				current={current}
				max={max}
				min={min}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, ProgressContainerProps, PopupRootState>(mapStateToProps, mapDispatchToProps)(
	ProgressContainer,
);
