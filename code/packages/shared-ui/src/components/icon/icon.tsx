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

import React from "react";
import type {
	StyleObject,
} from "styletron-react";
import {
	styled,
} from "styletron-react";

import {
	ClassNameProp,
} from "../../styled/types.js";

export declare type IconMode =
	| "inline"
	| "standalone";

export interface IconProps {
	marginLeft?: string;
	marginRight?: string;
	mode: IconMode;
	size?: string;
}

export default class Icon<P extends IconProps & ClassNameProp> extends React.PureComponent<P> {
	override render(): React.ReactNode {
		const {
			mode,
			size,
			marginLeft,
			marginRight,
			className,
		} = this.props;

		const iconStyle: StyleObject = {
			":before": {
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundSize: "contain",
				content: "''",
				display: "inline-block",
				height: size,
				marginLeft,
				marginRight,
				width: size,
			},
		};

		if (mode === "inline") {
			(iconStyle[":before"] as StyleObject).verticalAlign = "sub";
		}

		const StyledIcon = styled("span", iconStyle);

		// TODO: fully replace with css-in-js?
		// TODO: use a separate component per mode?
		return (
			<StyledIcon
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				className={`icon icon-${mode} icon-${size} ${className}`}
			/>
		);
	}

	static defaultProps = {
		// TODO: break out default css values to styles?
		marginLeft: "0.3em",
		marginRight: "0.3em",
		size: "1.3em",
	};
}
