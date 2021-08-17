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

import Icon from "@talkie/shared-application/components/icon/icon";
import Loading from "@talkie/shared-application/components/loading";
import PremiumSection from "@talkie/shared-application/components/section/premium-section";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as layoutBase from "@talkie/shared-application/styled/layout/layout-base";
import * as listBase from "@talkie/shared-application/styled/list/list-base";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import {
	getLanguageForVoiceNameFromVoices,
	getLanguageGroupFromLanguage,
	getLanguageGroupsFromLanguages,
	VoicesByLanguagesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider";
import {
	IVoiceNameAndLanguageOrNull,
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

import {
	actions,
} from "../../slices/index";

export interface VoicesStateProps {
	languageGroupsCount: number;
	languagesCount: number;
	navigatorLanguages: readonly string[];
	talkieLocaleHelper: TalkieLocaleHelper;
	voices: readonly SafeVoiceObject[];
	voicesByLanguagesByLanguageGroup: VoicesByLanguagesByLanguageGroup<SafeVoiceObject>;
	voicesCount: number;
}

export interface VoicesDispatchProps {
	speakInVoice: typeof actions.shared.speaking.speakInVoice;
}

interface VoicesProps extends VoicesStateProps, VoicesDispatchProps, TranslateProps {}

class Voices<P extends VoicesProps> extends React.PureComponent<P> {
	private readonly styled: {
		clickableLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
		hr: StyletronComponent<ComponentProps<typeof layoutBase.hr>>;
		summaryH3: StyletronComponent<ComponentProps<typeof textBase.h3>>;
		clickableNoBulletLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
	};

	constructor(props: P) {
		super(props);

		this.handleSpeakClickForLanguage = this.handleSpeakClickForLanguage.bind(this);
		this.handleSpeakClickForVoice = this.handleSpeakClickForVoice.bind(this);

		const partialStyles = {
			clickableLi: withStyleDeep(
				listBase.li,
				{
					cursor: "pointer",
				},
			),

			hr: withStyleDeep(
				layoutBase.hr,
				{
					marginLeft: 0,
					marginRight: 0,
				},
			),

			summaryH3: withStyleDeep(
				textBase.h3,
				{
					display: "inline-block",
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					paddingBottom: "0.5em",
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					paddingTop: "0.5em",
				},
			),
		};

		this.styled = {
			...partialStyles,
			clickableNoBulletLi: withStyleDeep(
				partialStyles.clickableLi,
				{
					listStyle: "none",
					marginLeft: "-2em",
				},
			),
		};
	}

	isTalkieLocale(languageCode: string): languageCode is TalkieLocale {
		return this.props.talkieLocaleHelper.isTalkieLocale(languageCode);
	}

	getSampleTextForTalkieLocale(languageCode: TalkieLocale): string {
		// eslint-disable-next-line no-sync
		return this.props.talkieLocaleHelper.getSampleTextSync(languageCode);
	}

	getSampleTextForLanguage(languageCode: string): string | null {
		const languageGroup = getLanguageGroupFromLanguage(languageCode);

		if (!this.isTalkieLocale(languageGroup)) {
			// TODO: front-end logging.
			// throw new Error(`No sample text found for the non-Talkie locale language code/group: ${JSON.stringify(languageCode)} ${JSON.stringify(languageGroup)}`);
			return null;
		}

		const text = this.getSampleTextForTalkieLocale(languageGroup);

		return text;
	}

	getSampleTextForVoicename(voiceName: string): string | null {
		const voices = this.props.voices;
		const voice = getLanguageForVoiceNameFromVoices(voices, voiceName);
		const languageCode = voice.lang;

		return this.getSampleTextForLanguage(languageCode);
	}

	getTextDirectionForLanguageGroup(languageGroup: TalkieLocale): string {
		// eslint-disable-next-line no-sync
		return this.props.talkieLocaleHelper.getBidiDirectionSync(languageGroup);
	}

	getTextDirectionClassNameForLanguageGroup(languageGroup: TalkieLocale): string {
		const defaultTextDirection = "text-direction-ltr";

		if (!this.isTalkieLocale(languageGroup)) {
			return defaultTextDirection;
		}

		const direction = this.getTextDirectionForLanguageGroup(languageGroup);
		let className = null;

		switch (direction) {
			case "rtl":
				className = "text-direction-rtl";
				break;
			case "ltr":
				className = defaultTextDirection;
				break;
			default:
				throw new Error(`Unknown text direction: ${typeof direction} ${JSON.stringify(direction)}`);
		}

		return className;
	}

	_speak(text: string, voice: Readonly<IVoiceNameAndLanguageOrNull>): void {
		this.props.speakInVoice({
			text,
			voice,
		});
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakClickForLanguage(languageCode: string, event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		const text = this.getSampleTextForLanguage(languageCode);

		if (typeof text === "string") {
			const voice: IVoiceNameAndLanguageOrNull = {
				lang: languageCode,
				name: null,
			};

			this._speak(text, voice);
		}

		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleSpeakClickForVoice(voiceName: string, event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		const text = this.getSampleTextForVoicename(voiceName);

		if (typeof text === "string") {
			const voice: IVoiceNameAndLanguageOrNull = {
				lang: null,
				name: voiceName,
			};

			this._speak(text, voice);
		}

		return false;
	}

	getVoicesListItems(voices: ReadonlyDeep<SafeVoiceObject[]>, hasSampleTextForLanguageGroup: boolean): React.ReactNode {
		const {
			translateSync,
		} = this.props;

		const translatedVoiceFeatureOnline = translateSync("frontend_voiceFeatureOnline");

		return voices.map((voice) => {
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

			if (hasSampleTextForLanguageGroup) {
				return (
					<this.styled.clickableNoBulletLi
						key={voice.name}
						// eslint-disable-next-line react/jsx-no-bind
						onClick={this.handleSpeakClickForVoice.bind(null, voice.name)}
					>
						<Icon
							className="icon-voices"
							mode="inline"
						/>
						{voiceNameAndFeaturesText}
					</this.styled.clickableNoBulletLi>
				);
			}

			return (
				<listBase.li
					key={voice.name}
				>
					{voiceNameAndFeaturesText}
				</listBase.li>
			);
		});
	}

	getLanguagesListItems(languages: Readonly<string[]>): React.ReactNode {
		return languages.map((language) => (
			<this.styled.clickableLi
				key={language}
				// eslint-disable-next-line react/jsx-no-bind
				onClick={this.handleSpeakClickForLanguage.bind(null, language)}
			>
				{language}
			</this.styled.clickableLi>
		));
	}

	// eslint-disable-next-line max-params
	getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup: VoicesByLanguagesByLanguageGroup<SafeVoiceObject>, languagesPerGroup: Readonly<string[]>, languagesFilter: Readonly<string[]>, languageGroup: string, hasSampleTextForLanguageGroup: boolean): React.ReactNode {
		const filteredLanguagesPerGroup = languagesPerGroup
			.filter((language) => languagesFilter.length === 0 || languagesFilter.includes(language));

		return filteredLanguagesPerGroup.map((language: string) => {
			const voicesByLanguageGroup = voicesByLanguagesByLanguageGroup[languageGroup];

			if (!voicesByLanguageGroup) {
				throw new Error(`No voices by language group found: ${JSON.stringify(languageGroup)} ${JSON.stringify(voicesByLanguagesByLanguageGroup)}`);
			}

			const voicesPerLanguage = voicesByLanguageGroup[language];

			if (!voicesPerLanguage) {
				throw new Error(`No voices by language found: ${JSON.stringify(language)} ${JSON.stringify(voicesPerLanguage)}`);
			}

			const speakSampleTextInLanguage = hasSampleTextForLanguageGroup
				? this.handleSpeakClickForLanguage.bind(null, language)
				: undefined;
			const LanguageListItem = hasSampleTextForLanguageGroup
				? this.styled.clickableLi
				: listBase.li;

			return (
				<LanguageListItem
					key={language}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={speakSampleTextInLanguage}
				>
					{language}
					<listBase.ul>
						{this.getVoicesListItems(voicesPerLanguage, hasSampleTextForLanguageGroup)}
					</listBase.ul>
				</LanguageListItem>
			);
		});
	}

	getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup: VoicesByLanguagesByLanguageGroup<SafeVoiceObject>, languagesFilter: Readonly<string[]>): React.ReactNode {
		const languageGroupsFilter = getLanguageGroupsFromLanguages(languagesFilter);

		const languageGroups = Object.keys(voicesByLanguagesByLanguageGroup);
		languageGroups.sort();

		const filteredLanguageGroups = languageGroups
			.filter((languageGroup) => languageGroupsFilter.length === 0 || languageGroupsFilter.includes(languageGroup));

		return filteredLanguageGroups
			.map((languageGroup, index) => {
				const voicesByLanguageGroup = voicesByLanguagesByLanguageGroup[languageGroup];

				if (!voicesByLanguageGroup) {
					throw new Error(`No voices by language group found: ${JSON.stringify(languageGroup)} ${JSON.stringify(voicesByLanguagesByLanguageGroup)}`);
				}

				const languagesPerGroup = Object.keys(voicesByLanguageGroup);
				languagesPerGroup.sort();

				let hasSampleTextForLanguageGroup = false;
				let sampleTextBlockQuote = null;

				if (this.isTalkieLocale(languageGroup)) {
					const sampleTextForLanguage = this.getSampleTextForLanguage(languageGroup);
					hasSampleTextForLanguageGroup = typeof sampleTextForLanguage === "string";

					sampleTextBlockQuote = (
						<textBase.blockquote
							className={this.getTextDirectionClassNameForLanguageGroup(languageGroup)}
							lang={languageGroup}
							// eslint-disable-next-line react/jsx-no-bind
							onClick={this.handleSpeakClickForLanguage.bind(null, languageGroup)}
						>
							{sampleTextForLanguage}
						</textBase.blockquote>
					);
				}

				return (
					<React.Fragment
						key={languageGroup}
					>
						<layoutBase.details>
							<layoutBase.summary>
								<this.styled.summaryH3>
									{languageGroup}
								</this.styled.summaryH3>
							</layoutBase.summary>

							{sampleTextBlockQuote}

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

							<listBase.ul>
								{this.getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, languagesPerGroup, languagesFilter, languageGroup, hasSampleTextForLanguageGroup)}
							</listBase.ul>
						</layoutBase.details>

						{((index + 1) < filteredLanguageGroups.length) && <this.styled.hr/>}
					</React.Fragment>
				);
			},
			);
	}

	override render(): React.ReactNode {
		const {
			languageGroupsCount,
			languagesCount,
			navigatorLanguages,
			translateSync,
			voicesByLanguagesByLanguageGroup,
			voicesCount,
		} = this.props;

		const haveVoices = voicesCount > 0;

		return (
			<section>
				<textBase.p>
					{translateSync("frontend_voicesDescription")}
				</textBase.p>

				<PremiumSection
					mode="h2"
				>
					{translateSync("frontend_voicesTalkiePremiumPitch")}
				</PremiumSection>

				<textBase.h2>
					{translateSync("frontend_voicesPreferredHeading")}
				</textBase.h2>

				<Loading
					enabled={haveVoices}
				>
					{this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, navigatorLanguages)}
				</Loading>

				<textBase.h2>
					{translateSync("frontend_voicesInstalledHeading", [
						languageGroupsCount.toString(10),
						languagesCount.toString(10),
						voicesCount.toString(10),
					])}
				</textBase.h2>

				<Loading
					enabled={haveVoices}
				>
					{this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, [])}
				</Loading>
			</section>
		);
	}
}

export default translateAttribute<VoicesProps>()(
	Voices,
);
