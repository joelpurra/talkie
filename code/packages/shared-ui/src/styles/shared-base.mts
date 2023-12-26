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

export const layoutWithNoMargin: StyleObject = {
	marginBottom: 0,
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
};

export const layoutWithEmMargin: (baseSizeEm: number) => StyleObject = (baseSizeEm) => ({
	marginBottom: `${baseSizeEm / 2}em`,
	marginLeft: `${baseSizeEm}em`,
	marginRight: `${baseSizeEm}em`,
	marginTop: `${baseSizeEm / 2}em`,
});

export const layoutWithNoPadding: StyleObject = {
	paddingBottom: 0,
	paddingLeft: 0,
	paddingRight: 0,
	paddingTop: 0,
};

export const layoutWithEmPadding: (baseSizeEm: number) => StyleObject = (baseSizeEm) => ({
	paddingBottom: `${baseSizeEm}em`,
	paddingLeft: `${baseSizeEm}em`,
	paddingRight: `${baseSizeEm}em`,
	paddingTop: `${baseSizeEm}em`,
});

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
