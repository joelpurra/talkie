/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React from "react";

import CheckboxWithLabel from "../../../components/form/checkbox-with-label.js";

export interface ContinueOnTabRemovedProps {
	disabled: boolean;
	onChange: (continueOnTabRemoved: boolean) => void;
	continueOnTabRemoved: boolean;
}

class ContinueOnTabRemoved<P extends ContinueOnTabRemovedProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(continueOnTabRemoved: boolean): void {
		this.props.onChange(continueOnTabRemoved);
	}

	override render(): React.ReactNode {
		const {
			continueOnTabRemoved,
			disabled,
			translateSync,
		} = this.props as P;

		return (
			<>
				<textBase.h3>
					{translateSync("frontend_voicesContinueOnTabRemovedHeading")}
				</textBase.h3>
				<p>
					{translateSync("frontend_voicesContinueOnTabRemovedExplanation01")}
				</p>
				<p>
					{/* TODO: consider two radio buttons for continue or stop. */}
					<CheckboxWithLabel
						checked={continueOnTabRemoved}
						disabled={disabled}
						onChange={this.handleChange}
					>
						{translateSync("frontend_voicesContinueOnTabRemovedLabel")}
					</CheckboxWithLabel>
				</p>
			</>
		);
	}
}

export default translateAttribute<ContinueOnTabRemovedProps & TranslateProps>()(
	ContinueOnTabRemoved,
);
