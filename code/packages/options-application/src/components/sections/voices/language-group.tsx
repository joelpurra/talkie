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

import Icon from "@talkie/shared-application/components/icon/icon.js";
import Markdown from "@talkie/shared-application/components/markdown.js";
import * as buttonBase from "@talkie/shared-application/styled/button/button-base.js";
import * as textBase from "@talkie/shared-application/styled/text/text-base.js";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";


export interface LanguageGroupStateProps {
	effectiveVoiceNameForSelectedLanguageGroup: string;
	hasSampleTextForLanguageGroup: boolean;
	languageGroup: string;
	sampleTextForLanguageGroup: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LanguageGroupDispatchProps {}

interface LanguageGroupProps extends LanguageGroupStateProps, LanguageGroupDispatchProps {
	getTextDirectionClassNameForLanguageGroup: (languageGroup: string) => string;
	speakSampleTextForLanguage: (language: string) => void;
}

class LanguageGroup<P extends LanguageGroupProps> extends React.PureComponent<P> {
	private readonly styled: {
		sampleTextBlockQuote: StyletronComponent<ComponentProps<typeof textBase.blockquote>>;
	};

	constructor(props: P) {
		super(props);

		this.handleSpeakLanguageGroupClick = this.handleSpeakLanguageGroupClick.bind(this);

		this.styled = {
			sampleTextBlockQuote: withStyleDeep(
				textBase.blockquote,
				{
					fontSize: "1.5em",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakLanguageGroupClick(event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		if (this.props.languageGroup) {
			this.props.speakSampleTextForLanguage(this.props.languageGroup);
		}

		return false;
	}

	override render(): React.ReactNode {
		const {
			effectiveVoiceNameForSelectedLanguageGroup,
			getTextDirectionClassNameForLanguageGroup,
			hasSampleTextForLanguageGroup,
			languageGroup,
			sampleTextForLanguageGroup,
		} = this.props as LanguageGroupProps;

		const sampleTextBlockQuote = hasSampleTextForLanguageGroup
			? (
				<this.styled.sampleTextBlockQuote
					className={getTextDirectionClassNameForLanguageGroup(languageGroup)}
					lang={languageGroup}
				>
					<buttonBase.transparentButton
						onClick={this.handleSpeakLanguageGroupClick}
					>
						{sampleTextForLanguageGroup}
					</buttonBase.transparentButton>
				</this.styled.sampleTextBlockQuote>
			)
			: null;

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const SpeakSampleButton: React.FC = ({
			children,
		}) => hasSampleTextForLanguageGroup
			? (
				<buttonBase.transparentButton
					onClick={this.handleSpeakLanguageGroupClick}
				>
					<Icon
						className="icon-voices"
						mode="inline"
					/>

					{children}
				</buttonBase.transparentButton>
			)
			: (
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					{children}
				</>
			);

		const boldedLanguageGroupMarkdown = `**${languageGroup}**`;
		const boldedEffectiveVoiceNameForSelectedLanguageGroupMarkdown = `**${effectiveVoiceNameForSelectedLanguageGroup}**`;

		// TODO: translate.
		const effectiveVoiceDescriptionMarkdown = `The default voice for the language ${boldedLanguageGroupMarkdown} is ${boldedEffectiveVoiceNameForSelectedLanguageGroupMarkdown}.`;

		return (
			<>
				<textBase.p>
					<textBase.a href={`https://${languageGroup}.wikipedia.org/`}>
						<Icon
							className="icon-wikipedia-w"
							mode="inline"
						/>
						{languageGroup}
						.wikipedia.org
					</textBase.a>
				</textBase.p>

				{sampleTextBlockQuote}

				<textBase.p>
					<SpeakSampleButton>
						<Markdown>
							{effectiveVoiceDescriptionMarkdown}
						</Markdown>
					</SpeakSampleButton>
				</textBase.p>
			</>
		);
	}
}

export default LanguageGroup;
