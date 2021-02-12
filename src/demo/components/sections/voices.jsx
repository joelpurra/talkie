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

import PropTypes from "prop-types";
import React from "react";

import Icon from "../../../shared/components/icon/icon.jsx";
import Loading from "../../../shared/components/loading.jsx";
import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import styled from "../../../shared/hocs/styled.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";
// TODO: proper data handling.
import {
	getLanguageForVoiceNameFromVoices,
	getLanguageGroupsFromLanguages,
} from "../../../shared/utils/transform-voices";

export default
@translateAttribute
class Voices extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleSpeakClickForLanguage = this.handleSpeakClickForLanguage.bind(this);
		this.handleSpeakClickForVoice = this.handleSpeakClickForVoice.bind(this);

		this.styled = {
			clickableLi: styled({
				cursor: "pointer",
			})(listBase.li),

			hr: styled({
				marginLeft: 0,
				marginRight: 0,
			})(layoutBase.hr),

			summaryH3: styled({
				display: "inline-block",
				marginBottom: 0,
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				paddingBottom: "0.5em",
				paddingLeft: "0.5em",
				paddingRight: "0.5em",
				paddingTop: "0.5em",
			})(textBase.h3),
		};

		this.styled.clickableNoBulletLi = styled({
			listStyle: "none",
			marginLeft: "-2em",
		})(this.styled.clickableLi);
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		languageGroupsCount: PropTypes.number.isRequired,
		languagesCount: PropTypes.number.isRequired,
		navigatorLanguages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		talkieLocaleHelper: PropTypes.object.isRequired,
		translate: PropTypes.func.isRequired,
		voices: PropTypes.arrayOf(PropTypes.shape({
			"default": PropTypes.bool.isRequired,
			lang: PropTypes.string.isRequired,
			localService: PropTypes.bool.isRequired,
			name: PropTypes.string.isRequired,
			voiceURI: PropTypes.string.isRequired,
		})).isRequired,
		voicesByLanguagesByLanguageGroup: PropTypes.objectOf(
			PropTypes.objectOf(
				PropTypes.arrayOf(PropTypes.shape({
					"default": PropTypes.bool.isRequired,
					lang: PropTypes.string.isRequired,
					localService: PropTypes.bool.isRequired,
					name: PropTypes.string.isRequired,
					voiceURI: PropTypes.string.isRequired,
				})).isRequired,
			).isRequired,
		).isRequired,
		voicesCount: PropTypes.number.isRequired,
	}

	getSampleTextForLanguage(languageCode) {
		// eslint-disable-next-line no-sync
		return this.props.talkieLocaleHelper.getSampleTextSync(languageCode);
	}

	getSampleTextForVoicename(voiceName) {
		const voices = this.props.voices;
		const voice = getLanguageForVoiceNameFromVoices(voices, voiceName);
		const languageCode = voice.lang;

		// eslint-disable-next-line no-sync
		return this.props.talkieLocaleHelper.getSampleTextSync(languageCode);
	}

	getTextDirectionForLanguageGroup(languageGroup) {
		// eslint-disable-next-line no-sync
		return this.props.talkieLocaleHelper.getBidiDirectionSync(languageGroup);
	}

	getTextDirectionClassNameForLanguageGroup(languageGroup) {
		const direction = this.getTextDirectionForLanguageGroup(languageGroup);
		let className = null;

		switch (direction) {
			case "ltr":
				className = "text-direction-ltr";
				break;
			case "rtl":
				className = "text-direction-rtl";
				break;
			default:
				throw new Error(`Unknown text direction: ${typeof direction} ${JSON.stringify(direction)}`);
		}

		return className;
	}

	handleSpeakClickForLanguage(languageCode, event) {
		event.preventDefault();
		event.stopPropagation();

		const text = this.getSampleTextForLanguage(languageCode);
		const voice = {
			lang: languageCode,
			// name: null,
			// rate: ...,
			// pitch: ...,
		};

		this.props.actions.sharedVoices.speak(text, voice);

		return false;
	}

	handleSpeakClickForVoice(voiceName, event) {
		event.preventDefault();
		event.stopPropagation();

		const text = this.getSampleTextForVoicename(voiceName);
		const voice = {
			// lang: null,
			name: voiceName,
			// rate: ...,
			// pitch: ...,
		};

		this.props.actions.sharedVoices.speak(text, voice);

		return false;
	}

	getVoicesListItems(voices, showCode) {
		const {
			translate,
		} = this.props;

		const translatedVoiceFeatureOnline = translate("frontend_voiceFeatureOnline");

		return voices.map((voice) => {
			let voiceNameAndFeaturesText = voice.name;

			const voiceFeatures = [];

			if (showCode) {
				voiceFeatures.push(voice.lang);
			}

			if (voice.localService === false) {
				voiceFeatures.push(translatedVoiceFeatureOnline);
			}

			if (voiceFeatures.length > 0) {
				voiceNameAndFeaturesText += " (";
				voiceNameAndFeaturesText += voiceFeatures.join(", ");
				voiceNameAndFeaturesText += ")";
			}

			return (
				<this.styled.clickableNoBulletLi
					key={voice.name}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={this.handleSpeakClickForVoice.bind(null, voice.name)}
				>
					<Icon className="icon-voices"/>
					{voiceNameAndFeaturesText}
				</this.styled.clickableNoBulletLi>
			);
		});
	}

	getVoicesListItemsWithCode(voices) {
		return this.getVoicesListItems(voices, true);
	}

	getVoicesListItemsWithoutCode(voices) {
		return this.getVoicesListItems(voices, false);
	}

	getLanguagesListItems(languages) {
		return languages.map((language) => (
			<this.styled.clickableLi
				key={language}
				// eslint-disable-next-line react/jsx-no-bind
				onClick={this.handleSpeakClickForLanguage.bind(null, language)}
			>
				{language}
			</this.styled.clickableLi>
		),
		);
	}

	getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, languagesPerGroup, languagesFilter, languageGroup) {
		const filteredLanguagesPerGroup = languagesPerGroup
			.filter((language) => !languagesFilter || languagesFilter.includes(language));

		return filteredLanguagesPerGroup.map((language) => {
			const voicesPerLanguage = voicesByLanguagesByLanguageGroup[languageGroup][language];

			return (
				<this.styled.clickableLi
					key={language}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={this.handleSpeakClickForLanguage.bind(null, language)}
				>
					{language}
					<listBase.ul>
						{this.getVoicesListItemsWithoutCode(voicesPerLanguage)}
					</listBase.ul>
				</this.styled.clickableLi>
			);
		});
	}

	getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, languagesFilter) {
		const languageGroupsFilter = (languagesFilter && getLanguageGroupsFromLanguages(languagesFilter)) || null;

		const languageGroups = Object.keys(voicesByLanguagesByLanguageGroup);
		languageGroups.sort();

		const filteredLanguageGroups = languageGroups
			.filter((languageGroup) => !languageGroupsFilter || languageGroupsFilter.includes(languageGroup));

		return filteredLanguageGroups
			.map((languageGroup, index) => {
				const languagesPerGroup = Object.keys(voicesByLanguagesByLanguageGroup[languageGroup]);
				languagesPerGroup.sort();

				const sampleTextForLanguage = this.getSampleTextForLanguage(languageGroup);

				let sampleTextBlockQuote = null;

				if (sampleTextForLanguage) {
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
					<div
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
									<Icon className="icon-wikipedia-w"/>
									{languageGroup}
									.wikipedia.org
								</textBase.a>
							</textBase.p>

							<listBase.ul>
								{this.getFilteredLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, languagesPerGroup, languagesFilter, languageGroup)}
							</listBase.ul>
						</layoutBase.details>

						{((index + 1) < filteredLanguageGroups.length) && <this.styled.hr/>}
					</div>
				);
			},
			);
	}

	render() {
		const {
			languageGroupsCount,
			languagesCount,
			navigatorLanguages,
			translate,
			voicesByLanguagesByLanguageGroup,
			voicesCount,
		} = this.props;

		const haveVoices = voicesCount > 0;

		return (
			<section>
				<textBase.p>
					{translate("frontend_voicesDescription")}
				</textBase.p>

				<PremiumSection
					mode="h2"
				>
					{translate("frontend_voicesTalkiePremiumPitch")}
				</PremiumSection>

				<textBase.h2>
					{translate("frontend_voicesPreferredHeading")}
				</textBase.h2>

				<Loading
					enabled={haveVoices}
				>
					{this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, navigatorLanguages)}
				</Loading>

				<textBase.h2>
					{translate("frontend_voicesInstalledHeading", [
						languageGroupsCount,
						languagesCount,
						voicesCount,
					])}
				</textBase.h2>

				<Loading
					enabled={haveVoices}
				>
					{this.getFilteredLanguageGroupsAndLanguagesAndVoicesTree(voicesByLanguagesByLanguageGroup, null)}
				</Loading>
			</section>
		);
	}
}
