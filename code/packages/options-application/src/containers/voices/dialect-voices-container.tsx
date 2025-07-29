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
} from "../../store/index.mjs";

import {
	type SafeVoiceObjects,
} from "@talkie/shared-interfaces/ivoices.mjs";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import DialectVoices from "../../app/sections/voices/dialect-voices.js";
import selectors from "../../selectors/index.mjs";

interface DialectVoicesContainerProps {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectVoiceNameClick: (voiceName: string | null, event: React.MouseEvent) => false;
}

interface StateProps {
	voicesForSelectedLanguageCode: SafeVoiceObjects;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {}

interface InternalProps extends DialectVoicesContainerProps, StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	voicesForSelectedLanguageCode: selectors.voices.getVoicesForSelectedLanguageCode(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (_dispatch) => ({});

class DialectVoicesContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			onSelectVoiceNameClick,
			voicesForSelectedLanguageCode,
		} = this.props as InternalProps;

		return (
			<DialectVoices
				voices={voicesForSelectedLanguageCode}
				onSelectVoiceNameClick={onSelectVoiceNameClick}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	DialectVoicesContainer,
) as unknown as React.ComponentType<DialectVoicesContainerProps>;
