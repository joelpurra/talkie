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
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as tableBase from "@talkie/shared-ui/styled/table/table-base.js";
import React from "react";

import Checkbox from "../../../../components/form/checkbox.js";
import Markdown from "../../../../components/markdown.js";

export interface ToggleDefaultProps {
	disabled: boolean;
	isDefault: boolean;
	languageCode: string;
	onClick: () => void;
	voiceName: string;
}

interface InternalProps extends ToggleDefaultProps, TranslateProps {}

class ToggleDefault<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			disabled,
			isDefault,
			languageCode,
			translateSync,
			voiceName,
		} = this.props as InternalProps;

		const buttonTextMarkdown = translateSync(
			"frontend_voicesSetAsLanguageUseVoiceAsDefault",
			[
				`**${languageCode}**`,
				`**${voiceName}**`,
			],
		);
		const checkboxId = `toggle-default-voice-checkbox-${languageCode}`;

		// TODO: styling the the disabled label.
		const isCheckboxDisabled = disabled || isDefault;

		return (
			<tableBase.tbody>
				<tableBase.tr>
					<tableBase.td>
						<Checkbox
							checked={isDefault}
							disabled={isCheckboxDisabled}
							id={checkboxId}
							onChange={this.props.onClick}
						/>
					</tableBase.td>
					<tableBase.td>
						<label
							htmlFor={checkboxId}
						>
							<Markdown>
								{buttonTextMarkdown}
							</Markdown>
						</label>
					</tableBase.td>
				</tableBase.tr>
			</tableBase.tbody>
		);
	}
}

export default translateAttribute<InternalProps>()(
	ToggleDefault,
);
