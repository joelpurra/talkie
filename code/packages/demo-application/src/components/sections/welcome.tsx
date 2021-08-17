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

import Discretional from "@talkie/shared-application/components/discretional";
import HeroSection from "@talkie/shared-application/components/hero-section/hero-section";
import Loading from "@talkie/shared-application/components/loading";
import SharingIcons from "@talkie/shared-application/components/sharing/sharing-icons";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as layoutBase from "@talkie/shared-application/styled/layout/layout-base";
import * as listBase from "@talkie/shared-application/styled/list/list-base";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import {
	OsType,
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

export interface WelcomeProps {
	canSpeakInTranslatedLocale: boolean;
	languageGroupsCount: number;
	languagesCount: number;
	osType?: OsType | null;
	sampleText?: string | null;
	sampleTextLanguageCode?: string | null;
	speakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;
	systemType: SystemType | null;
	voicesCount: number;
}

export type WelcomeSample = {
	hasSampleText: false;
	languageCode: undefined;
	text: undefined;
} | {
	hasSampleText: true;
	languageCode: string;
	text: string;
};

class Welcome<P extends WelcomeProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
		sampleText: null,
		sampleTextLanguageCode: null,
	};

	private spokeSample = false;
	private welcomeSampleTextElement: HTMLElement | null = null;
	private readonly styled: {
		HeroEditionSection: StyletronComponent<ComponentProps<typeof HeroSection>>;
		heroDiv: StyletronComponent<ComponentProps<"div">>;
		sampleHeroP: StyletronComponent<ComponentProps<typeof textBase.p>>;
		sharingDiv: StyletronComponent<ComponentProps<"div">>;
		sharingIcons: StyletronComponent<ComponentProps<typeof SharingIcons>>;
		summaryHeading: StyletronComponent<ComponentProps<typeof textBase.h3>>;
		welcomeHeroP: StyletronComponent<ComponentProps<typeof textBase.p>>;
	};

	constructor(props: P) {
		super(props);

		this.playWelcomeMessage = this.playWelcomeMessage.bind(this);
		this.selectTextInElement = this.selectTextInElement.bind(this);

		this.styled = {
			HeroEditionSection: styled(
				HeroSection,
				{
					// NOTE: atomic css class ordering seems to not work well in this case.
					marginBottom: 0,
				},
			),

			heroDiv: styled(
				"div",
				{
					marginBottom: "2em",
				},
			),

			sampleHeroP: withStyleDeep(
				textBase.p,
				{
					marginTop: 0,
				},
			),

			sharingDiv: styled(
				"div",
				{
					marginLeft: "6em",
					marginRight: "6em",
					marginTop: "-4em",
				},
			),

			sharingIcons: styled(
				SharingIcons,
				{
					display: "inline-block",
					verticalAlign: "middle",
				},
			),

			summaryHeading: withStyleDeep(
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

			welcomeHeroP: withStyleDeep(
				textBase.p,
				{
					marginBottom: 0,
					marginTop: 0,
				},
			),
		};
	}

	override componentDidMount(): void {
		this.playWelcomeMessage();
	}

	override componentDidUpdate(): void {
		this.playWelcomeMessage();
	}

	playWelcomeMessage(): void {
		// TODO: take sample text language code into account.
		if (this.props.voicesCount === 0) {
			return;
		}

		if (!this.welcomeSampleTextElement) {
			return;
		}

		const welcomeSample = this.getWelcomeSample();

		if (!welcomeSample.hasSampleText) {
			return;
		}

		if (this.spokeSample) {
			return;
		}

		this.spokeSample = true;

		this.selectTextInElement(this.welcomeSampleTextElement);

		const text = welcomeSample.text;
		const languageCode = welcomeSample.languageCode;

		this.props.speakTextInLanguageWithOverrides(text, languageCode);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	selectTextInElement(element: Readonly<HTMLElement>): void {
		const selection = document.getSelection();

		if (selection) {
			selection.removeAllRanges();
			selection.selectAllChildren(element);
		}
	}

	getWelcomeSample(): WelcomeSample {
		const sampleText = this.props.sampleText;
		const sampleTextLanguageCode = this.props.sampleTextLanguageCode;

		const welcomeSample: WelcomeSample = typeof sampleText === "string" && sampleText.length > 0 && typeof sampleTextLanguageCode === "string" && sampleTextLanguageCode.length > 0
			? {
				hasSampleText: true,
				languageCode: sampleTextLanguageCode,
				text: sampleText,
			} : {
				hasSampleText: false,
				languageCode: undefined,
				text: undefined,
			};

		return welcomeSample;
	}

	override render(): React.ReactNode {
		const {
			systemType,
			osType,
			voicesCount,
			languagesCount,
			languageGroupsCount,
			canSpeakInTranslatedLocale,
			translateSync,
			configure,
		} = this.props;

		// TODO: configuration.
		const devModeShowAll = false;

		// TODO: translated, pretty name.
		const systemTypePrettyName = systemType ?? "(unknown system type)";

		// TODO: translated, pretty name.
		const osTypePrettyName = osType ?? "(unknown operating system)";

		const welcomeSample = this.getWelcomeSample();

		const haveVoices = voicesCount > 0;

		return (
			<section>
				<this.styled.heroDiv>
					<this.styled.HeroEditionSection>
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
							{translateSync("frontend_welcomeHero01", [
								translateSync("extensionShortName"),
							])}

							<Discretional
								enabled={canSpeakInTranslatedLocale}
							>
								{" "}
								{translateSync("frontend_welcomeHero02")}
							</Discretional>
						</this.styled.welcomeHeroP>
					</this.styled.HeroEditionSection>

					<this.styled.sharingDiv>
						<this.styled.sharingIcons/>

						<textBase.a href={configure("urls.rate")}>
							{translateSync("frontend_rateIt")}
						</textBase.a>
					</this.styled.sharingDiv>
				</this.styled.heroDiv>

				<textBase.h2>
					{translateSync("frontend_welcomeInstallMoreVoicesHeading")}
				</textBase.h2>

				<textBase.p>
					<Loading
						enabled={haveVoices}
					>
						{/* TODO: pretty format */}
						{translateSync("frontend_welcomeInstallMoreVoicesDescription", [
							voicesCount.toString(10),
							languageGroupsCount.toString(10),
							languagesCount.toString(10),
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
								{translateSync("frontend_faq002Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq002A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.office.com/en-us/article/How-to-download-Text-to-Speech-languages-for-Windows-10-d5a6b612-b3ae-423f-afa5-4f6caf1ec5d3"
									lang="en"
								>
									Windows 10
								</textBase.a>
								: Settings &gt;&nbsp;Time&nbsp;&amp;&nbsp;Language &gt;&nbsp;Language
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
								{translateSync("frontend_faq003Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq003A")}
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
								{translateSync("frontend_faq004Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq004A")}
						</textBase.p>

						<listBase.ul>
							<listBase.li>
								<textBase.a
									href="https://support.apple.com/kb/index?page=search&amp;q=VoiceOver+language&amp;product=PF6&amp;doctype=PRODUCT_HELP,HOWTO_ARTICLES&amp;locale=en_US"
									lang="en"
								>
									macOS
								</textBase.a>
								: System&nbsp;Preferences &gt;&nbsp;Accessibility &gt;&nbsp;Speech &gt;&nbsp;System&nbsp;voice &gt;&nbsp;Customize...
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
								{translateSync("frontend_faq005Q")}
							</this.styled.summaryHeading>
						</layoutBase.summary>
						{/* NOTE: this entry are duplicated between the support FAQ and welcome pages. */}
						<textBase.p>
							{translateSync("frontend_faq005A")}
						</textBase.p>
					</layoutBase.details>
				</Discretional>
			</section>
		);
	}
}

export default configureAttribute<WelcomeProps & ConfigureProps>()(
	translateAttribute<WelcomeProps & ConfigureProps & TranslateProps>()(
		Welcome,
	),
);
