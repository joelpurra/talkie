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

import MultilineSelect from "@talkie/shared-application/components/form/multiline-select";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as formBase from "@talkie/shared-application/styled/form/form-base";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";
import {
	ReadonlyDeep,
} from "type-fest";

export interface AvailableVoicesProps {
	disabled: boolean;
	effectiveVoiceNameForSelectedLanguage?: string | null;
	onChange: (voiceName: string) => void;
	value?: string | null;
	voices: ReadonlyDeep<SafeVoiceObject[]>;
}

class AvailableVoices<P extends AvailableVoicesProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		effectiveVoiceNameForSelectedLanguage: null,
		value: null,
	};

	styled: {
		effectiveVoiceOption: StyletronComponent<ComponentProps<typeof formBase.option>>;
	};

	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);

		this.styled = {
			effectiveVoiceOption: withStyleDeep(
				formBase.option,
				{
					fontWeight: "bold",
				},
			),
		};
	}

	handleChange(voiceName: string): void {
		this.props.onChange(voiceName);
	}

	override render(): React.ReactNode {
		const {
			disabled,
			effectiveVoiceNameForSelectedLanguage,
			translateSync,
			value,
			voices,
		} = this.props;

		const translatedVoiceFeatureOnline = translateSync("frontend_voiceFeatureOnline");

		const voicesOptions = (voices).map(
			(voice) => {
				const isEffectiveVoiceNameForSelectedLanguage = (
					effectiveVoiceNameForSelectedLanguage
					&& effectiveVoiceNameForSelectedLanguage === voice.name
				);

				const VoiceOption = isEffectiveVoiceNameForSelectedLanguage ? this.styled.effectiveVoiceOption : formBase.option;

				let voiceNameAndFeaturesText = voice.name;

				const voiceFeatures = [];

				if (!voice.localService) {
					voiceFeatures.push(translatedVoiceFeatureOnline);
				}

				if (voiceFeatures.length > 0) {
					voiceNameAndFeaturesText += " (";
					voiceNameAndFeaturesText += voiceFeatures.join(", ");
					voiceNameAndFeaturesText += ")";
				}

				if (isEffectiveVoiceNameForSelectedLanguage) {
					voiceNameAndFeaturesText += " ✓";
				}

				return (
					<VoiceOption
						key={voice.name}
						value={voice.name}
					>
						{voiceNameAndFeaturesText}
					</VoiceOption>
				);
			},
		);

		return (
			<MultilineSelect
				disabled={disabled}
				size={7}
				value={value}
				onChange={this.handleChange}
			>
				{voicesOptions}
			</MultilineSelect>
		);
	}
}

export default translateAttribute<AvailableVoicesProps & TranslateProps>()(
	AvailableVoices,
);
