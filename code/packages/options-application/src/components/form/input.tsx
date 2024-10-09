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

import {
	talkieStyled,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import {
	type ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import * as formBase from "@talkie/shared-ui/styles/form/form-base.mjs";
import React, {
	type ChangeEvent,
} from "react";

export interface InputProps {
	// NOTE: <input> tags are complex; allowing custom properties/attributes.
	[key: string]: unknown;
	disabled: boolean;
	id?: string;
	onChange: (value: string) => void;
	// TODO: more types, dynamically collected.
	type: string;
	value: string;
}

class Input<P extends InputProps & ClassNameProp> extends React.PureComponent<P> {
	inputRef: React.RefObject<HTMLInputElement>;

	constructor(props: P) {
		super(props);

		this.inputRef = React.createRef();
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOnChange({
		target,
	}: Readonly<ChangeEvent<HTMLInputElement>>): void {
		// TODO: is this ref needed?
		if (this.inputRef.current) {
			this.props.onChange(target.value);
		}
	}

	override render(): React.ReactNode {
		const {
			className,
			disabled,
			id,
			// NOTE: extracting onChange so it won't accidentally overwrite via ...other below.
			onChange,
			type,
			value,
			...other
		} = this.props as P;

		return (
			<input
				{...other}
				ref={this.inputRef}
				className={className}
				disabled={disabled}
				id={id}
				type={type}
				value={value}
				onChange={this.handleOnChange}
			/>
		);
	}
}

export default talkieStyled(Input, formBase.checkbox);
