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

import type {
	OptionsRootState,
} from "../store/index.mjs";

import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import InstallVoices, {
	type InstallVoicesProps,
} from "../app/sections/support/install-voices.js";
import selectors from "../selectors/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InstallVoicesContainerProps {}

interface StateProps extends InstallVoicesProps {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	haveVoices: selectors.shared.voices.getHaveVoices(state),
	languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
	languagesCount: selectors.shared.voices.getLanguagesCount(state),
	osType: state.shared.metadata.osType,
	showAdditionalDetails: state.settings.showAdditionalDetails,
	voicesCount: selectors.shared.voices.getVoicesCount(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (_dispatch) => ({});

class InstallVoicesContainer<P extends InternalProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			haveVoices,
			languageGroupsCount,
			languagesCount,
			osType,
			showAdditionalDetails,
			voicesCount,
		} = this.props as P;

		return (
			<InstallVoices
				haveVoices={haveVoices}
				languageGroupsCount={languageGroupsCount}
				languagesCount={languagesCount}
				osType={osType}
				showAdditionalDetails={showAdditionalDetails}
				voicesCount={voicesCount}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	InstallVoicesContainer,
) as unknown as React.ComponentType<InstallVoicesContainerProps>;
