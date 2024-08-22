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
import {
	paddings,
} from "../shared-base.mjs";

export const transparentButton: StyleObject = {
	":focus": {
		outline: "revert",
	},
	":hover": {
		cursor: "pointer",
	},
	// NOTE: class="a b c" order matters and with styletron's default class order (compile-time rendering order-dependent) the `all: "unset"` "bomb" may affect *all* "previous" (class) settings; need to be more specific to not override other classes.
	//all: "unset",
	...paddings("unset"),
	backgroundColor: "unset",
	border: "unset",
	color: "unset",
	cursor: "default",
	fontSize: "unset",
	textAlign: "left",
};

export const transparentButtonDisabled: StyleObject = {
	...transparentButton,
	":hover": {
		cursor: "not-allowed",
	},
};

export const a: StyleObject = {
	...layoutBase.roundedWithBorder("0.3em"),
	backgroundColor: colorBase.legibleBackgroundColor,
	display: "inline-block",
	paddingBottom: "0.3em",
	paddingLeft: "0.5em",
	paddingRight: "0.5em",
	paddingTop: "0.3em",
};
