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
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import {
	type SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import React from "react";

import {
	type actions,
} from "../../slices/index.mjs";
import ContinueOnTabRemoved from "./settings/continue-on-tab-removed.js";
import ContinueOnTabUpdatedUrl from "./settings/continue-on-tab-updated-url.js";
import ContinueSpeech from "./settings/continue-speech.js";
import ShowAdditionalDetails from "./settings/show-additional-details.js";
import SpeakLongTexts from "./settings/speak-long-texts.js";
import SpeakingHistoryLimit from "./settings/speaking-history-limit.js";

export interface SettingsStateProps {
	showAdditionalDetails: boolean;
	speakLongTexts: boolean;
	speakingHistoryCount: number;
	speakingHistoryLimit: number;
	speakingHistory: Readonly<SpeakingHistoryEntry[]>;
	systemType: SystemType | null;
	continueOnTabRemoved: boolean;
	continueOnTabUpdatedUrl: boolean;
}

export interface SettingsDispatchProps {
	clearSpeakingHistory: typeof actions.shared.history.clearSpeakingHistory;
	removeSpeakingHistoryEntry: typeof actions.shared.history.removeSpeakingHistoryEntry;
	storeShowAdditionalDetails: typeof actions.settings.storeShowAdditionalDetails;
	storeSpeakLongTexts: typeof actions.settings.storeSpeakLongTexts;
	storeSpeakingHistoryLimit: typeof actions.settings.storeSpeakingHistoryLimit;
	storeContinueOnTabRemoved: typeof actions.settings.storeContinueOnTabRemoved;
	storeContinueOnTabUpdatedUrl: typeof actions.settings.storeContinueOnTabUpdatedUrl;
}

interface SettingsProps extends SettingsStateProps, SettingsDispatchProps {}

export default class Settings<P extends SettingsProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			clearSpeakingHistory,
			removeSpeakingHistoryEntry,
			showAdditionalDetails,
			speakingHistory,
			speakingHistoryCount,
			speakingHistoryLimit,
			speakLongTexts,
			continueOnTabRemoved,
			continueOnTabUpdatedUrl,
			storeShowAdditionalDetails,
			storeSpeakingHistoryLimit,
			storeSpeakLongTexts,
			storeContinueOnTabRemoved,
			storeContinueOnTabUpdatedUrl,
			systemType,
		} = this.props as P;
		return (
			<section>
				<SpeakingHistoryLimit
					clearSpeakingHistory={clearSpeakingHistory}
					disabled={false}
					removeSpeakingHistoryEntry={removeSpeakingHistoryEntry}
					speakingHistory={speakingHistory}
					speakingHistoryCount={speakingHistoryCount}
					speakingHistoryLimit={speakingHistoryLimit}
					onChange={storeSpeakingHistoryLimit}
				/>

				<ContinueSpeech>
					<ContinueOnTabRemoved
						continueOnTabRemoved={continueOnTabRemoved}
						disabled={false}
						onChange={storeContinueOnTabRemoved}
					/>
					<ContinueOnTabUpdatedUrl
						continueOnTabUpdatedUrl={continueOnTabUpdatedUrl}
						disabled={false}
						systemType={systemType}
						onChange={storeContinueOnTabUpdatedUrl}
					/>
				</ContinueSpeech>

				<SpeakLongTexts
					disabled={false}
					speakLongTexts={speakLongTexts}
					onChange={storeSpeakLongTexts}
				/>

				<ShowAdditionalDetails
					disabled={false}
					showAdditionalDetails={showAdditionalDetails}
					onChange={storeShowAdditionalDetails}
				/>
			</section>
		);
	}
}
