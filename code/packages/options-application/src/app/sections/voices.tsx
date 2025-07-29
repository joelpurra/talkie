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

import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import Loading from "../../components/loading.js";
import DialectContainer from "../../containers/voices/dialect-container.js";
import DialectVoiceContainer from "../../containers/voices/dialect-voice-container.js";
import DialectVoicesContainer from "../../containers/voices/dialect-voices-container.js";
import DialectsContainer from "../../containers/voices/dialects-container.js";
import LanguageGroupContainer from "../../containers/voices/language-group-container.js";
import LanguageGroupsContainer from "../../containers/voices/language-groups-container.js";

import Intro from "./voices/intro.js";

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

interface VoicesProps extends VoicesStateProps, VoicesDispatchProps, TranslateProps {}

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
			translateSync,
			voiceCountForSelectedLanguageCode,
		} = this.props as VoicesProps;

		const backArrow = (
			// TODO: apply arrow ltr/rtl direction.
			<>
				&larr;
			</>
		);

		return (
			<>
				<textBase.h1>
					{translateSync("frontend_voicesLinkText")}
				</textBase.h1>

				<section>
					<Intro/>
				</section>

				<section>
					<Loading
						enabled={haveVoices}
					>
						{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
						<textBase.h2
							// eslint-disable-next-line react/jsx-no-bind
							onClick={onSelectLanguageGroupClick.bind(null, null)}
						>
							<Discretional
								enabled={hasSelectedLanguageGroup && languageGroupsCount > 1}
							>
								{backArrow}
								&nbsp;
							</Discretional>

							{translateSync("frontend_systemInstalledLanguagesHeading")}
							{hasSelectedLanguageGroup && `: ${selectedLanguageGroup}`}

							<Discretional
								enabled={hasSelectedLanguageGroup && languageGroupsCount > 1}
							>
								<textBase.headingActionSpan>
									{" "}
									(
									<buttonBase.transparentButton
										type="button"
									>
										{translateSync("frontend_voicesShowAllListItems")}
									</buttonBase.transparentButton>
									)
								</textBase.headingActionSpan>
							</Discretional>
						</textBase.h2>

						<Discretional
							enabled={!hasSelectedLanguageGroup}
						>
							<LanguageGroupsContainer
								onSelectLanguageGroupClick={onSelectLanguageGroupClick}
							/>
						</Discretional>

						<Discretional
							enabled={hasSelectedLanguageGroup}
						>
							<LanguageGroupContainer
								speakSampleTextForLanguage={speakSampleTextForLanguage}
							/>
						</Discretional>
					</Loading>
				</section>

				<Discretional
					enabled={haveVoices && hasSelectedLanguageGroup}
				>
					<section>
						{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
						<textBase.h3
							// eslint-disable-next-line react/jsx-no-bind
							onClick={onSelectLanguageCodeClick.bind(null, null)}
						>
							<Discretional
								enabled={hasSelectedLanguageCode && languageCountForSelectedLanguageGroup > 1}
							>
								{backArrow}
								&nbsp;
							</Discretional>

							{translateSync("frontend_systemInstalledDialectsHeading")}
							{hasSelectedLanguageCode && `: ${selectedLanguageCode}`}

							<Discretional
								enabled={hasSelectedLanguageCode && languageCountForSelectedLanguageGroup > 1}
							>
								<textBase.headingActionSpan>
									{" "}
									(
									<buttonBase.transparentButton
										type="button"
									>
										{translateSync("frontend_voicesShowAllListItems")}
									</buttonBase.transparentButton>
									)
								</textBase.headingActionSpan>
							</Discretional>
						</textBase.h3>

						<Discretional
							enabled={!hasSelectedLanguageCode}
						>
							<p>
								{translateSync(
									"frontend_voicesFoundDialects",
									[
										languageCountForSelectedLanguageGroup.toString(10),
										selectedLanguageGroup ?? " (Error: no selected language group.)",
									],
								)}
							</p>

							<DialectsContainer
								onSelectLanguageCodeClick={onSelectLanguageCodeClick}
							/>
						</Discretional>

						<Discretional
							enabled={hasSelectedLanguageCode}
						>
							<DialectContainer
								speakSampleTextForLanguage={speakSampleTextForLanguage}
							/>
						</Discretional>
					</section>
				</Discretional>

				<Discretional
					enabled={hasSelectedLanguageGroup && hasSelectedLanguageCode}
				>
					<section>
						{/* TODO: decide on which level to put sections/headings; perhaps move to own class. */}
						<textBase.h4
							// eslint-disable-next-line react/jsx-no-bind
							onClick={onSelectVoiceNameClick.bind(null, null)}
						>
							<Discretional
								enabled={hasSelectedVoiceName && voiceCountForSelectedLanguageCode > 1}
							>
								{backArrow}
								&nbsp;
							</Discretional>

							{translateSync("frontend_systemInstalledVoicesHeading")}
							{hasSelectedVoiceName && `: ${selectedVoiceName}`}

							<Discretional
								enabled={hasSelectedVoiceName && voiceCountForSelectedLanguageCode > 1}
							>
								<textBase.headingActionSpan>
									{" "}
									(
									<buttonBase.transparentButton
										type="button"
									>
										{translateSync("frontend_voicesShowAllListItems")}
									</buttonBase.transparentButton>
									)
								</textBase.headingActionSpan>
							</Discretional>
						</textBase.h4>

						<Discretional
							enabled={!hasSelectedVoiceName}
						>
							<p>
								{
									translateSync(
										"frontend_voicesFoundVoicesForLanguage",
										[
											voiceCountForSelectedLanguageCode.toString(10),
											selectedLanguageCode ?? "(Error: no selected language code.)",
										],
									)
								}
							</p>

							<DialectVoicesContainer
								onSelectVoiceNameClick={onSelectVoiceNameClick}
							/>
						</Discretional>

						<Discretional
							enabled={hasSelectedVoiceName}
						>
							<DialectVoiceContainer
								speakSampleTextForVoiceName={speakSampleTextForVoiceName}
							/>
						</Discretional>
					</section>
				</Discretional>
			</>
		);
	}
}

export default translateAttribute<VoicesProps & TranslateProps>()(
	Voices,
);
