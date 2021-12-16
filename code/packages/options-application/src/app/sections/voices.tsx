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

import Loading from "../../components/loading.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import LanguageGroupContainer from "../../containers/voices/language-group-container.js";
import LanguageGroupsContainer from "../../containers/voices/language-groups-container.js";
import DialectsContainer from "../../containers/voices/dialects-container.js";
import DialectContainer from "../../containers/voices/dialect-container.js";
import DialectVoicesContainer from "../../containers/voices/dialect-voices-container.js";
import DialectVoiceContainer from "../../containers/voices/dialect-voice-container.js";
import Intro from "./voices/intro.js";
import Discretional from "@talkie/shared-ui/components/discretional.js";

export interface VoicesStateProps {
	hasSelectedLanguageCode: boolean;
	hasSelectedLanguageGroup: boolean;
	hasSelectedVoiceName: boolean;
	haveVoices: boolean;
	languageCountForSelectedLanguageGroup: number;
	languageGroupsCount: number;
	selectedLanguageCode: string | null;
	selectedLanguageGroup: string | null;
	selectedVoiceName: string | null;
	voiceCountForSelectedLanguageCode: number;
}

interface VoicesDispatchProps {
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectLanguageCodeClick: (languageCode: string | null, event: React.MouseEvent) => false;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectLanguageGroupClick: (languageGroup: string | null, event: React.MouseEvent) => false;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectVoiceNameClick: (voiceName: string | null, event: React.MouseEvent) => false;
	speakSampleTextForLanguage: (language: string) => void;
	speakSampleTextForVoiceName: (voiceName: string) => void;
}

interface VoicesProps extends VoicesStateProps, VoicesDispatchProps {}

class Voices<P extends VoicesProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			hasSelectedLanguageCode,
			hasSelectedLanguageGroup,
			hasSelectedVoiceName,
			haveVoices,
			languageCountForSelectedLanguageGroup,
			languageGroupsCount,
			onSelectLanguageCodeClick,
			onSelectLanguageGroupClick,
			onSelectVoiceNameClick,
			selectedLanguageGroup,
			selectedLanguageCode,
			selectedVoiceName,
			speakSampleTextForLanguage,
			speakSampleTextForVoiceName,
			voiceCountForSelectedLanguageCode,
		} = this.props as VoicesProps;

		return (
			<>
				<layoutBase.section>
					<Intro/>
				</layoutBase.section>

				<Loading
					enabled={haveVoices}
				>
					<layoutBase.section>
						{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
						<textBase.h2
								// eslint-disable-next-line react/jsx-no-bind
								onClick={onSelectLanguageGroupClick.bind(null, null)}
						>
							{"Installed languages"}
							{hasSelectedLanguageGroup && `: ${selectedLanguageGroup}`}
							{hasSelectedLanguageGroup && languageGroupsCount > 1 && ` (${"show all"})`}
						</textBase.h2>

						{hasSelectedLanguageGroup || <LanguageGroupsContainer
							onSelectLanguageGroupClick={onSelectLanguageGroupClick}
						/>}

						{hasSelectedLanguageGroup && <LanguageGroupContainer
							speakSampleTextForLanguage={speakSampleTextForLanguage}
						/>}
					</layoutBase.section>

					<Discretional
						enabled={hasSelectedLanguageGroup}
					>
						<layoutBase.section>
							{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
							<textBase.h3
									// eslint-disable-next-line react/jsx-no-bind
									onClick={onSelectLanguageCodeClick.bind(null, null)}
								>
								{"Installed dialects"}
								{hasSelectedLanguageCode && `: ${selectedLanguageCode}`}
								{hasSelectedLanguageCode && languageCountForSelectedLanguageGroup > 1 && ` (${"show all"})`}
							</textBase.h3>

							{hasSelectedLanguageCode || <p>
									{`Found ${languageCountForSelectedLanguageGroup} dialects for ${selectedLanguageGroup}.`}
								</p>
							}

							{hasSelectedLanguageCode || <DialectsContainer
								onSelectLanguageCodeClick={onSelectLanguageCodeClick}
							/>}

							{hasSelectedLanguageCode && <DialectContainer
								speakSampleTextForLanguage={speakSampleTextForLanguage}
							/>}
						</layoutBase.section>
					</Discretional>

					<Discretional
						enabled={hasSelectedLanguageGroup && hasSelectedLanguageCode}
					>
						<layoutBase.section>
							{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
							<textBase.h4
									// eslint-disable-next-line react/jsx-no-bind
									onClick={onSelectVoiceNameClick.bind(null, null)}
								>
								{"Installed voices"}
								{hasSelectedVoiceName && `: ${selectedVoiceName}`}
								{hasSelectedVoiceName && voiceCountForSelectedLanguageCode > 1 && ` (${"show all"})`}
							</textBase.h4>

							{hasSelectedVoiceName || <p>
									{`Found ${voiceCountForSelectedLanguageCode} voices for ${selectedLanguageCode}.`}
								</p>
							}

							{hasSelectedVoiceName || <DialectVoicesContainer
								onSelectVoiceNameClick={onSelectVoiceNameClick}
							/>}

							{hasSelectedVoiceName && <DialectVoiceContainer
								speakSampleTextForVoiceName={speakSampleTextForVoiceName}
							/>}
						</layoutBase.section>
					</Discretional>
				</Loading>
			</>
		);
	}
}

export default Voices;
