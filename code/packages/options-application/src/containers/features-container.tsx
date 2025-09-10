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
	OptionsRootState,
} from "../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Features, {
	type FeaturesDispatchProps,
} from "../app/sections/features.js";
import {
	actions,
} from "../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FeaturesContainerProps {}

interface StateProps {
	isPremiumEdition: boolean;
}

interface DispatchProps extends FeaturesDispatchProps {
}

export interface InternalFeaturesContainerProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, FeaturesContainerProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, FeaturesContainerProps> = (dispatch) => ({
	storeIsPremiumEdition: bindActionCreators(actions.shared.metadata.storeIsPremiumEdition, dispatch),
});

class FeaturesContainer<P extends InternalFeaturesContainerProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			storeIsPremiumEdition,
		} = this.props as P;

		return (
			<Features
				isPremiumEdition={isPremiumEdition}
				storeIsPremiumEdition={storeIsPremiumEdition}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalFeaturesContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	FeaturesContainer,
) as unknown as React.ComponentType<FeaturesContainerProps>;
