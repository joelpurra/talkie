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
import * as layoutBase from "../layout/layout-base.mjs";

export const text: StyleObject = {
	color: colorBase.textColor,
};

export const lighterText: StyleObject = {
	...text,

	// TODO: disambiguate lighter (text color) and lighter (font weight).
	// TODO: move to (or merge with) the "lighter" file?
	fontWeight: "lighter",
};

export const smallerText: StyleObject = {
	...text,
	fontSize: "smaller",
};

export const highlight: StyleObject = {
	color: colorBase.linkHighlightColor,
};

export const a: StyleObject = {
	":active": highlight,
	":focus": highlight,
	":hover": highlight,
	color: colorBase.textColor,
};

export const heading: StyleObject = {
	marginTop: "2em",
};

export const h1: StyleObject = {
	...heading,
	marginTop: "1em",
};
export const h2: StyleObject = heading;
export const h3: StyleObject = heading;
export const h4: StyleObject = heading;
export const h5: StyleObject = heading;

export const kbd: StyleObject = {
	...layoutBase.rounded("0.3em"),
	backgroundColor: colorBase.borderedBackgroundColor,
	borderBottomColor: colorBase.borderDarkColor,
	borderBottomWidth: "1px",
	borderLeftColor: colorBase.borderColor,
	borderLeftWidth: "1px",
	borderRightColor: colorBase.borderColor,
	borderRightWidth: "1px",
	borderStyle: "solid",
	borderTopColor: colorBase.borderColor,
	borderTopWidth: "1px",
	boxShadow: `inset 0 -1px 0 ${colorBase.borderDarkColor}`,
	color: colorBase.borderedTextColor,
	display: "inline-block",
	fontFamily: "monospace, sans-serif",
	paddingBottom: "0.1em",
	paddingLeft: "0.3em",
	paddingRight: "0.3em",
	paddingTop: "0.1em",
	verticalAlign: "middle",
};

export const blockquote: StyleObject = {
	background: colorBase.blockquoteBackgroundColor,
	borderLeftColor: colorBase.borderColor,
	borderLeftStyle: "solid",
	borderLeftWidth: "0.5em",
	marginBottom: "1em",
	marginLeft: "0.5em",
	marginTop: "1em",
	paddingBottom: "0.5em",
	paddingLeft: "0.5em",
	paddingRight: "0.5em",
	paddingTop: "0.5em",
};

export const summaryHeading: StyleObject = {
	display: "inline-block",
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	paddingBottom: "0.5em",
	paddingLeft: "0.5em",
	paddingRight: "0.5em",
	paddingTop: "0.5em",
};

export const summaryHeading1: StyleObject = {
	...h1,
	...summaryHeading,
};
export const summaryHeading2: StyleObject = {
	...h2,
	...summaryHeading,
};
export const summaryHeading3: StyleObject = {
	...h3,
	...summaryHeading,
};
export const summaryHeading4: StyleObject = {
	...h4,
	...summaryHeading,
};
export const summaryHeading5: StyleObject = {
	...h5,
	...summaryHeading,
};

export const headingActionSpan: StyleObject = {
	...lighterText,
	...smallerText,
	paddingLeft: "1em",
	paddingRight: "1em",
};
