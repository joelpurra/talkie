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
import {
	LanguagesByLanguageGroup,
	VoicesByLanguage,
	VoicesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import React from "react";

export interface AvailableLanguagesProps {
	disabled: boolean;
	languageGroups: readonly string[];
	languagesByLanguageGroup: LanguagesByLanguageGroup;
	onChange: (languageName: string | null) => void;
	value?: string | null;
	voicesByLanguage: VoicesByLanguage<SafeVoiceObject>;
	voicesByLanguageGroup: VoicesByLanguageGroup<SafeVoiceObject>;
}

class AvailableLanguages<P extends AvailableLanguagesProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		value: null,
	};

	private get defaultAllLanguagesValue() {
		return "all-languages";
	}

	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(newlySelectedLanguageName: string): void {
		let languageName = null;

		if (newlySelectedLanguageName !== this.defaultAllLanguagesValue) {
			languageName = newlySelectedLanguageName;
		}

		this.props.onChange(languageName);
	}

	override render(): React.ReactNode {
		const {
			translateSync,
			value,
			disabled,
			languageGroups,
			voicesByLanguage,
			voicesByLanguageGroup,
			languagesByLanguageGroup,
		} = this.props;

		const frontendVoicesShowAllVoicesTranslated = translateSync("frontend_voicesShowAllVoices");

		// eslint-disable-next-line unicorn/no-array-reduce
		const languagesOptions: JSX.Element[] = languageGroups.reduce(
			// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
			(options: Readonly<JSX.Element[]>, languageGroup: Readonly<string>) => {
				const newOptions = [];
				const voicesPerLanguageGroup = voicesByLanguageGroup[languageGroup];

				if (!Array.isArray(voicesPerLanguageGroup)) {
					throw new TypeError("voicesPerLanguageGroup");
				}

				const languagesPerGroup = languagesByLanguageGroup[languageGroup];

				// TODO: use a type assertions library.
				if (!Array.isArray(languagesPerGroup) || !languagesPerGroup.every((languages): languages is string => typeof languages === "string")) {
					throw new TypeError("languagesPerGroup");
				}

				const otherLanguagesPerGroup: string[] = languagesPerGroup.filter((language: string) => language !== languageGroup);
				const languageGroupText = otherLanguagesPerGroup.length > 1 || voicesPerLanguageGroup.length > 1
					? `${languageGroup} (${String(otherLanguagesPerGroup.length)}, ${String(voicesPerLanguageGroup.length)})`
					: languageGroup;
				const languageGroupOptionElement = (
					<option
						key={languageGroup}
						className="group"
						lang="en"
						value={languageGroup}
					>
						{languageGroupText}
					</option>
				);

				newOptions.push(languageGroupOptionElement);

				const nonGroupLanguages = otherLanguagesPerGroup.filter((language) => language !== languageGroup);

				for (const language of nonGroupLanguages) {
					let languageText = null;

					const voicesForLanguage = voicesByLanguage[language];

					if (!Array.isArray(voicesForLanguage)) {
						throw new TypeError("voicesForLanguage");
					}

					languageText = voicesForLanguage.length > 1 ? `${language} (${String(voicesForLanguage.length)})` : language;

					const languageOptionElement
						= (
							<option
								key={language}
								lang="en"
								value={language}
							>
								{languageText}
							</option>
						);

					newOptions.push(languageOptionElement);
				}

				return options.concat(newOptions);
			},
			[
				<option
					key={this.defaultAllLanguagesValue}
					className="group"
					value={this.defaultAllLanguagesValue}
				>
					{frontendVoicesShowAllVoicesTranslated}
				</option>,
			],
		);

		return (
			<MultilineSelect
				className="grouped"
				disabled={disabled}
				size={7}
				value={value ?? this.defaultAllLanguagesValue}
				onChange={this.handleChange}
			>
				{languagesOptions}
			</MultilineSelect>
		);
	}
}

export default translateAttribute<AvailableLanguagesProps & TranslateProps>()(
	AvailableLanguages,
);
