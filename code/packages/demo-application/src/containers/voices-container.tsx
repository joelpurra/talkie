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
	VoicesByLanguagesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

import Voices, {
	VoicesDispatchProps,
} from "../components/sections/voices";
import selectors from "../selectors/index";
import {
	actions,
} from "../slices/index";
import {
	DemoRootState,
} from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface VoicesContainerProps {}

interface StateProps {
	languageGroupsCount: number;
	languagesCount: number;
	navigatorLanguages: readonly string[];
	voices: readonly SafeVoiceObject[];
	voicesByLanguagesByLanguageGroup: VoicesByLanguagesByLanguageGroup<SafeVoiceObject>;
	voicesCount: number;
}

interface DispatchProps extends VoicesDispatchProps {}

interface InternalVoicesContainerProps extends StateProps, DispatchProps {}

// TODO: move to actions/api.
// TODO: use a HOC or something else?
const talkieLocaleHelper = new TalkieLocaleHelper();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalVoicesContainerProps, DemoRootState> = (state: Readonly<DemoRootState>) => ({
	languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
	languagesCount: selectors.shared.voices.getLanguagesCount(state),
	navigatorLanguages: selectors.shared.voices.getNavigatorLanguages(state),
	voices: selectors.shared.voices.getVoices(state),
	voicesByLanguagesByLanguageGroup: selectors.shared.voices.getVoicesByLanguagesByLanguageGroup(state),
	voicesCount: selectors.shared.voices.getVoicesCount(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalVoicesContainerProps> = (dispatch) => ({
	speakInVoice: bindActionCreators(actions.shared.speaking.speakInVoice, dispatch),
});

class VoicesContainer<P extends InternalVoicesContainerProps & StateProps & DispatchProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			speakInVoice,
			languageGroupsCount,
			languagesCount,
			navigatorLanguages,
			voices,
			voicesByLanguagesByLanguageGroup,
			voicesCount,
		} = this.props;

		return (
			<Voices
				languageGroupsCount={languageGroupsCount}
				languagesCount={languagesCount}
				navigatorLanguages={navigatorLanguages}
				speakInVoice={speakInVoice}
				talkieLocaleHelper={talkieLocaleHelper}
				voices={voices}
				voicesByLanguagesByLanguageGroup={voicesByLanguagesByLanguageGroup}
				voicesCount={voicesCount}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalVoicesContainerProps, DemoRootState>(mapStateToProps, mapDispatchToProps)(
	VoicesContainer,
) as unknown as React.ComponentType<VoicesContainerProps>;
