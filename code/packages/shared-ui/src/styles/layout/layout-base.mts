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

import * as colorBase from "../color/color-base.mjs";
import * as listBase from "../list/list-base.mjs";
import {
	areaWithBackgroundColor,
	layoutWithEmMargin,
	layoutWithNoPadding,
	margins,
	paddings,
	rounded,
} from "../shared-base.mjs";

export const header: StyleObject = layoutWithEmMargin(1);
export const main: StyleObject = layoutWithEmMargin(1);
export const section: StyleObject = layoutWithEmMargin(1);
export const nav: StyleObject = layoutWithEmMargin(1);
export const footer: StyleObject = layoutWithEmMargin(1);

export const hr: StyleObject = {
	...layoutWithEmMargin,
};

export const details: StyleObject = {};
export const summary: StyleObject = {
	cursor: "pointer",
};

export const hero: StyleObject = {
	...areaWithBackgroundColor(1),
	backgroundColor: colorBase.legibleBackgroundColor,
	fontSize: "1.5em",
};

export const roundedWithBorder: (radius: string) => StyleObject = (radius) => ({
	...rounded(radius),
	borderColor: colorBase.borderColor,
	borderStyle: "solid",
	borderWidth: "1px",
});

export const horizontalUl: StyleObject = {
	...listBase.ul,
	listStyleType: "none",
	...layoutWithNoPadding,
};

export const horizontalLi: StyleObject = {
	...listBase.li,
	...margins("0.25em"),
	...paddings("0.25em"),
	display: "inline-block",
	lineHeight: "1em",
	whiteSpace: "nowrap",
};

export const columnsUl: (columnCount: number) => StyleObject = (columnCount) => ({
	...listBase.ul,
	columnCount,
	columnRuleStyle: "solid",
	columnRuleWidth: "thin",
	fontWeight: "bold",
});

export const columnsLi: StyleObject = {
	...listBase.li,
	"::marker": {
		// NOTE: uses the same bullet as the marked version, but transparent, to ensure horizontal size is the same.
		color: "transparent",
	},
	cursor: "pointer",
	listStylePosition: "inside",
	listStyleType: "'\\2605\\0020'",
	overflow: "hidden",
	textOverflow: "clip",
	whiteSpace: "nowrap",
};

export const columnsLiMarked: StyleObject = {
	...columnsLi,
	"::marker": {
		color: "unset",
	},
};
