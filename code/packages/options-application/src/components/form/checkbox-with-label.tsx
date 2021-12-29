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
	ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import * as formBase from "@talkie/shared-ui/styles/form/form-base.mjs";
import * as layoutBase from "@talkie/shared-ui/styles/layout/layout-base.mjs";
import {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
} from "styletron-react";

import Checkbox from "./checkbox.js";

export interface CheckboxWithLabelProps {
	checked: boolean;
	disabled: boolean;
	id?: string;
	onChange: (checked: boolean) => void;
}

class CheckboxWithLabel<P extends CheckboxWithLabelProps & ClassNameProp & ChildrenRequiredProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.styled = {
			labelForCheckbox: styled(
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
			checked,
			className,
			disabled,
			id,
			children,
			onChange,
		} = this.props;

		return (
			<this.styled.labelForCheckbox>
				<Checkbox
					checked={checked}
					className={className}
					disabled={disabled}
					id={id}
					onChange={onChange}
				/>
				{" "}
				{children}
			</this.styled.labelForCheckbox>
		);
	}

	private readonly styled: {
		labelForCheckbox: StyletronComponent<ComponentProps<"label">>;
	};
}

export default styled(CheckboxWithLabel, formBase.checkbox);
