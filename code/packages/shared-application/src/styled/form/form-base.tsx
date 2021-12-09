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

import * as formBase from "../../styles/form/form-base.mjs";

export const form = styled("form", formBase.form);
export const button = styled("button", formBase.button);
// export const checkbox = styled("input", formBase.checkbox);
export const range = styled("input", formBase.range);
export const textarea = styled("textarea", formBase.textarea);
export const select = styled("select", formBase.select);
export const option = styled("option", formBase.option);
export const multilineSelect = styled("select", formBase.multilineSelect);
