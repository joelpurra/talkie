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

import TalkieLocaleHelper from "@talkie/shared-locales/talkie-locale-helper";
import LocaleProvider from "@talkie/split-environment/locale-provider";
import {
	OsType,
	SystemType,
} from "@talkie/split-environment-interfaces/moved-here/imetadata-manager";
import React from "react";
import {
	connect,
	MapDispatchToPropsFunction,
	MapStateToProps,
} from "react-redux";
import {
	bindActionCreators,
} from "redux";

import Welcome from "../components/sections/welcome";
import selectors from "../selectors/index";
import {
	actions,
} from "../slices/index";
import {
	DemoRootState,
} from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WelcomeContainerProps {}

interface WelcomeContainerState {
	loadVoicesRetryCount: number;
}

interface StateProps {
	availableBrowserLanguageWithInstalledVoice: string[];
	languageGroups: readonly string[];
	languageGroupsCount: number;
	languages: readonly string[];
	languagesCount: number;
	osType?: OsType | null;
	systemType: SystemType | null;
	voicesCount: number;
}

interface DispatchProps {
	speakTextInLanguageWithOverrides: typeof actions.shared.speaking.speakTextInLanguageWithOverrides;
	loadVoices: typeof actions.shared.voices.loadVoices;
}

interface InternalWelcomeContainerProps extends StateProps, DispatchProps {}

// TODO: use a HOC or something else?
const talkieLocaleHelper = new TalkieLocaleHelper();
const localeProvider = new LocaleProvider();

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const mapStateToProps: MapStateToProps<StateProps, InternalWelcomeContainerProps, DemoRootState> = (state: Readonly<DemoRootState>) => ({
	availableBrowserLanguageWithInstalledVoice: selectors.shared.voices.getAvailableBrowserLanguageWithInstalledVoice(state),
	languageGroups: selectors.shared.voices.getLanguageGroups(state),
	languageGroupsCount: selectors.shared.voices.getLanguageGroupsCount(state),
	languages: selectors.shared.voices.getLanguages(state),
	languagesCount: selectors.shared.voices.getLanguagesCount(state),
	osType: state.shared.metadata.osType,
	systemType: state.shared.metadata.systemType,
	voicesCount: selectors.shared.voices.getVoicesCount(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, InternalWelcomeContainerProps> = (dispatch) => ({
	loadVoices: bindActionCreators(actions.shared.voices.loadVoices, dispatch),
	speakTextInLanguageWithOverrides: bindActionCreators(actions.shared.speaking.speakTextInLanguageWithOverrides, dispatch),
});

class WelcomeContainer<P extends InternalWelcomeContainerProps, S extends WelcomeContainerState> extends React.PureComponent<P, S> {
	static defaultProps = {
		osType: null,
	};

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
			this.props.voicesCount === 0
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

	override render(): React.ReactNode {
		const {
			systemType,
			osType,
			voicesCount,
			languagesCount,
			languageGroupsCount,
			languages,
			languageGroups,
			availableBrowserLanguageWithInstalledVoice,
		} = this.props;

		// TODO: create action and store as redux state?
		const sampleTextLanguageCode = availableBrowserLanguageWithInstalledVoice
			.find((languageCode: string) => {
				if (talkieLocaleHelper.isTalkieLocale(languageCode)) {
					// eslint-disable-next-line no-sync
					return Boolean(talkieLocaleHelper.getSampleTextSync(languageCode));
				}

				return false;
			});

		// TODO: create action and store as redux state?
		let sampleText = null;

		if (typeof sampleTextLanguageCode === "string" && talkieLocaleHelper.isTalkieLocale(sampleTextLanguageCode)) {
			// eslint-disable-next-line no-sync
			sampleText = talkieLocaleHelper.getSampleTextSync(sampleTextLanguageCode);
		}

		// TODO: create action and store as redux state?
		const translationLocale = localeProvider.getTranslationLocale();
		const canSpeakInTranslatedLocale = languages.includes(translationLocale) || languageGroups.includes(translationLocale);

		return (
			<Welcome
				canSpeakInTranslatedLocale={canSpeakInTranslatedLocale}
				languageGroupsCount={languageGroupsCount}
				languagesCount={languagesCount}
				osType={osType}
				sampleText={sampleText}
				sampleTextLanguageCode={sampleTextLanguageCode}
				speakTextInLanguageWithOverrides={this.speakTextInLanguageWithOverrides}
				systemType={systemType}
				voicesCount={voicesCount}
			/>
		);
	}
}

export default connect<StateProps, DispatchProps, InternalWelcomeContainerProps, DemoRootState>(mapStateToProps, mapDispatchToProps)(
	WelcomeContainer,
) as unknown as React.ComponentType<WelcomeContainerProps>;
