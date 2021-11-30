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

import PremiumSection from "@talkie/shared-application/components/section/premium-section";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as tableBase from "@talkie/shared-application/styled/table/table-base";
import {
	pitchRange,
	rateRange,
} from "@talkie/shared-application-helpers/voices";
import React from "react";

import Pitch from "./voice-options/pitch";
import Rate from "./voice-options/rate";
import ToggleDefault from "./voice-options/toggle-default";

interface DialectVoiceOptionsStateProps {
	isEffectiveVoiceNameForLanguageCode: boolean;
	isEffectiveVoiceNameForLanguageGroup: boolean;
	isPremiumEdition: boolean;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	selectedLanguageCode: string;
	selectedLanguageGroup: string;
	selectedVoiceName: string;
}

interface DialectVoiceOptionsDispatchProps {
	onPickDefaultClick: (languageCodeOrGroup: string) => void;
	onPitchChange: (value: number) => void;
	onRateChange: (value: number) => void;
}

interface InternalProps extends DialectVoiceOptionsStateProps, DialectVoiceOptionsDispatchProps, TranslateProps {}

class DialectVoiceOptions<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			isEffectiveVoiceNameForLanguageCode,
			isEffectiveVoiceNameForLanguageGroup,
			isPremiumEdition,
			onPickDefaultClick,
			onPitchChange,
			onRateChange,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			selectedLanguageCode,
			selectedLanguageGroup,
			selectedVoiceName,
			translateSync,
		} = this.props;

		return (
			<PremiumSection
				mode="p"
			>
				<p>
					{translateSync("frontend_voicesTalkiePremiumPitch")}
				</p>

				<tableBase.wideTable>
					<colgroup>
						<col width="*"/>
						<col width="100%"/>
					</colgroup>

					<ToggleDefault
						disabled={!isPremiumEdition}
						isDefault={isEffectiveVoiceNameForLanguageGroup}
						languageCode={selectedLanguageGroup}
						voiceName={selectedVoiceName}
						onClick={() => {
							onPickDefaultClick(selectedLanguageGroup);
						}}
					/>

					<ToggleDefault
						disabled={!isPremiumEdition}
						isDefault={isEffectiveVoiceNameForLanguageCode}
						languageCode={selectedLanguageCode}
						voiceName={selectedVoiceName}
						onClick={() => {
							onPickDefaultClick(selectedLanguageCode);
						}}
					/>

					<Rate
						defaultValue={rateRange.default}
						disabled={false}
						initialValue={rateForSelectedVoice}
						listName="voice-rate-range-list"
						max={rateRange.max}
						min={rateRange.min}
						step={rateRange.step}
						voiceName={selectedVoiceName}
						onChange={onRateChange}
					/>

					<Pitch
						defaultValue={pitchRange.default}
						disabled={false}
						initialValue={pitchForSelectedVoice}
						listName="voice-pitch-range-list"
						max={pitchRange.max}
						min={pitchRange.min}
						step={pitchRange.step}
						voiceName={selectedVoiceName}
						onChange={onPitchChange}
					/>
				</tableBase.wideTable>
			</PremiumSection>
		);
	}
}

export default translateAttribute<InternalProps>()(
	DialectVoiceOptions,
);
