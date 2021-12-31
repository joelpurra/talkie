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

import * as tableBase from "../../styles/table/table-base.mjs";

export const compactTable = styled("table", tableBase.commpactTable);
export const wideTable = styled("table", tableBase.wideTable);
export const thead = styled("thead", tableBase.thead);
export const tfoot = styled("tfoot", tableBase.tfoot);
export const tbody = styled("tbody", tableBase.tbody);
export const tr = styled("tr", tableBase.tr);
export const th = styled("th", tableBase.th);
export const td = styled("td", tableBase.td);
