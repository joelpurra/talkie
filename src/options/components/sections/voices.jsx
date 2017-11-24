/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017 Joel Purra <https://joelpurra.com/>

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

import React from "react";
import PropTypes from "prop-types";

import PremiumSection from "../../../shared/components/section/premium-section.jsx";

// TODO: proper data handling.
import {
    rateRange,
    pitchRange,
} from "../../../shared/voices";

import SpeakLongTexts from "./voices/speak-long-texts.jsx";

import SampleText from "./voices/sample-text.jsx";

import AvailableLanguages from "./voices/available-languages.jsx";

import AvailableVoices from "./voices/available-voices.jsx";

import ToggleDefault from "./voices/toggle-default.jsx";

import Rate from "./voices/rate.jsx";

import Pitch from "./voices/pitch.jsx";

import translateAttribute from "../../../shared/hocs/translate.jsx";

import * as tableBase from "../../../shared/styled/table/table-base.jsx";

@translateAttribute
export default class Voices extends React.Component {
    constructor(props) {
        super(props);

        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleVoiceChange = this.handleVoiceChange.bind(this);
        this.handleSpeakLongTextsChange = this.handleSpeakLongTextsChange.bind(this);
        this.handleSampleTextChange = this.handleSampleTextChange.bind(this);
        this.handleToogleDefaultClick = this.handleToogleDefaultClick.bind(this);
        this.handleRateChange = this.handleRateChange.bind(this);
        this.handlePitchChange = this.handlePitchChange.bind(this);
    }

    static defaultProps = {
        actions: {},
        languages: [],
        voices: [],
        speakLongTexts: false,
        selectedLanguageCode: null,
        selectedVoiceName: null,
        defaultVoiceNameForSelectedLanguage: null,
        sampleText: null,
        rateForSelectedVoice: 1,
        pitchForSelectedVoice: 1,
        isPremiumVersion: false,
    };

    static propTypes = {
        actions: PropTypes.object.isRequired,
        languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        voices: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            lang: PropTypes.string.isRequired,
        })).isRequired,
        speakLongTexts: PropTypes.bool.isRequired,
        selectedLanguageCode: PropTypes.string,
        selectedVoiceName: PropTypes.string,
        defaultVoiceNameForSelectedLanguage: PropTypes.string,
        sampleText: PropTypes.string,
        rateForSelectedVoice: PropTypes.number.isRequired,
        pitchForSelectedVoice: PropTypes.number.isRequired,
        isPremiumVersion: PropTypes.bool.isRequired,
        translate: PropTypes.func.isRequired,
    }

    handleLanguageChange(value) {
        this.props.actions.loadSelectedLanguageCode(value);
    }

    handleVoiceChange(value) {
        this.props.actions.loadSelectedVoiceName(value);
    }

    handleSpeakLongTextsChange(speakLongTexts) {
        this.props.actions.storeSpeakLongTexts(speakLongTexts);
    }

    handleSampleTextChange(value) {
        this.props.actions.setSampleText(value);
    }

    handleToogleDefaultClick() {
        this.props.actions.storeDefaultVoiceNameForLanguage(this.props.selectedLanguageCode, this.props.selectedVoiceName);
    }

    handleRateChange(value) {
        this.props.actions.storeVoiceRateOverride(this.props.selectedVoiceName, value);
    }

    handlePitchChange(value) {
        this.props.actions.storeVoicePitchOverride(this.props.selectedVoiceName, value);
    }

    render() {
        const {
            defaultVoiceNameForSelectedLanguage,
            isPremiumVersion,
            languages,
            pitchForSelectedVoice,
            rateForSelectedVoice,
            sampleText,
            selectedLanguageCode,
            selectedVoiceName,
            speakLongTexts,
            translate,
            voices,
      } = this.props;

        let voicesForLanguage = null;

        if (typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0) {
            voicesForLanguage = voices.filter((voice) => voice.lang.startsWith(selectedLanguageCode));
        } else {
            voicesForLanguage = voices;
        }

        // TODO: move to function and/or state?
        const hasSelectedLanguageCode = typeof selectedLanguageCode === "string" && selectedLanguageCode.length > 0;

        // TODO: move to function and/or state?
        const hasSelectedVoiceName = typeof selectedVoiceName === "string" && selectedVoiceName.length > 0;

        // TODO: move to function and/or state?
        const isDefaultVoiceNameForLanguage = hasSelectedVoiceName && selectedVoiceName === defaultVoiceNameForSelectedLanguage;

        return (
            <section>
                <p>{translate("frontend_voicesDescription")}</p>

                <tableBase.table>
                    <colgroup>
                        <col width="100%" />
                    </colgroup>

                    <SampleText
                        onChange={this.handleSampleTextChange}
                        value={sampleText}
                        disabled={voices.length === 0}
                    />

                    <tableBase.tbody>
                        <tableBase.tr>
                            <tableBase.th scope="col">
                                {translate("frontend_voicesAvailableLanguages")}
                                {" "}
                                ({languages.length})
                            </tableBase.th>
                        </tableBase.tr>
                        <tableBase.tr>
                            <tableBase.td>
                                <AvailableLanguages
                                    onChange={this.handleLanguageChange}
                                    value={selectedLanguageCode}
                                    voices={voices}
                                    disabled={languages.length === 0}
                                />
                            </tableBase.td>
                        </tableBase.tr>
                    </tableBase.tbody>

                    <tableBase.tbody>
                        <tableBase.tr>
                            <tableBase.th scope="col">
                                {translate("frontend_voicesAvailableVoices")}
                                {" "}
                                ({(selectedLanguageCode ? (selectedLanguageCode + ", ") : "")}{voicesForLanguage.length})
                            </tableBase.th>
                        </tableBase.tr>
                        <tableBase.tr>
                            <tableBase.td>
                                <AvailableVoices
                                    onChange={this.handleVoiceChange}
                                    defaultVoiceNameForSelectedLanguage={defaultVoiceNameForSelectedLanguage}
                                    value={selectedVoiceName}
                                    voices={voicesForLanguage}
                                    disabled={voices.length === 0}
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
                            <col width="100%" />
                        </colgroup>

                        <ToggleDefault
                            onClick={this.handleToogleDefaultClick}
                            languageCode={selectedLanguageCode}
                            voiceName={selectedVoiceName}
                            disabled={!isPremiumVersion || !hasSelectedLanguageCode || !hasSelectedVoiceName || isDefaultVoiceNameForLanguage}
                        />

                        <Rate
                            onChange={this.handleRateChange}
                            voiceName={selectedVoiceName}
                            min={rateRange.min}
                            defaultValue={rateRange.default}
                            initialValue={rateForSelectedVoice}
                            max={rateRange.max}
                            step={rateRange.step}
                            disabled={!hasSelectedVoiceName}
                        />

                        <Pitch
                            onChange={this.handlePitchChange}
                            voiceName={selectedVoiceName}
                            min={pitchRange.min}
                            defaultValue={pitchRange.default}
                            initialValue={pitchForSelectedVoice}
                            max={pitchRange.max}
                            step={pitchRange.step}
                            disabled={!hasSelectedVoiceName}
                        />
                    </tableBase.table>
                </PremiumSection>

                <tableBase.table>
                    <colgroup>
                        <col width="100%" />
                    </colgroup>

                    <SpeakLongTexts
                        onChange={this.handleSpeakLongTextsChange}
                        speakLongTexts={speakLongTexts}
                        disabled={voices.length === 0}
                    />
                </tableBase.table>
            </section>
        );
    }
}
