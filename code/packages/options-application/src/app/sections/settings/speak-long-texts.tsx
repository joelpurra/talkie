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

import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import CheckboxWithLabel from "../../../components/form/checkbox-with-label.js";

export interface SpeakLongTextsProps {
	disabled: boolean;
	onChange: (speakLongTexts: boolean) => void;
	speakLongTexts: boolean;
}

class SpeakLongTexts<P extends SpeakLongTextsProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(speakLongTexts: boolean): void {
		this.props.onChange(speakLongTexts);
	}

	override render(): React.ReactNode {
		const {
			speakLongTexts,
			disabled,
			translateSync,
		} = this.props;

		return (
			<>
				<textBase.h2>
					{translateSync("frontend_voicesSpeakLongTextsHeading")}
				</textBase.h2>
				<p>
					{translateSync("frontend_voicesSpeakLongTextsExplanation01")}
				</p>
				<p>
					{translateSync("frontend_voicesSpeakLongTextsExplanation02")}
				</p>
				<p>
					<CheckboxWithLabel
						checked={speakLongTexts}
						disabled={disabled}
						onChange={this.handleChange}
					>
						{translateSync("frontend_voicesSpeakLongTextsLabel")}
					</CheckboxWithLabel>
				</p>
			</>
		);
	}
}

export default translateAttribute<SpeakLongTextsProps & TranslateProps>()(
	SpeakLongTexts,
);
