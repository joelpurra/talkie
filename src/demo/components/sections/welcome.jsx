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

import Discretional from "../../../shared/components/discretional.jsx";
import HeroSection from "../../../shared/components/hero-section/hero-section.jsx";
import Loading from "../../../shared/components/loading.jsx";
import SharingIcons from "../../../shared/components/sharing/sharing-icons.jsx";
import configureAttribute from "../../../shared/hocs/configure.jsx";
import styled from "../../../shared/hocs/styled.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import * as layoutBase from "../../../shared/styled/layout/layout-base.jsx";
import * as listBase from "../../../shared/styled/list/list-base.jsx";
import * as textBase from "../../../shared/styled/text/text-base.jsx";

export default
@configureAttribute
@translateAttribute
class Welcome extends React.PureComponent {
	constructor(props) {
		super(props);

		this.playWelcomeMessage = this.playWelcomeMessage.bind(this);
		this.selectTextInElement = this.selectTextInElement.bind(this);

		this.spokeSample = false;
		this.welcomeSampleTextElement = null;

		this.styled = {
			heroDiv: styled({
				marginBottom: "2em",
			})("div"),

			HeroEditionSection: styled({
				// NOTE: atomic css class ordering seems to not work well in this case.
				marginBottom: 0,
			})(HeroSection),

			sampleHeroP: styled({
				marginTop: 0,
			})(textBase.p),

			welcomeHeroP: styled({
				marginTop: 0,
				marginBottom: 0,
			})(textBase.p),

			sharingDiv: styled({
				marginTop: "-4em",
				marginLeft: "6em",
				marginRight: "6em",
			})("div"),

			sharingIcons: styled({
				display: "inline-block",
				verticalAlign: "middle",
			})(SharingIcons),

			summaryHeading: styled({
				display: "inline-block",
				marginLeft: 0,
				marginRight: 0,
				marginTop: 0,
				marginBottom: 0,
				paddingLeft: "0.5em",
				paddingRight: "0.5em",
				paddingTop: "0.5em",
				paddingBottom: "0.5em",
			})(textBase.h3),
		};
	}

	static defaultProps = {
		isPremiumEdition: false,
		systemType: null,
		osType: null,
		voicesCount: 0,
		languagesCount: 0,
		languageGroupsCount: 0,
		sampleText: null,
		sampleTextLanguageCode: null,
		speakTextInLanguageWithOverrides: null,
		canSpeakInTranslatedLocale: false,
	};

	static propTypes = {
		isPremiumEdition: PropTypes.bool.isRequired,
		systemType: PropTypes.string.isRequired,
		osType: PropTypes.string,
		voicesCount: PropTypes.number.isRequired,
		languagesCount: PropTypes.number.isRequired,
		languageGroupsCount: PropTypes.number.isRequired,
		sampleText: PropTypes.string,
		sampleTextLanguageCode: PropTypes.string,
		speakTextInLanguageWithOverrides: PropTypes.func.isRequired,
		canSpeakInTranslatedLocale: PropTypes.bool.isRequired,
		translate: PropTypes.func.isRequired,
		configure: PropTypes.func.isRequired,
		onConfigurationChange: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this._unregisterConfigurationListener = this.props.onConfigurationChange(() => this.forceUpdate());

		this.playWelcomeMessage();
	}

	componentDidUpdate() {
		this.playWelcomeMessage();
	}

	componentWillUnmount() {
		this._unregisterConfigurationListener();
	}

	playWelcomeMessage() {
		// TODO: take sample text language code into account.
		if (this.props.voicesCount === 0) {
			return;
		}

		if (!this.welcomeSampleTextElement) {
			return;
		}

		if (this.spokeSample) {
			return;
		}

		this.spokeSample = true;

		this.selectTextInElement(this.welcomeSampleTextElement);

		const welcomeSample = this.getWelcomeSample();
		const text = welcomeSample.text;
		const languageCode = welcomeSample.languageCode;

		this.props.speakTextInLanguageWithOverrides(text, languageCode);
	}

	selectTextInElement(element) {
		const selection = document.getSelection();
		selection.removeAllRanges();
		selection.selectAllChildren(element);
	}

	getWelcomeSample() {
		const hasSampleText = Boolean(this.props.sampleText);
		const welcomeSampleText = this.props.sampleText;
		const welcomeSampleTextLanguage = this.props.sampleTextLanguageCode;

		const welcomeSample = {
			hasSampleText,
			text: welcomeSampleText,
			languageCode: welcomeSampleTextLanguage,
		};

		return welcomeSample;
	}

	render() {
		const {
			isPremiumEdition,
			systemType,
			osType,
			voicesCount,
			languagesCount,
			languageGroupsCount,
			canSpeakInTranslatedLocale,
			translate,
			configure,
		} = this.props;

		// TODO: configuration.
		const devModeShowAll = false;

		// TODO: pretty name.
		const systemTypePrettyName = systemType;

		// TODO: pretty name.
		const osTypePrettyName = osType;

		const welcomeSample = this.getWelcomeSample();

		const haveVoices = voicesCount > 0;

		return (
			<section>
				<this.styled.heroDiv>
					<this.styled.HeroEditionSection
						isPremiumEdition={isPremiumEdition}
					>
						<Discretional
							enabled={welcomeSample.hasSampleText}
						>
							<this.styled.sampleHeroP>
								<span
									ref={(welcomeSampleTextElement) => {
										this.welcomeSampleTextElement = welcomeSampleTextElement;
									}}
									lang={welcomeSample.languageCode}
								>
									{welcomeSample.text}
								</span>
							</this.styled.sampleHeroP>
						</Discretional>

						<this.styled.welcomeHeroP>
							{translate("frontend_welcomeHero01", [
								translate("extensionShortName"),
							])}

							<Discretional
								enabled={canSpeakInTranslatedLocale}
							>
								{" "}
								{translate("frontend_welcomeHero02")}
							</Discretional>
						</this.styled.welcomeHeroP>
					</this.styled.HeroEditionSection>

					<this.styled.sharingDiv>
						<this.styled.sharingIcons/>

						<textBase.a href={configure("urls.rate")}>
							{translate("frontend_rateIt")}
						</textBase.a>
					</this.styled.sharingDiv>
				</this.styled.heroDiv>

				<textBase.h2>
					{translate("frontend_welcomeInstallMoreVoicesHeading")}
				</textBase.h2>

				<textBase.p>
					<Loading
						enabled={haveVoices}
					>
						{/* TODO: pretty format */}
						{translate("frontend_welcomeInstallMoreVoicesDescription", [
							voicesCount,
							languageGroupsCount,
							languagesCount,
							systemTypePrettyName,
							osTypePrettyName,
						])}
					</Loading>
				</textBase.p>

				<Discretional
					enabled={devModeShowAll || osType === "win"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translate("frontend_faq002Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translate("frontend_faq002A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
									lang="en"
								>
									Windows 10
								</textBase.a>: Settings &gt;&nbsp;Time&nbsp;&amp;&nbsp;Language &gt;&nbsp;Language
								{/* TODO: translate system settings path. */}
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-4c83a8d8-7486-42f7-8e46-2b0fdf753130"
									lang="en"
								>
									Windows 8
								</textBase.a>
							</listBase.li>
							<listBase.li>
								<textBase.a
									href="https://www.microsoft.com/en-us/download/details.aspx?id=27224"
									lang="en"
								>
									Windows 7
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "cros"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translate("frontend_faq003Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translate("frontend_faq003A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://chrome.google.com/webstore/detail/us-english-female-text-to/pkidpnnapnfgjhfhkpmjpbckkbaodldb"
									lang="en"
								>
									US English Female Text-to-speech (by Google)
								</textBase.a>
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "mac"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translate("frontend_faq004Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translate("frontend_faq004A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.apple.com/kb/index?page=search&amp;q=VoiceOver+language&amp;product=PF6&amp;doctype=PRODUCT_HELP,HOWTO_ARTICLES&amp;locale=en_US"
									lang="en"
								>
									macOS
								</textBase.a>: System&nbsp;Preferences &gt;&nbsp;Accessibility &gt;&nbsp;Speech &gt;&nbsp;System&nbsp;voice &gt;&nbsp;Customize...
								{/* TODO: translate system settings path. */}
							</listBase.li>
						</listBase.ul>
					</layoutBase.details>
				</Discretional>

				<Discretional
					enabled={devModeShowAll || osType === "linux"}
				>
					<layoutBase.details>
						<layoutBase.summary>
							<this.styled.summaryHeading>
								{translate("frontend_faq005Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translate("frontend_faq005A")}
						</textBase.p>
					</layoutBase.details>
				</Discretional>
			</section>
		);
	}
}
