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

export const textColor = "#000000";

export const text = {
	color: textColor,
};

export const linkHighlightColor = "#3497ff";

export const highlight = {
	color: linkHighlightColor,
};

export const a = {
	":active": highlight,
	":focus": highlight,
	":hover": highlight,
	color: textColor,
};

export const h1 = {};
export const h2 = {};
export const h3 = {};
export const h4 = {};
export const h5 = {};

export const kbd = {
	backgroundColor: "#fcfcfc",
	border: "solid 1px #ccc",
	borderBottomColor: "#bbb",
	borderRadius: "0.3em",
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

export const blockquote = {
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
