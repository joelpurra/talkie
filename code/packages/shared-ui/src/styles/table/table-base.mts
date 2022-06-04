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

import type {
	StyleObject,
} from "styletron-react";

export const cellPadding = {
	paddingBottom: "0.5em",
	paddingLeft: "0.5em",
	paddingRight: "0.5em",
	paddingTop: "0.5em",
};

export const commpactTable: StyleObject = {};
export const wideTable: StyleObject = {
	width: "100%",
};

export const tbody: StyleObject = {};
export const thead: StyleObject = {};
export const tfoot: StyleObject = {};
export const tr: StyleObject = {};

export const th: StyleObject = {
	...cellPadding,
	textAlign: "center",
};

export const td: StyleObject = {
	...cellPadding,
};