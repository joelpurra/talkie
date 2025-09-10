/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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

import {
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import {
	talkieStyled,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";

import HeroSection from "../../components/hero-section/hero-section.js";
import InstallVoicesContainer from "../../containers/install-voices-container.js";
import {
	type actions,
} from "../../slices/index.mjs";

export interface WelcomeProps {
	canSpeakInTranslatedLocale: boolean;
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
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

interface WelcomeState {
	// NOTE: keep spokeSample in state because it depends on the selected text in the rendered sample HTML element.
	spokeSample: boolean;
}

class Welcome<P extends WelcomeProps & TranslateProps> extends React.PureComponent<P, WelcomeState> {
	override state = {
		spokeSample: false,
	};

	private readonly welcomeSampleTextElementRef: React.RefObject<HTMLSpanElement>;
	private readonly styled: {
		sampleHeroP: TalkieStyletronComponent<"p">;
		welcomeHeroP: TalkieStyletronComponent<"p">;
	};

	constructor(props: P) {
		super(props);

		this.welcomeSampleTextElementRef = React.createRef<HTMLSpanElement>();

		this.playWelcomeMessage = this.playWelcomeMessage.bind(this);
		this.selectTextInElement = this.selectTextInElement.bind(this);

		this.styled = {
			sampleHeroP: talkieStyled(
				"p",
				{
					marginTop: 0,
				},
			),

			welcomeHeroP: talkieStyled(
				"p",
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

		if (!this.welcomeSampleTextElementRef.current) {
			return;
		}

		if (this.state.spokeSample) {
			return;
		}

		const welcomeSample = this.getWelcomeSample();

		if (!welcomeSample.hasSampleText) {
			return;
		}

		this.setState(
			{
				spokeSample: true,
			},
			() => {
				if (!this.welcomeSampleTextElementRef.current) {
					return;
				}

				this.selectTextInElement(this.welcomeSampleTextElementRef.current);

				// NOTE: can not use iconClick(), to simulate regular Talkie usage, because it requires a user action to access the current tab.
				this.props.speakTextInLanguageWithOverrides({
					languageCode: welcomeSample.languageCode,
					text: welcomeSample.text,
				});
			},
		);
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
		const {
			sampleText,
		} = this.props as P;
		const sampleTextLanguageCode = this.props.sampleTextLanguage;

		const welcomeSample: WelcomeSample = typeof sampleText === "string"
			&& sampleText.length > 0
			&& typeof sampleTextLanguageCode === "string"
			&& sampleTextLanguageCode.length > 0
			? {
				hasSampleText: true,
				languageCode: sampleTextLanguageCode,
				text: sampleText,
			}
			: {
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
		} = this.props as P;

		const welcomeSample = this.getWelcomeSample();

		return (
			<>
				<textBase.h1>
					{translateSync("frontend_welcomeLinkText")}
				</textBase.h1>

				<section>
					<HeroSection>
						<Discretional
							enabled={welcomeSample.hasSampleText}
						>
							<this.styled.sampleHeroP>
								<span
									ref={this.welcomeSampleTextElementRef}
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
					</HeroSection>

					<InstallVoicesContainer/>
				</section>
			</>
		);
	}
}

export default translateAttribute<WelcomeProps & TranslateProps>()(
	Welcome,
);
