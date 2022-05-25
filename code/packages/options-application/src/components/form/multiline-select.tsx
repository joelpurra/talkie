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
import {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import {
	scrollIntoViewIfNeeded,
} from "@talkie/shared-ui/utils/select-element.mjs";
import React, {
	ChangeEvent,
} from "react";
import {
	styled,
} from "styletron-react";
import type {
	ReadonlyDeep,
} from "type-fest";

export interface MultilineSelectProps {
	disabled: boolean;
	onChange: (value: string) => void;
	size: number;
	value?: string | null;
}

class MultilineSelect<P extends MultilineSelectProps & ClassNameProp & ChildrenRequiredProps> extends React.PureComponent<P, unknown> {
	static defaultProps = {
		value: null,
	};

	selectRef: React.RefObject<HTMLSelectElement>;
	constructor(props: P) {
		super(props);

		this.selectRef = React.createRef();
		this.handleOnChange = this.handleOnChange.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOnChange({
		target,
	}: ChangeEvent<HTMLSelectElement>): void {
		if (this.selectRef.current) {
			this.props.onChange(target.value);

			scrollIntoViewIfNeeded(this.selectRef.current as ReadonlyDeep<HTMLSelectElement>);
		}
	}

	override componentDidMount(): void {
		if (this.selectRef.current) {
			scrollIntoViewIfNeeded(this.selectRef.current as ReadonlyDeep<HTMLSelectElement>);
		}
	}

	override render(): React.ReactNode {
		const {
			size,
			value,
			disabled,
			className,
		} = this.props;

		return (
			<select
				ref={this.selectRef}
				className={className}
				disabled={disabled}
				size={size}
				value={value ?? ""}
				onChange={this.handleOnChange}
			>
				{this.props.children}
			</select>
		);
	}
}

export default styled(MultilineSelect, formBase.multilineSelect);
