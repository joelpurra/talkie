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
} from "../../store/index.mjs";

import toolkit from "@reduxjs/toolkit";
import {
	type LanguageTextDirection,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import LanguageGroup from "../../app/sections/voices/language-group.js";
import Loading from "../../components/loading.js";
import selectors from "../../selectors/index.mjs";
import {
	actions,
} from "../../slices/index.mjs";

const {
	bindActionCreators,
} = toolkit;

interface LanguageGroupContainerProps {
	speakSampleTextForLanguage: (language: string) => void;
}

interface StateProps {
	assertedSelectedLanguageGroup: string;
	effectiveVoiceNameForSelectedLanguageGroup: string | null;
	hasSampleTextForLanguageGroup: boolean;
	sampleTextForLanguageGroup: string | null;
	textDirectionForSelectedLanguageGroup: LanguageTextDirection;
}

interface DispatchProps {
	loadSampleTextForLanguageGroup: typeof actions.voices.loadSampleTextForLanguageGroup;
}

interface InternalProps extends LanguageGroupContainerProps, StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	assertedSelectedLanguageGroup: selectors.voices.getAssertedSelectedLanguageGroup(state),
	effectiveVoiceNameForSelectedLanguage: state.voices.effectiveVoiceNameForSelectedLanguageCode,
	effectiveVoiceNameForSelectedLanguageGroup: state.voices.effectiveVoiceNameForSelectedLanguageGroup,
	hasSampleTextForLanguageGroup: selectors.voices.getHasSampleTextForLanguageGroup(state),
	sampleTextForLanguageGroup: state.voices.sampleTextForLanguageGroup,
	textDirectionForSelectedLanguageGroup: state.voices.textDirectionForSelectedLanguageGroup,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadSampleTextForLanguageGroup: bindActionCreators(actions.voices.loadSampleTextForLanguageGroup, dispatch),
});

class LanguageGroupContainer<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidMount(): void {
		// TODO: is this the best place to load data?
		this.props.loadSampleTextForLanguageGroup();
	}

	override render(): React.ReactNode {
		const {
			assertedSelectedLanguageGroup,
			effectiveVoiceNameForSelectedLanguageGroup,
			hasSampleTextForLanguageGroup,
			sampleTextForLanguageGroup,
			speakSampleTextForLanguage,
			textDirectionForSelectedLanguageGroup,
		} = this.props as InternalProps;

		const hasLoaded = typeof effectiveVoiceNameForSelectedLanguageGroup === "string";

		return (
			<Loading
				enabled={hasLoaded}
			>
				<LanguageGroup
					effectiveVoiceNameForSelectedLanguageGroup={effectiveVoiceNameForSelectedLanguageGroup!}
					hasSampleTextForLanguageGroup={hasSampleTextForLanguageGroup}
					languageGroup={assertedSelectedLanguageGroup}
					sampleTextForLanguageGroup={sampleTextForLanguageGroup}
					speakSampleTextForLanguage={speakSampleTextForLanguage}
					textDirectionForLanguageGroup={textDirectionForSelectedLanguageGroup}
				/>
			</Loading>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	LanguageGroupContainer,
) as unknown as React.ComponentType<LanguageGroupContainerProps>;
