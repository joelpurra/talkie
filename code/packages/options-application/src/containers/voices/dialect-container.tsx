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

import Dialect from "../../app/sections/voices/dialect.js";
import Loading from "../../components/loading.js";
import selectors from "../../selectors/index.mjs";
import type {
	OptionsRootState,
} from "../../store/index.mjs";

interface DialectContainerProps {
	speakSampleTextForLanguage: (language: string) => void;
}

interface StateProps {
	assertedSelectedLanguageCode: string;
	effectiveVoiceNameForSelectedLanguage: string | null;
	hasSampleTextForLanguageGroup: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DispatchProps {}

interface InternalProps extends DialectContainerProps, StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	assertedSelectedLanguageCode: selectors.voices.getAssertedSelectedLanguageCode(state),
	effectiveVoiceNameForSelectedLanguage: state.voices.effectiveVoiceNameForSelectedLanguageCode,
	hasSampleTextForLanguageGroup: selectors.voices.getHasSampleTextForLanguageGroup(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (_dispatch) => ({});

class DialectContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			assertedSelectedLanguageCode,
			effectiveVoiceNameForSelectedLanguage,
			hasSampleTextForLanguageGroup,
			speakSampleTextForLanguage,
		} = this.props as InternalProps;

		// TODO: state/selector?
		const hasLoaded = typeof effectiveVoiceNameForSelectedLanguage === "string";

		return (
			<Loading
				enabled={hasLoaded}
			>
				<Dialect
					effectiveVoiceNameForSelectedLanguage={effectiveVoiceNameForSelectedLanguage}
					hasSampleTextForLanguageGroup={hasSampleTextForLanguageGroup}
					language={assertedSelectedLanguageCode}
					speakSampleTextForLanguage={speakSampleTextForLanguage}
				/>
			</Loading>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	DialectContainer,
) as unknown as React.ComponentType<DialectContainerProps>;
