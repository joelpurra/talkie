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

import {
	TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import Discretional from "@talkie/shared-ui/components/discretional.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React, {
	ComponentProps,
} from "react";
import type {
	StyletronComponent,
} from "styletron-react";
import {
	withStyleDeep,
} from "styletron-react";

import HeroSection from "../../components/hero-section/hero-section.js";
import InstallVoicesContainer from "../../containers/install-voices-container.js";

export interface WelcomeProps {
	canSpeakInTranslatedLocale: boolean;
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
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

class Welcome<P extends WelcomeProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.playWelcomeMessage = this.playWelcomeMessage.bind(this);
		this.selectTextInElement = this.selectTextInElement.bind(this);

		this.styled = {
			sampleHeroP: withStyleDeep(
				textBase.p,
				{
					marginTop: 0,
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

		this.props.speakTextInLanguageWithOverrides(
			welcomeSample.text,
			welcomeSample.languageCode,
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
		const sampleText = this.props.sampleText;
		const sampleTextLanguageCode = this.props.sampleTextLanguage;

		const welcomeSample: WelcomeSample = typeof sampleText === "string"
			&& sampleText.length > 0
			&& typeof sampleTextLanguageCode === "string"
			&& sampleTextLanguageCode.length > 0
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
		} = this.props;

		const welcomeSample = this.getWelcomeSample();

		return (
			<section>
				<HeroSection>
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
				</HeroSection>

				<InstallVoicesContainer/>
			</section>
		);
	}

	private spokeSample = false;
	private welcomeSampleTextElement: HTMLElement | null = null;
	private readonly styled: {
		sampleHeroP: StyletronComponent<ComponentProps<typeof textBase.p>>;
		welcomeHeroP: StyletronComponent<ComponentProps<typeof textBase.p>>;
	};
}

export default translateAttribute<WelcomeProps & TranslateProps>()(
	Welcome,
);
