/*
This file is part of Talkie -- button-to-speech browser extension button.
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

import {
	talkieStyled,
} from "../../styled/talkie-styled.mjs";
import * as formBase from "../../styles/form/form-base.mjs";
import {
	type TalkieStyletronComponent,
} from "../types.js";

export const form: TalkieStyletronComponent<React.ElementType<"form">> = talkieStyled("form", formBase.form);
export const button: TalkieStyletronComponent<React.ElementType<"button">> = talkieStyled("button", formBase.button);
// export const checkbox: TalkieStyletronComponent<React.ElementType<"input">> = talkieStyled("input", formBase.checkbox);
export const range: TalkieStyletronComponent<React.ElementType<"input">> = talkieStyled("input", formBase.range);
export const textarea: TalkieStyletronComponent<React.ElementType<"textarea">> = talkieStyled("textarea", formBase.textarea);
export const select: TalkieStyletronComponent<React.ElementType<"select">> = talkieStyled("select", formBase.select);
export const option: TalkieStyletronComponent<React.ElementType<"option">> = talkieStyled("option", formBase.option);
export const multilineSelect: TalkieStyletronComponent<React.ElementType<"select">> = talkieStyled("select", formBase.multilineSelect);
