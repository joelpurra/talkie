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

import toolkit from "@reduxjs/toolkit";
import {
	type TalkieLocale,
} from "@talkie/shared-interfaces/italkie-locale.mjs";
import React from "react";
import {
	connect,
	type MapDispatchToPropsFunction,
	type MapStateToProps,
} from "react-redux";

import Welcome from "../app/sections/welcome.js";
import selectors from "../selectors/index.mjs";
import {
	actions,
} from "../slices/index.mjs";
import type {
	OptionsRootState,
} from "../store/index.mjs";

const {
	bindActionCreators,
} = toolkit;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WelcomeContainerProps {}

interface WelcomeContainerState {
	attemptedLoadingSampleText: boolean;
}

interface StateProps {
	canSpeakInTranslatedLocale: boolean;
	sampleText: string | null;
	sampleTextLanguage: TalkieLocale | null;
}

interface DispatchProps {
	loadSampleTextForAvailableBrowserLanguageWithInstalledVoice: typeof actions.welcome.loadSampleTextForAvailableBrowserLanguageWithInstalledVoice;
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
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
});

class WelcomeContainer<P extends InternalProps, S extends WelcomeContainerState> extends React.PureComponent<P, S> {
	override state = (
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		{
			attemptedLoadingSampleText: false,
		} as S
	);

	// NOTE: executing in both browser and node.js environments, but timeout/interval objects differ.
	// https://nodejs.org/api/timers.html#timers_class_timeout
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private _sampleTextLoadTimeoutId: any | null;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override componentDidUpdate(_previousProps: P): void {
		// NOTE: voices may not be loaded on the first attempt, so delaying loading the matching sample text.
		// TODO: could the sample text be a selector, automatically triggered by any voice list changes?
		if (!this.state.attemptedLoadingSampleText) {
			const loadSampleTextDelay = 50;

			this._sampleTextLoadTimeoutId = setTimeout(
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

	override componentWillUnmount(): void {
		this.componentCleanup();
	}

	componentCleanup() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		clearTimeout(this._sampleTextLoadTimeoutId);
	}

	override render(): React.ReactNode {
		const {
			canSpeakInTranslatedLocale,
			sampleText,
			sampleTextLanguage,
			speakTextInLanguageWithOverrides,
		} = this.props as P;

		return (
			<Welcome
				canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
				sampleText={sampleText}
				sampleTextLanguage={sampleTextLanguage}
				speakTextInLanguageWithOverrides={speakTextInLanguageWithOverrides}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalProps, OptionsRootState>(mapStateToProps, mapDispatchToProps)(
	WelcomeContainer,
) as unknown as React.ComponentType<WelcomeContainerProps>;
