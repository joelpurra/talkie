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

import * as actionTypes from "../constants/action-types-speaking";

/*eslint no-unused-vars: ["warn", { "args": "after-used" }] */

export const iconClick = () =>
    (dispatch, getState, api) => api.iconClick();

export const setIsSpeaking = (isSpeaking) => {
    return { type: actionTypes.SET_IS_SPEAKING, isSpeaking };
};

export const speakTextInLanguageWithOverrides = (text, languageCode) =>
    (dispatch, getState, api) => api.debouncedSpeakTextInLanguageWithOverrides(text, languageCode);
