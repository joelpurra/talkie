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

import PropTypes from "prop-types";
import React from "react";

import PremiumSection from "../../../shared/components/section/premium-section.jsx";
import translateAttribute from "../../../shared/hocs/translate.jsx";
import * as tableBase from "../../../shared/styled/table/table-base.jsx";
// TODO: proper data handling.
import {
	getVoicesForLanguage,
} from "../../../shared/utils/transform-voices";
// TODO: proper data handling.
import {
	pitchRange,
	rateRange,
} from "../../../shared/voices";
import AvailableLanguages from "./voices/available-languages.jsx";
import AvailableVoices from "./voices/available-voices.jsx";
import Pitch from "./voices/pitch.jsx";
import Rate from "./voices/rate.jsx";
import SampleText from "./voices/sample-text.jsx";
import ToggleDefault from "./voices/toggle-default.jsx";

export default
@translateAttribute
class Voices extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleLanguageChange = this.handleLanguageChange.bind(this);
		this.handleVoiceChange = this.handleVoiceChange.bind(this);
		this.handleSampleTextChange = this.handleSampleTextChange.bind(this);
		this.handleToogleDefaultClick = this.handleToogleDefaultClick.bind(this);
		this.handleRateChange = this.handleRateChange.bind(this);
		this.handlePitchChange = this.handlePitchChange.bind(this);
	}

	static defaultProps = {
		effectiveVoiceNameForSelectedLanguage: null,
		sampleText: null,
		selectedLanguageCode: null,
		selectedVoiceName: null,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		effectiveVoiceNameForSelectedLanguage: PropTypes.string,
		isPremiumEdition: PropTypes.bool.isRequired,
		languageGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		languagesByLanguageGroup: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
		).isRequired,
		pitchForSelectedVoice: PropTypes.number.isRequired,
		rateForSelectedVoice: PropTypes.number.isRequired,
		sampleText: PropTypes.string,
		selectedLanguageCode: PropTypes.string,
		selectedVoiceName: PropTypes.string,
		translate: PropTypes.func.isRequired,
		voices: PropTypes.arrayOf(PropTypes.shape({
			"default": PropTypes.bool.isRequired,
			lang: PropTypes.string.isRequired,
			localService: PropTypes.bool.isRequired,
			name: PropTypes.string.isRequired,
			voiceURI: PropTypes.string.isRequired,
		})).isRequired,
		voicesByLanguage: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.shape({
				"default": PropTypes.bool.isRequired,
				lang: PropTypes.string.isRequired,
				localService: PropTypes.bool.isRequired,
				name: PropTypes.string.isRequired,
				voiceURI: PropTypes.string.isRequired,
			})).isRequired,
		).isRequired,
		voicesByLanguageGroup: PropTypes.objectOf(
			PropTypes.arrayOf(PropTypes.shape({
				"default": PropTypes.bool.isRequired,
				lang: PropTypes.string.isRequired,
				localService: PropTypes.bool.isRequired,
				name: PropTypes.string.isRequired,
				voiceURI: PropTypes.string.isRequired,
			})).isRequired,
		).isRequired,
	}

	handleLanguageChange(value) {
		this.props.actions.voices.loadSelectedLanguageCode(value);
	}

	handleVoiceChange(value) {
		this.props.actions.voices.loadSelectedVoiceName(value);
	}

	handleSampleTextChange(value) {
		this.props.actions.voices.setSampleText(value);
	}

	handleToogleDefaultClick() {
		this.props.actions.voices.storeEffectiveVoiceNameForLanguage(this.props.selectedLanguageCode, this.props.selectedVoiceName);
	}

	handleRateChange(value) {
		this.props.actions.voices.storeVoiceRateOverride(this.props.selectedVoiceName, value);
	}

	handlePitchChange(value) {
		this.props.actions.voices.storeVoicePitchOverride(this.props.selectedVoiceName, value);
	}

	render() {
		const {
			effectiveVoiceNameForSelectedLanguage,
			isPremiumEdition,
			languages,
			pitchForSelectedVoice,
			rateForSelectedVoice,
			sampleText,
			selectedLanguageCode,
			selectedVoiceName,
			translate,
			voices,
			voicesByLanguage,
			voicesByLanguageGroup,
			languageGroups,
			languagesByLanguageGroup,
		} = this.props;

		let voicesForLanguage = null;

		if (typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0) {
			voicesForLanguage = getVoicesForLanguage(voices, selectedLanguageCode);
		} else {
			voicesForLanguage = voices;
		}

		// TODO: move to function and/or state?
		const hasSelectedLanguageCode = typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0;

		// TODO: move to function and/or state?
		const hasSelectedVoiceName = typeof selectedVoiceName === "string" && selectedVoiceName.length > 0;

		// TODO: move to function and/or state?
		const isEffectiveVoiceNameForLanguage = hasSelectedVoiceName && selectedVoiceName === effectiveVoiceNameForSelectedLanguage;

		return (
			<section>
				<p>
					{translate("frontend_voicesDescription")}
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
								{translate("frontend_voicesAvailableLanguages")}
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
								{translate("frontend_voicesAvailableVoices")}
								{" "}
								(
								{(selectedLanguageCode ? (selectedLanguageCode + ", ") : "")}
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
