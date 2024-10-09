/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type {
	SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import type {
	SpeakingHistoryEntry,
} from "@talkie/shared-interfaces/speaking-history.mjs";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import type {
	OnOpenShortcutKeysClickProp,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import type {
	actions,
} from "../../slices/index.mjs";
import ContinueOnTabRemoved from "./settings/continue-on-tab-removed.js";
import ContinueOnTabUpdatedUrl from "./settings/continue-on-tab-updated-url.js";
import ContinueSpeech from "./settings/continue-speech.js";
import ReadClipboardPermission from "./settings/read-clipboard-permission.js";
import ShowAdditionalDetails from "./settings/show-additional-details.js";
import SpeakLongTexts from "./settings/speak-long-texts.js";
import SpeakingHistoryLimit from "./settings/speaking-history-limit.js";

export interface SettingsStateProps {
	continueOnTabRemoved: boolean;
	continueOnTabUpdatedUrl: boolean;
	hasClipboardReadPermission: boolean | null;
	isPremiumEdition: boolean;
	clipboardText: string | null | undefined;
	showAdditionalDetails: boolean;
	speakingHistory: Readonly<SpeakingHistoryEntry[]>;
	speakingHistoryCount: number;
	speakingHistoryLimit: number;
	speakLongTexts: boolean;
	systemType: SystemType | null;
}

export interface SettingsDispatchProps {
	askClipboardReadPermission: typeof actions.shared.clipboard.askClipboardReadPermission;
	clearSpeakingHistory: typeof actions.shared.history.clearSpeakingHistory;
	denyClipboardReadPermission: typeof actions.shared.clipboard.denyClipboardReadPermission;
	loadHasClipboardReadPermission: typeof actions.shared.clipboard.loadHasClipboardReadPermission;
	readFromClipboard: typeof actions.shared.clipboard.readFromClipboard;
	removeSpeakingHistoryEntry: typeof actions.shared.history.removeSpeakingHistoryEntry;
	speakFromClipboard: typeof actions.shared.clipboard.speakFromClipboard;
	storeContinueOnTabRemoved: typeof actions.settings.storeContinueOnTabRemoved;
	storeContinueOnTabUpdatedUrl: typeof actions.settings.storeContinueOnTabUpdatedUrl;
	storeShowAdditionalDetails: typeof actions.settings.storeShowAdditionalDetails;
	storeSpeakingHistoryLimit: typeof actions.settings.storeSpeakingHistoryLimit;
	storeSpeakLongTexts: typeof actions.settings.storeSpeakLongTexts;
}

interface SettingsProps extends SettingsStateProps, SettingsDispatchProps, TranslateProps {
	// TODO: move to separate interface.
	onOpenShortKeysConfigurationClick: OnOpenShortcutKeysClickProp;
}

class Settings<P extends SettingsProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			askClipboardReadPermission,
			clearSpeakingHistory,
			clipboardText,
			continueOnTabRemoved,
			continueOnTabUpdatedUrl,
			denyClipboardReadPermission,
			hasClipboardReadPermission,
			isPremiumEdition,
			onOpenShortKeysConfigurationClick,
			readFromClipboard,
			removeSpeakingHistoryEntry,
			showAdditionalDetails,
			speakFromClipboard,
			speakingHistory,
			speakingHistoryCount,
			speakingHistoryLimit,
			speakLongTexts,
			storeContinueOnTabRemoved,
			storeContinueOnTabUpdatedUrl,
			storeShowAdditionalDetails,
			storeSpeakingHistoryLimit,
			storeSpeakLongTexts,
			systemType,
			translateSync,
		} = this.props as P;
		return (
			<>
				<textBase.h1>
					{translateSync("frontend_settingsLinkText")}
				</textBase.h1>

				<section>
					<ReadClipboardPermission
						askClipboardReadPermission={askClipboardReadPermission}
						clipboardText={clipboardText}
						denyClipboardReadPermission={denyClipboardReadPermission}
						disabled={false}
						hasClipboardReadPermission={hasClipboardReadPermission}
						isPremiumEdition={isPremiumEdition}
						readFromClipboard={readFromClipboard}
						showAdditionalDetails={showAdditionalDetails}
						speakFromClipboard={speakFromClipboard}
						systemType={systemType}
						onOpenShortKeysConfigurationClick={onOpenShortKeysConfigurationClick}
					/>

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
			</>
		);
	}
}

export default translateAttribute<SettingsProps & TranslateProps>()(
	Settings,
);
