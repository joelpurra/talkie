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
import * as listBase from "../../styles/list/list-base.mjs";
import {
	type TalkieStyletronComponent,
} from "../types.js";

export const ul: TalkieStyletronComponent<React.ElementType<"ul">> = talkieStyled("ul", listBase.ul);
export const ol: TalkieStyletronComponent<React.ElementType<"ol">> = talkieStyled("ol", listBase.ol);
export const li: TalkieStyletronComponent<React.ElementType<"li">> = talkieStyled("li", listBase.li);
export const dl: TalkieStyletronComponent<React.ElementType<"dl">> = talkieStyled("dl", listBase.dl);
export const dt: TalkieStyletronComponent<React.ElementType<"dt">> = talkieStyled("dt", listBase.dt);
export const dd: TalkieStyletronComponent<React.ElementType<"dd">> = talkieStyled("dd", listBase.dd);
export const inlineUl: TalkieStyletronComponent<React.ElementType<"ul">> = talkieStyled("ul", listBase.inlineUl);
export const inlineOl: TalkieStyletronComponent<React.ElementType<"ol">> = talkieStyled("ol", listBase.inlineOl);
export const inlineLi: TalkieStyletronComponent<React.ElementType<"li">> = talkieStyled("li", listBase.inlineLi);
