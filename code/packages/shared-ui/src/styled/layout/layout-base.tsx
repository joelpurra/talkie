/*
This file is part of Talkie -- button-to-speech browser extension button.
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
	TalkieStyletronComponent,
} from "../types.js";
import {
	styled,
} from "styletron-react";

import * as layoutBase from "../../styles/layout/layout-base.mjs";

export const header: TalkieStyletronComponent<React.ElementType<"header">> = styled("header", layoutBase.header);
export const main: TalkieStyletronComponent<React.ElementType<"main">> = styled("main", layoutBase.main);
export const section: TalkieStyletronComponent<React.ElementType<"section">> = styled("section", layoutBase.section);
export const nav: TalkieStyletronComponent<React.ElementType<"nav">> = styled("nav", layoutBase.nav);
export const footer: TalkieStyletronComponent<React.ElementType<"footer">> = styled("footer", layoutBase.footer);
export const hr: TalkieStyletronComponent<React.ElementType<"hr">> = styled("hr", layoutBase.hr);
export const details: TalkieStyletronComponent<React.ElementType<"details">> = styled("details", layoutBase.details);
export const summary: TalkieStyletronComponent<React.ElementType<"summary">> = styled("summary", layoutBase.summary);

export const hero: TalkieStyletronComponent<React.ElementType<"div">> = styled("div", layoutBase.hero);

// TODO: convert constant "variables" to component properties?
export const columnsUl3: TalkieStyletronComponent<React.ElementType<"ul">> = styled("ul", layoutBase.columnsUl(3));
export const columnsUl6: TalkieStyletronComponent<React.ElementType<"ul">> = styled("ul", layoutBase.columnsUl(6));
export const columnsLi: TalkieStyletronComponent<React.ElementType<"li">> = styled("li", layoutBase.columnsLi);
export const columnsLiMarked: TalkieStyletronComponent<React.ElementType<"li">> = styled("li", layoutBase.columnsLiMarked);
