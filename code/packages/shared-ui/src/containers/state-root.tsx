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

import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import StyleRoot from "../components/style-root.js";
import type {
	SharedRootState,
} from "../store/index.mjs";
import {
	type ChildrenRequiredProps,
} from "../types.mjs";

export type StateRootProps = Record<string, unknown>;

interface StateProps {
	isPremiumEdition: boolean;
	versionName?: string | null;
}

type DispatchProps = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, StateRootProps, SharedRootState> = (state: Readonly<SharedRootState>) => ({
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
	versionName: state.shared.metadata.versionName,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, StateRootProps> = (_dispatch) => ({});

class StateRoot<P extends StateRootProps & StateProps & DispatchProps & ChildrenRequiredProps> extends React.PureComponent<P> {
	static defaultProps = {
		versionName: null,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			versionName,
		} = this.props;

		return (
			<StyleRoot
				isPremiumEdition={isPremiumEdition}
				versionName={versionName}
			>
				{React.Children.only(this.props.children)}
			</StyleRoot>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	StateRoot,
);
