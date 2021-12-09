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

import selectors from "../../selectors/index.mjs";
import type {
	OptionsRootState,
} from "../../store/index.mjs";
import Dialects from "../../components/sections/voices/dialects.js";

interface DialectsContainerProps {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectLanguageCodeClick: (languageCode: string | null, event: React.MouseEvent) => false;
}

interface StateProps {
	sortedLanguagesForSelectedLanguageGroup: string[];
}

interface DispatchProps {}

interface InternalProps extends DialectsContainerProps, StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state) => ({
	sortedLanguagesForSelectedLanguageGroup: selectors.voices.getSortedLanguagesForSelectedLanguageGroup(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (_dispatch) => ({});

class DialectsContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}


	override render(): React.ReactNode {
		const {
			onSelectLanguageCodeClick,
			sortedLanguagesForSelectedLanguageGroup,
		} = this.props as InternalProps;

		return (
			<Dialects
				languages={sortedLanguagesForSelectedLanguageGroup}
				onSelectLanguageCodeClick={onSelectLanguageCodeClick}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	DialectsContainer,
) as unknown as React.ComponentType<DialectsContainerProps>;
