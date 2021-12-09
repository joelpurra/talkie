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

import * as HACKYHACKFUNCTIONS from "@talkie/shared-application/slices/languages-hack-functions.mjs";
import {
	TalkieLocale,
} from "@talkie/split-environment-interfaces/ilocale-provider.mjs";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import toolkit from "@reduxjs/toolkit";
const {
	bindActionCreators,
} = toolkit;

import Welcome from "../components/sections/welcome.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WelcomeContainerProps {}

interface WelcomeContainerState {
	loadVoicesRetryCount: number;
}

interface StateProps {
	availableBrowserLanguageWithInstalledVoice: string[];
	haveVoices: boolean;
	languageGroups: readonly string[];
	languages: readonly string[];
}

interface DispatchProps {
	loadVoices: typeof actions.shared.voices.loadVoices;
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	availableBrowserLanguageWithInstalledVoice: selectors.shared.voices.getAvailableBrowserLanguageWithInstalledVoice(state),
	haveVoices: selectors.shared.voices.getHaveVoices(state),
	languageGroups: selectors.shared.voices.getLanguageGroups(state),
	languages: selectors.shared.voices.getLanguages(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadVoices: bindActionCreators(actions.shared.voices.loadVoices, dispatch),
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
});

class WelcomeContainer<P extends InternalProps, S extends WelcomeContainerState> extends React.PureComponent<P, S> {
	override state = (
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		{
			loadVoicesRetryCount: 0,
		} as S
	);

	constructor(props: P) {
		super(props);

		this.speakTextInLanguageWithOverrides = this.speakTextInLanguageWithOverrides.bind(this);
	}

	override componentDidUpdate(_previousProps: P, previousState: S): void {
		if (
			!this.props.haveVoices
			&& (
				this.state.loadVoicesRetryCount === 0
				|| previousState.loadVoicesRetryCount !== this.state.loadVoicesRetryCount
			)
		) {
			// NOTE: since this welcome page is the first thing users see when installing Talkie, it's important that the voice list loads.
			// NOTE: sometimes the browser (Firefox?) has not actually loaded the voices (cold cache), and will instead synchronously return an empty array.
			// NOTE: wait a bit between retries, both to allow any voices to load, and to not bog down the system with a loop if there actually are no voices.
			const loadVoicesRetryDelay = 50 * (2 ** this.state.loadVoicesRetryCount);

			// NOTE: execute outside the synchronous rendering.
			setTimeout(
				() => {
					this.setState(
						(state) => ({
							loadVoicesRetryCount: state.loadVoicesRetryCount + 1,
						}),
						() => {
							// TODO: is this the best place to load data?
							this.props.loadVoices();
						},
					);
				},
				loadVoicesRetryDelay,
			);
		}
	}

	speakTextInLanguageWithOverrides(text: string, languageCode: string) {
		this.props.speakTextInLanguageWithOverrides({
			languageCode,
			text,
		});
	}

	getTranslationLocale(): TalkieLocale {
		// eslint-disable-next-line no-sync
		return HACKYHACKFUNCTIONS.getTranslationLocaleSync();
	}

	isTalkieLocale(languageCode: string): languageCode is TalkieLocale {
		// eslint-disable-next-line no-sync
		return HACKYHACKFUNCTIONS.isTalkieLocaleSync(languageCode);
	}

	getSampleTextForLanguage(languageCode: string): string | null {
		// eslint-disable-next-line no-sync
		return HACKYHACKFUNCTIONS.getSampleTextForLanguageSync(languageCode);
	}

	override render(): React.ReactNode {
		const {
			availableBrowserLanguageWithInstalledVoice,
			languageGroups,
			languages,
		} = this.props;

		// TODO: create action and store as redux state?
		const sampleTextLanguageCode = availableBrowserLanguageWithInstalledVoice
			.find((languageCode: string) => {
				if (this.isTalkieLocale(languageCode)) {
					return Boolean(this.getSampleTextForLanguage(languageCode));
				}

				return false;
			});

		// TODO: create action and store as redux state?
		let sampleText = null;

		if (typeof sampleTextLanguageCode === "string" && this.isTalkieLocale(sampleTextLanguageCode)) {
			sampleText = this.getSampleTextForLanguage(sampleTextLanguageCode);
		}

		// TODO: create action and store as redux state?
		const translationLocale = this.getTranslationLocale();
		const canSpeakInTranslatedLocale = languages.includes(translationLocale) || languageGroups.includes(translationLocale);

		return (
			<Welcome
				canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
				sampleText={sampleText}
				sampleTextLanguageCode={sampleTextLanguageCode}
				speakTextInLanguageWithOverrides={this.speakTextInLanguageWithOverrides}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	WelcomeContainer,
) as unknown as React.ComponentType<WelcomeContainerProps>;
