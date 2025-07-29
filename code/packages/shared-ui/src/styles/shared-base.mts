/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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
	Globals,
	Property,
} from "csstype";
import type {
	StyleObject,
} from "styletron-react";

// eslint-disable-next-line @stylistic/comma-dangle
export const margins: <TLength extends (Globals | "auto" | (string & {}) | 0)>(margin: TLength) => StyleObject = <TLength,>(length: TLength) => ({
	marginBottom: length as Property.MarginBottom<TLength>,
	marginLeft: length as Property.MarginLeft<TLength>,
	marginRight: length as Property.MarginRight<TLength>,
	marginTop: length as Property.MarginTop<TLength>,
});

// eslint-disable-next-line @stylistic/comma-dangle
export const paddings: <TLength extends (Globals | "auto" | (string & {}) | 0)>(padding: TLength) => StyleObject = <TLength,>(length: TLength) => ({
	paddingBottom: length as Property.PaddingBottom<TLength>,
	paddingLeft: length as Property.PaddingLeft<TLength>,
	paddingRight: length as Property.PaddingRight<TLength>,
	paddingTop: length as Property.PaddingTop<TLength>,
});

export const layoutWithNoMargin: StyleObject = margins(0);

export const layoutWithEmMargin: (baseSizeEm: number) => StyleObject = (baseSizeEm) => ({
	marginBottom: `${baseSizeEm / 2}em`,
	marginLeft: `${baseSizeEm}em`,
	marginRight: `${baseSizeEm}em`,
	marginTop: `${baseSizeEm / 2}em`,
});

export const layoutWithNoPadding: StyleObject = paddings(0);

export const layoutWithEmPadding: (baseSizeEm: number) => StyleObject = (baseSizeEm: number) => paddings(`${baseSizeEm}em`);

// TODO: make more generic using generic css types, like margins/paddings.
export const rounded: (radius: string) => StyleObject = (radius) => ({
	borderBottomLeftRadius: radius,
	borderBottomRightRadius: radius,
	borderTopLeftRadius: radius,
	borderTopRightRadius: radius,
});

export const areaWithBackgroundColor: (baseSizeEm: number) => StyleObject = (baseSizeEm) => ({
	...rounded("0.5em"),
	...layoutWithEmMargin(baseSizeEm * 2),
	...layoutWithEmPadding(baseSizeEm),
	// TODO: pseudo-child-selectors when styletron supports it.
	// " :first-child": {
	//   marginTop: 0,
	// },
	// " :last-child": {
	//   marginBottom: 0,
	// },
	// " :only-child": {
	//   marginBottom: 0,
	//   marginTop: 0,
	// },
});
