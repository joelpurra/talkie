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

import configure from "../../hocs/configure.jsx";
import translate from "../../hocs/translate.jsx";

@configure
@translate
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
        configure: PropTypes.func.isRequired,
    }

    componentWillMount() {
        // TODO: is this the best place to load data?
        this.props.actions.loadVoices();
    }

    handleLanguageChange(value) {
        this.props.actions.loadSelectedLanguageCode(value);
    }

    handleVoiceChange(value) {
        this.props.actions.loadSelectedVoiceName(value);
    }

    handleSpeakLongTextsChange(checked) {
        this.props.actions.storeSpeakLongTexts(checked);
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
        let voicesForLanguage = null;

        if (typeof this.props.selectedLanguageCode === "string" && this.props.selectedLanguageCode.length > 0) {
            voicesForLanguage = this.props.voices.filter((voice) => voice.lang.startsWith(this.props.selectedLanguageCode));
        } else {
            voicesForLanguage = this.props.voices;
        }

        // TODO: move to function and/or state?
        const hasSelectedLanguageCode = typeof this.props.selectedLanguageCode === "string" && this.props.selectedLanguageCode.length > 0;

        // TODO: move to function and/or state?
        const hasSelectedVoiceName = typeof this.props.selectedVoiceName === "string" && this.props.selectedVoiceName.length > 0;

        const isDefaultVoiceNameForLanguage = hasSelectedVoiceName && this.props.selectedVoiceName === this.props.defaultVoiceNameForSelectedLanguage;

        return (
            <section>
                <p>{this.props.translate("frontend_voicesDescription")}</p>
                {/*
                    <p>TODO REMOVE selectedLanguageCode {this.props.selectedLanguageCode}</p>
                    <p>TODO REMOVE selectedVoiceName {this.props.selectedVoiceName}</p>
                    <p>TODO REMOVE defaultVoiceNameForSelectedLanguage {this.props.defaultVoiceNameForSelectedLanguage}</p>
                    <p>TODO REMOVE sampleText {this.props.sampleText}</p>
                    <p>TODO REMOVE rateForSelectedVoice {this.props.rateForSelectedVoice.toFixed(2)}</p>
                    <p>TODO REMOVE pitchForSelectedVoice {this.props.pitchForSelectedVoice.toFixed(2)}</p>
                */}
                <table>
                    <colgroup>
                        <col width="100%" />
                    </colgroup>

                    <SampleText
                        onChange={this.handleSampleTextChange}
                        value={this.props.sampleText}
                        disabled={this.props.voices.length === 0}
                    />

                    <tbody>
                        <tr>
                            <th scope="col">
                                {this.props.translate("frontend_voicesAvailableLanguages")}
                                {" "}
                                ({this.props.languages.length})
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <AvailableLanguages
                                    onChange={this.handleLanguageChange}
                                    value={this.props.selectedLanguageCode}
                                    voices={this.props.voices}
                                    disabled={this.props.languages.length === 0}
                                />
                            </td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr>
                            <th scope="col">
                                {this.props.translate("frontend_voicesAvailableVoices")}
                                {" "}
                                ({(this.props.selectedLanguageCode ? (this.props.selectedLanguageCode + ", ") : "")}{voicesForLanguage.length})
                            </th>
                        </tr>
                        <tr>
                            <td>
                                <AvailableVoices
                                    onChange={this.handleVoiceChange}
                                    defaultVoiceNameForSelectedLanguage={this.props.defaultVoiceNameForSelectedLanguage}
                                    value={this.props.selectedVoiceName}
                                    voices={voicesForLanguage}
                                    disabled={this.props.voices.length === 0}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="premium-section">
                    <p><a href={this.props.configure("urls.store-premium")}><span className="icon icon-inline icon-16px icon-talkie premium"></span>Talkie Premium</a></p>

                    <table>
                        <colgroup>
                            <col width="100%" />
                        </colgroup>

                        <ToggleDefault
                            onClick={this.handleToogleDefaultClick}
                            languageCode={this.props.selectedLanguageCode}
                            voiceName={this.props.selectedVoiceName}
                            disabled={!this.props.isPremiumVersion || !hasSelectedLanguageCode || !hasSelectedVoiceName || isDefaultVoiceNameForLanguage}
                        />

                        <Rate
                            onChange={this.handleRateChange}
                            voiceName={this.props.selectedVoiceName}
                            min={rateRange.min}
                            defaultValue={rateRange.default}
                            initialValue={this.props.rateForSelectedVoice}
                            max={rateRange.max}
                            step={rateRange.step}
                            disabled={!hasSelectedVoiceName}
                        />

                        <Pitch
                            onChange={this.handlePitchChange}
                            voiceName={this.props.selectedVoiceName}
                            min={pitchRange.min}
                            defaultValue={pitchRange.default}
                            initialValue={this.props.pitchForSelectedVoice}
                            max={pitchRange.max}
                            step={pitchRange.step}
                            disabled={!hasSelectedVoiceName}
                        />
                    </table>
                </div>

                <table>
                    <colgroup>
                        <col width="100%" />
                    </colgroup>

                    <SpeakLongTexts
                        onChange={this.handleSpeakLongTextsChange}
                        checked={this.props.speakLongTexts}
                        disabled={this.props.voices.length === 0}
                    />
                </table>
            </section>
        );
    }
}
