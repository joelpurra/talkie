/*
This file is part of Talkie -- button-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
import * as buttonBase from "../../styles/button/button-base.mjs";
import {
	type TalkieStyletronComponent,
} from "../types.js";

export const button: TalkieStyletronComponent<React.ElementType<"button">> = talkieStyled("button");
export const transparentButton: TalkieStyletronComponent<React.ElementType<"button">> = talkieStyled("button", buttonBase.transparentButton);
export const transparentButtonDisabled: TalkieStyletronComponent<React.ElementType<"button">> = talkieStyled("button", buttonBase.transparentButtonDisabled);
export const a: TalkieStyletronComponent<React.ElementType<"a">> = talkieStyled("a", buttonBase.a);
