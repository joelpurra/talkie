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
	type ClassNameProp,
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import * as formBase from "@talkie/shared-ui/styles/form/form-base.mjs";
import * as layoutBase from "@talkie/shared-ui/styles/layout/layout-base.mjs";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";
import {
	styled,
} from "styletron-react";

import Input from "./input.js";

export interface InputWithLabelProps {
	// NOTE: <input> tags are complex; allowing custom properties/attributes.
	[key: string]: unknown;
	disabled: boolean;
	id?: string;
	onChange: (value: string) => void;
	// TODO: more types, dynamically collected.
	type: string;
	value: string;
}

class InputWithLabel<P extends InputWithLabelProps & ClassNameProp & ChildrenRequiredProps> extends React.PureComponent<P> {
	private readonly styled: {
		labelForInput: TalkieStyletronComponent<"label">;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			labelForInput: styled(
				"label",
				{
					...layoutBase.roundedWithBorder("0.5em"),
					display: "inline-block",
					paddingBottom: "1em",
					paddingLeft: "1em",
					paddingRight: "1em",
					paddingTop: "1em",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			children,
			className,
			disabled,
			id,
			onChange,
			type,
			value,
			...other
		} = this.props;

		return (
			<this.styled.labelForInput>
				{/* TODO: pass extra CSS className property styling to the inner element. */}
				<Input
					{...other}
					className={className}
					disabled={disabled}
					id={id}
					type={type}
					value={value}
					onChange={onChange}
				/>
				{/* TODO: padding instead of a literal space. */}
				{" "}
				{children}
			</this.styled.labelForInput>
		);
	}
}

export default styled(InputWithLabel, formBase.input);
