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
import React, {
	ChangeEvent,
} from "react";
import {
	styled,
} from "styletron-react";

export interface CheckboxProps {
	id?: string;
	checked: boolean;
	disabled: boolean;
	onChange: (checked: boolean) => void;
}

class Checkbox<P extends CheckboxProps & ClassNameProp> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleOnChange = this.handleOnChange.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOnChange(event: Readonly<ChangeEvent<HTMLInputElement>>): void {
		this.props.onChange(event.target.checked);
	}

	override render(): React.ReactNode {
		const {
			checked,
			className,
			disabled,
			id,
		} = this.props;

		return (
			<input
				checked={checked}
				className={className}
				disabled={disabled}
				id={id}
				type="checkbox"
				onChange={this.handleOnChange}
			/>
		);
	}
}

export default styled(Checkbox, formBase.checkbox);
