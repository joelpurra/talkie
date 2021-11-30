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
import SharingIcons from "@talkie/shared-application/components/sharing/sharing-icons";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as textBase from "@talkie/shared-application/styled/text/text-base";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

import InstallVoicesContainer from "../../containers/install-voices-container";

export interface WelcomeProps {
	canSpeakInTranslatedLocale: boolean;
	sampleText?: string | null;
	sampleTextLanguageCode?: string | null;
	speakTextInLanguageWithOverrides: (text: string, languageCode: string) => void;
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
	private spokeSample = false;
	private welcomeSampleTextElement: HTMLElement | null = null;
	private readonly styled: {
		HeroEditionSection: StyletronComponent<ComponentProps<typeof HeroSection>>;
		heroDiv: StyletronComponent<ComponentProps<"div">>;
		sampleHeroP: StyletronComponent<ComponentProps<typeof textBase.p>>;
		sharingDiv: StyletronComponent<ComponentProps<"div">>;
		sharingIcons: StyletronComponent<ComponentProps<typeof SharingIcons>>;
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
		if (!this.props.canSpeakInTranslatedLocale) {
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
			canSpeakInTranslatedLocale,
			translateSync,
			configure,
		} = this.props;

		const welcomeSample = this.getWelcomeSample();

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

				<InstallVoicesContainer/>
			</section>
		);
	}
}

export default configureAttribute<WelcomeProps & ConfigureProps>()(
	translateAttribute<WelcomeProps & ConfigureProps & TranslateProps>()(
		Welcome,
	),
);
