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
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import React from "react";

interface DialectVoicesProps {
	voices: Readonly<SafeVoiceObject[]>;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectVoiceNameClick: (voiceName: string | null, event: React.MouseEvent) => false;
}

class DialectVoices<P extends DialectVoicesProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			voices,
			onSelectVoiceNameClick,
		} = this.props as DialectVoicesProps;

		return (
			<layoutBase.columnsUl3>
				{
					voices
						.map(
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
							(voice) => (
								<layoutBase.columnsLi
									key={voice.name}
									// eslint-disable-next-line react/jsx-no-bind
									onClick={onSelectVoiceNameClick.bind(null, voice.name)}
								>
									<buttonBase.transparentButton>
										{voice.name}
									</buttonBase.transparentButton>
								</layoutBase.columnsLi>
							),
						)
				}
			</layoutBase.columnsUl3>
		);
	}
}

export default DialectVoices;
