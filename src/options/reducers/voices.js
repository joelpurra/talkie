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
	createAssignmentActionMapReducer,
} from "../../shared/utils/reduce-helpers";
import * as actionTypes from "../constants/action-types-voices";

const initialState = {
	selectedLanguageCode: null,
	selectedVoiceName: null,
	effectiveVoiceNameForSelectedLanguage: null,
	sampleText: "",
	rateForSelectedVoice: 1,
	pitchForSelectedVoice: 1,
};

const customActionsMap = {};

const assignActionsMap = {
	[actionTypes.SET_SELECTED_LANGUAGE_CODE]: "selectedLanguageCode",
	[actionTypes.SET_SELECTED_VOICE_NAME]: "selectedVoiceName",
	[actionTypes.SET_DEFAULT_VOICE_NAME_FOR_SELECTED_LANGUAGE]: "effectiveVoiceNameForSelectedLanguage",
	[actionTypes.SET_SAMPLE_TEXT]: "sampleText",
	[actionTypes.SET_RATE_FOR_SELECTED_VOICE]: "rateForSelectedVoice",
	[actionTypes.SET_PITCH_FOR_SELECTED_VOICE]: "pitchForSelectedVoice",
};

export default createAssignmentActionMapReducer(initialState, customActionsMap, assignActionsMap);
