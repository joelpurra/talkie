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

import Welcome from "../app/sections/welcome.js";
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
	attemptedLoadingSampleText: boolean;
}

interface StateProps {
	canSpeakInTranslatedLocale: boolean;
	haveVoices: boolean;
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
}

interface DispatchProps {
	loadSampleTextForAvailableBrowserLanguageWithInstalledVoice: typeof actions.welcome.loadSampleTextForAvailableBrowserLanguageWithInstalledVoice;
	loadVoices: typeof actions.shared.voices.loadVoices;
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
}

interface InternalProps extends StateProps, DispatchProps {}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalProps, OptionsRootState> = (state: Readonly<OptionsRootState>) => ({
	canSpeakInTranslatedLocale: selectors.shared.voices.getCanSpeakInTranslatedLocale(state),
	haveVoices: selectors.shared.voices.getHaveVoices(state),
	sampleText: state.welcome.sampleText,
	sampleTextLanguage: state.welcome.sampleTextLanguage,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalProps> = (dispatch) => ({
	loadSampleTextForAvailableBrowserLanguageWithInstalledVoice: bindActionCreators(actions.welcome.loadSampleTextForAvailableBrowserLanguageWithInstalledVoice, dispatch),
	loadVoices: bindActionCreators(actions.shared.voices.loadVoices, dispatch),
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
});

class WelcomeContainer<P extends InternalProps, S extends WelcomeContainerState> extends React.PureComponent<P, S> {
	override state = (
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		{
			loadVoicesRetryCount: 0,
			attemptedLoadingSampleText: false,
		} as S
	);

	constructor(props: P) {
		super(props);

		this.speakTextInLanguageWithOverrides = this.speakTextInLanguageWithOverrides.bind(this);
	}

	override componentDidUpdate(_previousProps: P, previousState: S): void {
		// TODO: move retrying/loading voices to an outer container, to separate and clean up logic.
		const shouldRetryLoadingVoices = !this.props.haveVoices
			&& (
				this.state.loadVoicesRetryCount === 0
				|| previousState.loadVoicesRetryCount !== this.state.loadVoicesRetryCount
			);

		if (shouldRetryLoadingVoices) {
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
		} else {
			if(!this.state.attemptedLoadingSampleText) {
				const loadSampleTextDelay = 50;

				setTimeout(
					() => {
						this.setState(
							(_state) => ({
								attemptedLoadingSampleText: true,
							}),
							() => {
								// TODO: is this the best place to load data?
								this.props.loadSampleTextForAvailableBrowserLanguageWithInstalledVoice();
							},
						);
					},
					loadSampleTextDelay,
				);
			}
		}
	}

	speakTextInLanguageWithOverrides(text: string, languageCode: string) {
		this.props.speakTextInLanguageWithOverrides({
			languageCode,
			text,
		});
	}

	override render(): React.ReactNode {
		const {
			canSpeakInTranslatedLocale,
			sampleText,
			sampleTextLanguage,
		} = this.props;

		return (
			<Welcome
				canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
				sampleText={sampleText}
				sampleTextLanguage={sampleTextLanguage}
				speakTextInLanguageWithOverrides={this.speakTextInLanguageWithOverrides}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	WelcomeContainer,
) as unknown as React.ComponentType<WelcomeContainerProps>;
