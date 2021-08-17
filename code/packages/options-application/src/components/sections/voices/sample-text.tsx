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

import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as formBase from "@talkie/shared-application/styled/form/form-base";
import * as tableBase from "@talkie/shared-application/styled/table/table-base";
import React from "react";

export interface SampleTextProps {
	disabled: boolean;
	onChange: (value: string) => void;
	value?: string | null;
}

class SampleText<P extends SampleTextProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		value: null,
	};

	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleChange(event: Readonly<React.ChangeEvent<HTMLTextAreaElement>>): void {
		const value = event.target.value;

		this.props.onChange(value);
	}

	override render(): React.ReactNode {
		const {
			disabled,
			translateSync,
			value,
		} = this.props;

		return (
			<tableBase.tbody>
				<tableBase.tr>
					<tableBase.th scope="col">
						{translateSync("frontend_voicesSampleTextHeading")}
					</tableBase.th>
				</tableBase.tr>
				<tableBase.tr>
					<tableBase.td>
						<formBase.textarea
							disabled={disabled}
							id="voices-sample-text"
							rows={2}
							value={value ?? undefined}
							onChange={this.handleChange}
						/>
					</tableBase.td>
				</tableBase.tr>
			</tableBase.tbody>
		);
	}
}

export default translateAttribute<SampleTextProps & TranslateProps>()(
	SampleText,
);
