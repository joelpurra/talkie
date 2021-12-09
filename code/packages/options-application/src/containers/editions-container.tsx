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
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import toolkit from "@reduxjs/toolkit";
const {
	bindActionCreators,
} = toolkit;
import {
	ReadonlyDeep,
} from "type-fest";

import Editions, {
	EditionsDispatchProps,
} from "../components/sections/editions.js";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditionsContainerProps {}

interface StateProps {
	isPremiumEdition: boolean;
}

interface DispatchProps extends EditionsDispatchProps {
}

export interface InternalEditionsContainerProps extends StateProps, DispatchProps {}

const mapStateToProps: MapStateToProps<StateProps, EditionsContainerProps, OptionsRootState> = (state: ReadonlyDeep<OptionsRootState>) => ({
	isPremiumEdition: state.shared.metadata.isPremiumEdition,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, EditionsContainerProps> = (dispatch) => ({
	storeIsPremiumEdition: bindActionCreators(actions.shared.metadata.storeIsPremiumEdition, dispatch),
});

class EditionsContainer<P extends InternalEditionsContainerProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			storeIsPremiumEdition,
		} = this.props;

		return (
			<Editions
				isPremiumEdition={isPremiumEdition}
				storeIsPremiumEdition={storeIsPremiumEdition}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalEditionsContainerProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	EditionsContainer,
) as unknown as React.ComponentType<EditionsContainerProps>;
