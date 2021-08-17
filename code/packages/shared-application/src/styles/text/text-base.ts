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
	StyleObject,
} from "styletron-react";

export const textColor = "#000000";

export const text: StyleObject = {
	color: textColor,
};

export const linkHighlightColor = "#3497ff";

export const highlight: StyleObject = {
	color: linkHighlightColor,
};

export const a: StyleObject = {
	":active": highlight,
	":focus": highlight,
	":hover": highlight,
	color: textColor,
};

export const h1: StyleObject = {};
export const h2: StyleObject = {};
export const h3: StyleObject = {};
export const h4: StyleObject = {};
export const h5: StyleObject = {};

export const kbd: StyleObject = {
	backgroundColor: "#fcfcfc",
	borderBottomColor: "#bbb",
	borderBottomWidth: "1px",
	borderLeftColor: "#ccc",
	borderLeftWidth: "1px",
	borderRadius: "0.3em",
	borderRightColor: "#ccc",
	borderRightWidth: "1px",
	borderStyle: "solid",
	borderTopColor: "#ccc",
	borderTopWidth: "1px",
	boxShadow: "inset 0 -1px 0 #bbb",
	color: "#555",
	display: "inline-block",
	fontFamily: "Helvetica, Verdana, sans-serif",
	paddingBottom: "0.1em",
	paddingLeft: "0.3em",
	paddingRight: "0.3em",
	paddingTop: "0.1em",
	verticalAlign: "middle",
};

export const blockquote: StyleObject = {
	background: "#fafafa",
	borderLeft: "0.5em solid #cccccc",
	marginBottom: "1em",
	marginLeft: "0.5em",
	marginTop: "1em",
	paddingBottom: "0.5em",
	paddingLeft: "0.5em",
	paddingRight: "0.5em",
	paddingTop: "0.5em",
};
