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
	type SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import Icon from "@talkie/shared-ui/components/icon/icon.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import MarkdownStrong from "../../../components/markdown/strong.js";
import InformationSection from "../../../components/section/information-section.js";
import DialectVoiceOptionsContainer from "../../../containers/voices/dialect-voice-options-container.js";

interface DialectVoiceProps extends TranslateProps {
	voice: SafeVoiceObject;
	speakSampleTextForVoiceName: (voiceName: string) => void;
	hasSampleTextForLanguageGroup: boolean;
}

class DialectVoice<P extends DialectVoiceProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleSpeakVoiceNameClick = this.handleSpeakVoiceNameClick.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakVoiceNameClick(event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.speakSampleTextForVoiceName(this.props.voice.name);

		return false;
	}

	override render(): React.ReactNode {
		const {
			hasSampleTextForLanguageGroup,
			translateSync,
			voice,
		} = this.props as DialectVoiceProps;

		// eslint-disable-next-line react/function-component-definition, @typescript-eslint/prefer-readonly-parameter-types
		const SpeakSampleButton: React.FunctionComponent<ChildrenRequiredProps> = ({
			children,
		}) => hasSampleTextForLanguageGroup
			? (
				<p>
					<buttonBase.transparentButton
						type="button"
						// eslint-disable-next-line react/no-this-in-sfc
						onClick={this.handleSpeakVoiceNameClick}
					>
						<Icon
							className="icon-voices"
							mode="inline"
						/>

						{children}
					</buttonBase.transparentButton>
				</p>
			)
			: null;

		return (
			<>
				<Discretional
					enabled={!voice.localService}
				>
					<InformationSection
						informationType="information"
					>
						<p>
							<MarkdownStrong>
								{translateSync(
									"frontend_voicesVoiceIsOnline",
									[
										`**${voice.name}**`,
									],
								)}
							</MarkdownStrong>
						</p>
					</InformationSection>
				</Discretional>

				<SpeakSampleButton>
					<MarkdownStrong>
						{translateSync(
							"frontend_voicesListenToVoiceSample",
							[
								`**${voice.name}**`,
							],
						)}
					</MarkdownStrong>
				</SpeakSampleButton>

				<DialectVoiceOptionsContainer/>
			</>
		);
	}
}

export default translateAttribute<DialectVoiceProps>()(
	DialectVoice,
);
