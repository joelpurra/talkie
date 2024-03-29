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
	styled,
} from "styletron-react";

import * as listBase from "../../styles/list/list-base.mjs";

export const ul = styled("ul", listBase.ul);
export const ol = styled("ol", listBase.ol);
export const li = styled("li", listBase.li);
export const dl = styled("dl", listBase.dl);
export const dt = styled("dt", listBase.dt);
export const dd = styled("dd", listBase.dd);
export const inlineUl = styled("ul", listBase.inlineUl);
export const inlineOl = styled("ol", listBase.inlineOl);
export const inlineLi = styled("li", listBase.inlineLi);
