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

import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as listBase from "@talkie/shared-ui/styled/list/list-base.js";
import * as colorBase from "@talkie/shared-ui/styles/color/color-base.mjs";
import {
	SafeVoiceObject,
} from "@talkie/shared-interfaces/ivoices.mjs";
import React, { ComponentProps } from "react";
import { StyletronComponent, withStyleDeep } from "styletron-react";

interface DialectVoicesProps {
	voices: Readonly<SafeVoiceObject[]>;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectVoiceNameClick: (voiceName: string | null, event: React.MouseEvent) => false;
}

class DialectVoices<P extends DialectVoicesProps> extends React.PureComponent<P> {
	private readonly styled: {
		isNavigatorLanguageLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
		dialectLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
		dialectsUl: StyletronComponent<ComponentProps<typeof listBase.ul>>;
	};

	constructor(props: P) {
		super(props);

		const partialStyled = {
			dialectLi: withStyleDeep(
				listBase.li,
				{
					// TODO: copy-pasted; make column lists reusable.
					"::marker": {
						// NOTE: uses the same bullet, but transparent, to ensure horizontal size is the same.
						color: "transparent",
					},
					cursor: "pointer",
					listStylePosition: "inside",
					listStyleType: "'\\2605\\0020'",
					overflow: "hidden",
					textOverflow: "clip",
					whiteSpace: "nowrap",
				},
			),
			dialectsUl: withStyleDeep(
				listBase.ul,
				{
					// TODO: copy-pasted; make column lists reusable.
					columnCount: 3,
					columnRuleColor: colorBase.dividerColor,
					columnRuleStyle: "solid",
					columnRuleWidth: "thin",
					fontWeight: "bold",
				},
			),
		};

		this.styled = {
			...partialStyled,
			isNavigatorLanguageLi: withStyleDeep(
				partialStyled.dialectLi,
				{
					// TODO: copy-pasted; make column lists reusable.
					"::marker": {
						color: colorBase.textColor,
					},
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			voices,
			onSelectVoiceNameClick,
		} = this.props as DialectVoicesProps;

		return (
			<this.styled.dialectsUl>
				{
					voices
						.map(
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
							(voice) => {
								return (
									<this.styled.dialectLi
										key={voice.name}
										// eslint-disable-next-line react/jsx-no-bind
										onClick={onSelectVoiceNameClick.bind(null, voice.name)}
									>
										<buttonBase.transparentButton>
											{voice.name}
										</buttonBase.transparentButton>
									</this.styled.dialectLi>
								);
							},
						)
				}
			</this.styled.dialectsUl>
		);
	}
}

export default DialectVoices;
