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
	getVoicesForLanguage,
	LanguagesByLanguageGroup,
	VoicesByLanguage,
	VoicesByLanguageGroup,
} from "@talkie/shared-application-helpers/transform-voices";
import {
	pitchRange,
	rateRange,
} from "@talkie/shared-application-helpers/voices";
import {
	SafeVoiceObject,
} from "@talkie/split-environment-interfaces/moved-here/ivoices";
import React from "react";

import {
	actions,
} from "../../slices";
import AvailableLanguages from "./voices/available-languages";
import AvailableVoices from "./voices/available-voices";
import Pitch from "./voices/pitch";
import Rate from "./voices/rate";
import SampleText from "./voices/sample-text";
import ToggleDefault from "./voices/toggle-default";

export interface VoicesStateProps {
	effectiveVoiceNameForSelectedLanguage?: string | null;
	isPremiumEdition: boolean;
	languageGroups: readonly string[];
	languages: readonly string[];
	languagesByLanguageGroup: LanguagesByLanguageGroup;
	pitchForSelectedVoice: number;
	rateForSelectedVoice: number;
	sampleText?: string | null;
	selectedLanguageCode?: string | null;
	selectedVoiceName?: string | null;
	voices: readonly SafeVoiceObject[];
	voicesByLanguage: VoicesByLanguage<SafeVoiceObject>;
	voicesByLanguageGroup: VoicesByLanguageGroup<SafeVoiceObject>;
}

interface VoicesDispatchProps {
	loadSelectedLanguageCode: typeof actions.voices.loadSelectedLanguageCode;
	loadSelectedVoiceName: typeof actions.voices.loadSelectedVoiceName;
	setSampleText: typeof actions.voices.setSampleText;
	storeEffectiveVoiceNameForLanguage: typeof actions.voices.storeEffectiveVoiceNameForLanguage;
	storeVoiceRateOverride: typeof actions.voices.storeVoiceRateOverride;
	storeVoicePitchOverride: typeof actions.voices.storeVoicePitchOverride;
}

interface VoicesProps extends VoicesStateProps, VoicesDispatchProps, TranslateProps {}

class Voices<P extends VoicesProps> extends React.PureComponent<P> {
	static defaultProps = {
		effectiveVoiceNameForSelectedLanguage: null,
		sampleText: null,
		selectedLanguageCode: null,
		selectedVoiceName: null,
	};

	constructor(props: P) {
		super(props);

		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleVoiceChange = this.handleVoiceChange.bind(this);
		this.handleSampleTextChange = this.handleSampleTextChange.bind(this);
		this.handleToogleDefaultClick = this.handleToogleDefaultClick.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handlePitchChange = this.handlePitchChange.bind(this);
	}

	handleLanguageChange(value: string | null): void {
		if (typeof value === "string") {
			this.props.loadSelectedLanguageCode(value);
		}
	}

	handleVoiceChange(value: string): void {
		this.props.loadSelectedVoiceName(value);
	}

	handleSampleTextChange(value: string): void {
		this.props.setSampleText(value);
	}

	handleToogleDefaultClick(): void {
		if (typeof this.props.selectedLanguageCode === "string" && typeof this.props.selectedVoiceName === "string") {
			this.props.storeEffectiveVoiceNameForLanguage({
				languageCode: this.props.selectedLanguageCode,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	handleRateChange(value: number): void {
		if (typeof this.props.selectedVoiceName === "string") {
			this.props.storeVoiceRateOverride({
				rate: value,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	handlePitchChange(value: number): void {
		if (typeof this.props.selectedVoiceName === "string") {
			this.props.storeVoicePitchOverride({
				pitch: value,
				voiceName: this.props.selectedVoiceName,
			});
		}
	}

	override render(): React.ReactNode {
		const {
			effectiveVoiceNameForSelectedLanguage,
			isPremiumEdition,
			languages,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			sampleText,
			selectedLanguageCode,
			selectedVoiceName,
			translateSync,
			voices,
			voicesByLanguage,
			voicesByLanguageGroup,
			languageGroups,
			languagesByLanguageGroup,
		} = this.props;

		// TODO: move filtering to selectors?
		const voicesForLanguage = typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0 ? getVoicesForLanguage(voices, selectedLanguageCode) : voices;

		// TODO: move to function and/or state?
		const hasSelectedLanguageCode = typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0;

		// TODO: move to function and/or state?
		const hasSelectedVoiceName = typeof selectedVoiceName === "string" && selectedVoiceName.length > 0;

		// TODO: move to function and/or state?
		const isEffectiveVoiceNameForLanguage = hasSelectedVoiceName && selectedVoiceName === effectiveVoiceNameForSelectedLanguage;

		return (
			<section>
				<p>
					{translateSync("frontend_voicesDescription")}
				</p>

				<tableBase.table>
					<colgroup>
						<col width="100%"/>
					</colgroup>

					<SampleText
						disabled={voices.length === 0}
						value={sampleText}
						onChange={this.handleSampleTextChange}
					/>

					<tableBase.tbody>
						<tableBase.tr>
							<tableBase.th scope="col">
								{translateSync("frontend_voicesAvailableLanguages")}
								{" "}
								(
								{languages.length}
								)
							</tableBase.th>
						</tableBase.tr>
						<tableBase.tr>
							<tableBase.td>
								<AvailableLanguages
									disabled={languages.length === 0}
									languageGroups={languageGroups}
									languagesByLanguageGroup={languagesByLanguageGroup}
									value={selectedLanguageCode}
									voicesByLanguage={voicesByLanguage}
									voicesByLanguageGroup={voicesByLanguageGroup}
									onChange={this.handleLanguageChange}
								/>
							</tableBase.td>
						</tableBase.tr>
					</tableBase.tbody>

					<tableBase.tbody>
						<tableBase.tr>
							<tableBase.th scope="col">
								{translateSync("frontend_voicesAvailableVoices")}
								{" "}
								(
								{(typeof selectedLanguageCode === "string" ? (`${selectedLanguageCode}, `) : "")}
								{voicesForLanguage.length}
								)
							</tableBase.th>
						</tableBase.tr>
						<tableBase.tr>
							<tableBase.td>
								<AvailableVoices
									disabled={voices.length === 0}
									effectiveVoiceNameForSelectedLanguage={effectiveVoiceNameForSelectedLanguage}
									value={selectedVoiceName}
									voices={voicesForLanguage}
									onChange={this.handleVoiceChange}
								/>
							</tableBase.td>
						</tableBase.tr>
					</tableBase.tbody>
				</tableBase.table>

				<PremiumSection
					mode="p"
				>
					<tableBase.table>
						<colgroup>
							<col width="100%"/>
						</colgroup>

						<ToggleDefault
							disabled={!isPremiumEdition || !hasSelectedLanguageCode || !hasSelectedVoiceName || isEffectiveVoiceNameForLanguage}
							languageCode={selectedLanguageCode}
							voiceName={selectedVoiceName}
							onClick={this.handleToogleDefaultClick}
						/>

						<Rate
							defaultValue={rateRange.default}
							disabled={!hasSelectedVoiceName}
							initialValue={rateForSelectedVoice}
							listName="voice-rate-range-list"
							max={rateRange.max}
							min={rateRange.min}
							step={rateRange.step}
							voiceName={selectedVoiceName}
							onChange={this.handleRateChange}
						/>

						<Pitch
							defaultValue={pitchRange.default}
							disabled={!hasSelectedVoiceName}
							initialValue={pitchForSelectedVoice}
							listName="voice-pitch-range-list"
							max={pitchRange.max}
							min={pitchRange.min}
							step={pitchRange.step}
							voiceName={selectedVoiceName}
							onChange={this.handlePitchChange}
						/>
					</tableBase.table>
				</PremiumSection>
			</section>
		);
	}
}

export default translateAttribute<VoicesProps>()(
	Voices,
);
