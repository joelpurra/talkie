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
	type StyleObject,
} from "styletron-react";

import * as colorBase from "../color/color-base.mjs";
import * as listBase from "../list/list-base.mjs";

const layoutWithMargins: StyleObject = {
	marginBottom: "0.5em",
	marginLeft: "1em",
	marginRight: "1em",
	marginTop: "0.5em",
};

export const header: StyleObject = layoutWithMargins;
export const main: StyleObject = layoutWithMargins;
export const section: StyleObject = layoutWithMargins;
export const nav: StyleObject = layoutWithMargins;
export const footer: StyleObject = layoutWithMargins;

export const hr: StyleObject = {
	...layoutWithMargins,
	borderBottomWidth: 0,
	borderLeftWidth: 0,
	borderRightWidth: 0,
	borderStyle: "solid",
	borderTopWidth: "1px",
	color: colorBase.dividerColor,
};

export const details: StyleObject = {};
export const summary: StyleObject = {
	cursor: "pointer",
};

export const rounded: (radius: string) => StyleObject = (radius) => ({
	borderBottomLeftRadius: radius,
	borderBottomRightRadius: radius,
	borderTopLeftRadius: radius,
	borderTopRightRadius: radius,
});

export const hero: StyleObject = {
	...rounded("0.5em"),
	backgroundColor: colorBase.premiumSectionBackgroundColor,
	fontSize: "1.5em",
	marginBottom: "2em",
	marginLeft: "2em",
	marginRight: "2em",
	marginTop: "2em",
	paddingBottom: "1em",
	paddingLeft: "1em",
	paddingRight: "1em",
	paddingTop: "1em",
};

export const roundedWithBorder: (radius: string) => StyleObject = (radius) => ({
	...rounded(radius),
	borderColor: colorBase.borderColor,
	borderStyle: "solid",
	borderWidth: "1px",
});

export const columnsUl: (columnCount: number) => StyleObject = (columnCount) => ({
	...listBase.ul,
	columnCount,
	columnRuleColor: colorBase.dividerColor,
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
		color: colorBase.textColor,
	},
};
