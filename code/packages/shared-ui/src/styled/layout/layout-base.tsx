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
import * as layoutBase from "../../styles/layout/layout-base.mjs";
import {
	type TalkieStyletronComponent,
} from "../types.js";

export const header: TalkieStyletronComponent<React.ElementType<"header">> = talkieStyled("header", layoutBase.header);
export const main: TalkieStyletronComponent<React.ElementType<"main">> = talkieStyled("main", layoutBase.main);
export const section: TalkieStyletronComponent<React.ElementType<"section">> = talkieStyled("section", layoutBase.section);
export const nav: TalkieStyletronComponent<React.ElementType<"nav">> = talkieStyled("nav", layoutBase.nav);
export const footer: TalkieStyletronComponent<React.ElementType<"footer">> = talkieStyled("footer", layoutBase.footer);
export const hr: TalkieStyletronComponent<React.ElementType<"hr">> = talkieStyled("hr", layoutBase.hr);
export const details: TalkieStyletronComponent<React.ElementType<"details">> = talkieStyled("details", layoutBase.details);
export const summary: TalkieStyletronComponent<React.ElementType<"summary">> = talkieStyled("summary", layoutBase.summary);

export const hero: TalkieStyletronComponent<React.ElementType<"div">> = talkieStyled("div", layoutBase.hero);

export const horizontalUl: TalkieStyletronComponent<React.ElementType<"ul">> = talkieStyled("ul", layoutBase.horizontalUl);
export const horizontalLi: TalkieStyletronComponent<React.ElementType<"li">> = talkieStyled("li", layoutBase.horizontalLi);

// TODO: convert constant "variables" to component properties?
export const columnsUl3: TalkieStyletronComponent<React.ElementType<"ul">> = talkieStyled("ul", layoutBase.columnsUl(3));
export const columnsUl6: TalkieStyletronComponent<React.ElementType<"ul">> = talkieStyled("ul", layoutBase.columnsUl(6));
export const columnsLi: TalkieStyletronComponent<React.ElementType<"li">> = talkieStyled("li", layoutBase.columnsLi);
export const columnsLiMarked: TalkieStyletronComponent<React.ElementType<"li">> = talkieStyled("li", layoutBase.columnsLiMarked);
