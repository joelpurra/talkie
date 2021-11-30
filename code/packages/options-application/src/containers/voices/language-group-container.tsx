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

import Loading from "@talkie/shared-application/components/loading";
import * as HACKYHACKFUNCTIONS from "@talkie/shared-application/slices/languages-hack-functions";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

import LanguageGroup from "../../components/sections/voices/language-group";
import selectors from "../../selectors";
import {
	actions,
} from "../../slices/index";
import type {
	OptionsRootState,
} from "../../store";

interface LanguageGroupContainerProps {
	speakSampleTextForLanguage: (language: string) => void;
}

interface StateProps {
	effectiveVoiceNameForSelectedLanguageGroup: string | null;
	hasSampleTextForLanguageGroup: boolean;
	sampleTextForLanguageGroup: string | null;
	selectedLanguageGroup: string | null;
}

interface DispatchProps {
	loadSampleTextForLanguageGroup: typeof actions.voices.loadSampleTextForLanguageGroup;
}

interface InternalProps extends LanguageGroupContainerProps, StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state) => ({
	effectiveVoiceNameForSelectedLanguage: state.voices.effectiveVoiceNameForSelectedLanguageCode,
	effectiveVoiceNameForSelectedLanguageGroup: state.voices.effectiveVoiceNameForSelectedLanguageGroup,
	hasSampleTextForLanguageGroup: selectors.voices.getHasSampleTextForLanguageGroup(state),
	sampleTextForLanguageGroup: state.voices.sampleTextForLanguageGroup,
	selectedLanguageGroup: state.voices.selectedLanguageGroup,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadSampleTextForLanguageGroup: bindActionCreators(actions.voices.loadSampleTextForLanguageGroup, dispatch),
});

class LanguageGroupContainer<P extends InternalProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.getTextDirectionClassNameForLanguageGroup = this.getTextDirectionClassNameForLanguageGroup.bind(this);
	}

	override componentDidMount(): void {
		// TODO: is this the best place to load data?
		this.props.loadSampleTextForLanguageGroup();
	}

	getTextDirectionClassNameForLanguageGroup(languageCode: string): string {
		// eslint-disable-next-line no-sync
		return HACKYHACKFUNCTIONS.getTextDirectionClassNameForLanguageGroupSync(languageCode);
	}

	override render(): React.ReactNode {
		const {
			effectiveVoiceNameForSelectedLanguageGroup,
			hasSampleTextForLanguageGroup,
			sampleTextForLanguageGroup,
			selectedLanguageGroup,
			speakSampleTextForLanguage,
		} = this.props as InternalProps;

		if (typeof selectedLanguageGroup !== "string") {
			throw new TypeError("selectedLanguageGroup");
		}

		const hasLoaded = typeof effectiveVoiceNameForSelectedLanguageGroup === "string";

		return (
			<Loading
				enabled={hasLoaded}
			>
				<LanguageGroup
					effectiveVoiceNameForSelectedLanguageGroup={effectiveVoiceNameForSelectedLanguageGroup!}
					getTextDirectionClassNameForLanguageGroup={this.getTextDirectionClassNameForLanguageGroup}
					hasSampleTextForLanguageGroup={hasSampleTextForLanguageGroup}
					languageGroup={selectedLanguageGroup}
					sampleTextForLanguageGroup={sampleTextForLanguageGroup}
					speakSampleTextForLanguage={speakSampleTextForLanguage}
				/>
			</Loading>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	LanguageGroupContainer,
) as unknown as React.ComponentType<LanguageGroupContainerProps>;
