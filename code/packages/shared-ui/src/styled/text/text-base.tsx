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
	talkieStyled,
} from "../../styled/talkie-styled.mjs";
import * as textBase from "../../styles/text/text-base.mjs";
import {
	type TalkieStyletronComponent,
} from "../types.js";

export const h1: TalkieStyletronComponent<React.ElementType<"h1">> = talkieStyled("h1", textBase.h1);
export const h2: TalkieStyletronComponent<React.ElementType<"h2">> = talkieStyled("h2", textBase.h2);
export const h3: TalkieStyletronComponent<React.ElementType<"h3">> = talkieStyled("h3", textBase.h3);
export const h4: TalkieStyletronComponent<React.ElementType<"h4">> = talkieStyled("h4", textBase.h4);
export const h5: TalkieStyletronComponent<React.ElementType<"h5">> = talkieStyled("h5", textBase.h5);

export const kbd: TalkieStyletronComponent<React.ElementType<"kbd">> = talkieStyled("kbd", textBase.kbd);
export const blockquote: TalkieStyletronComponent<React.ElementType<"blockquote">> = talkieStyled("blockquote", textBase.blockquote);

export const summaryHeading1: TalkieStyletronComponent<React.ElementType<"h1">> = talkieStyled("h1", textBase.summaryHeading1);
export const summaryHeading2: TalkieStyletronComponent<React.ElementType<"h2">> = talkieStyled("h2", textBase.summaryHeading2);
export const summaryHeading3: TalkieStyletronComponent<React.ElementType<"h3">> = talkieStyled("h3", textBase.summaryHeading3);
export const summaryHeading4: TalkieStyletronComponent<React.ElementType<"h4">> = talkieStyled("h4", textBase.summaryHeading4);
export const summaryHeading5: TalkieStyletronComponent<React.ElementType<"h5">> = talkieStyled("h5", textBase.summaryHeading5);

export const headingActionSpan: TalkieStyletronComponent<React.ElementType<"span">> = talkieStyled("span", textBase.headingActionSpan);
