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

export interface ToggleDefaultProps {
	disabled: boolean;
	languageCode?: string | null;
	onClick: () => void;
	voiceName?: string | null;
}

class ToggleDefault<P extends ToggleDefaultProps & TranslateProps> extends React.PureComponent<P> {
	static defaultProps = {
		languageCode: null,
		voiceName: null,
	};

	constructor(props: P) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(
		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		_event: React.MouseEvent,
	): void {
		this.props.onClick();
	}

	override render(): React.ReactNode {
		const {
			disabled,
			languageCode,
			translateSync,
			voiceName,
		} = this.props;

		let buttonText = null;

		if (typeof languageCode === "string" && typeof voiceName === "string") {
			const messageDetailsPlaceholders: string[] = [
				languageCode,
				voiceName,
			];

			buttonText = translateSync("frontend_voicesSetAsLanguageUseVoiceAsDefault", messageDetailsPlaceholders);
		} else {
			buttonText = translateSync("frontend_voicesSetAsLanguageEmptySelection");
		}

		return (
			<tableBase.tbody>
				<tableBase.tr>
					<tableBase.td>
						<formBase.button
							disabled={disabled}
							onClick={this.handleClick}
						>
							{buttonText}
						</formBase.button>
					</tableBase.td>
				</tableBase.tr>
			</tableBase.tbody>
		);
	}
}

export default translateAttribute<ToggleDefaultProps & TranslateProps>()(
	ToggleDefault,
);
