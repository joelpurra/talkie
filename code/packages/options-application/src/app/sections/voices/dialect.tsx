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

import Icon from "@talkie/shared-ui/components/icon/icon.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import Loading from "../../../components/loading.js";
import MarkdownStrong from "../../../components/markdown/strong.js";

interface DialectProps extends TranslateProps {
	effectiveVoiceNameForSelectedLanguage: string | null;
	hasSampleTextForLanguageGroup: boolean;
	language: string;
	speakSampleTextForLanguage: (language: string) => void;
}

class Dialect<P extends DialectProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleSpeakLanguageClick = this.handleSpeakLanguageClick.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakLanguageClick(event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		if (this.props.language) {
			this.props.speakSampleTextForLanguage(this.props.language);
		}

		return false;
	}

	override render(): React.ReactNode {
		const {
			effectiveVoiceNameForSelectedLanguage,
			hasSampleTextForLanguageGroup,
			language,
			translateSync,
		} = this.props as DialectProps;

		// eslint-disable-next-line react/function-component-definition, @typescript-eslint/prefer-readonly-parameter-types
		const SpeakSampleButton: React.FunctionComponent<ChildrenRequiredProps> = ({
			children,
		}) => hasSampleTextForLanguageGroup
			? (
				<buttonBase.transparentButton
					type="button"
					// eslint-disable-next-line react/no-this-in-sfc
					onClick={this.handleSpeakLanguageClick}
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

		return (
			<textBase.p>
				<SpeakSampleButton>
					<Loading
						enabled={typeof effectiveVoiceNameForSelectedLanguage === "string"}
					>
						<MarkdownStrong>
							{translateSync(
								"frontend_voicesDefaultVoiceForDialect",
								[
									`**${language}**`,
									`**${effectiveVoiceNameForSelectedLanguage ?? ".."}**`,
								],
							)}
						</MarkdownStrong>
					</Loading>
				</SpeakSampleButton>
			</textBase.p>
		);
	}
}

export default translateAttribute<DialectProps>()(
	Dialect,
);
