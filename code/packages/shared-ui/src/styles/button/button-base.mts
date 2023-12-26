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
import {
	rounded,
} from "../shared-base.mjs";

export const hover: StyleObject = {
	border: "none",
	color: colorBase.buttonTextColor,
};

export const focus: StyleObject = {
	backgroundImage: `linear-gradient(to bottom, ${colorBase.buttonDarkColor}, ${colorBase.buttonDarkColor})`,
	border: "none",
	color: colorBase.buttonTextColor,
};

export const button: StyleObject = {
	...rounded("0.3em"),
	":focus": focus,
	":hover": hover,
	backgroundImage: `linear-gradient(to bottom, ${colorBase.buttonLightColor}, ${colorBase.buttonDarkColor})`,
	border: "none",
	color: colorBase.buttonTextColor,
	paddingBottom: "0.3em",
	paddingLeft: "0.75em",
	paddingRight: "0.75em",
	paddingTop: "0.3em",
	textAlign: "center",
	textDecoration: "none",
};

export const transparentButton: StyleObject = {
	":focus": {
		outline: "revert",
	},
	":hover": {
		cursor: "pointer",
	},
	all: "unset",
};

export const transparentButtonDisabled: StyleObject = {
	...transparentButton,
	":hover": {
		cursor: "not-allowed",
	},
};

export const a: StyleObject = button;
