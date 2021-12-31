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

const sharedList: StyleObject = {
	marginBottom: "0.25em",
	marginTop: "0.25em",
	paddingLeft: "2em",
};

export const ul: StyleObject = sharedList;
export const ol: StyleObject = sharedList;
export const dl: StyleObject = sharedList;

export const li: StyleObject = {
	marginBottom: "0.25em",
};

export const dt: StyleObject = {
	fontWeight: "bold",
	marginTop: "1em",
};
export const dd: StyleObject = {
	marginBottom: "0.5em",
};

const sharedInlineList: StyleObject = {
	// https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#accessibility_concerns
	listStyleType: "'\\200B'",
	marginBottom: "0.25em",
	marginTop: "0.25em",
	paddingBottom: 0,
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
};

export const inlineUl: StyleObject = sharedInlineList;
export const inlineOl: StyleObject = sharedInlineList;

export const inlineLi: StyleObject = {
	display: "inline-block",
	// https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#accessibility_concerns
	listStyleType: "'\\200B'",
	marginBottom: "0.25em",
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	paddingBottom: 0,
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
};
