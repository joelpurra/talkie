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

import * as buttonBase from "@talkie/shared-application/styled/button/button-base";
import * as listBase from "@talkie/shared-application/styled/list/list-base";
import * as colorBase from "@talkie/shared-application/styles/color/color-base";
import {
	LanguageGroupWithNavigatorLanguage,
} from "@talkie/shared-application-helpers/transform-voices";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

interface LanguageGroupsProps {
	languageGroupsWithNavigatorLanguages: Readonly<LanguageGroupWithNavigatorLanguage[]>;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectLanguageGroupClick: (languageGroup: string | null, event: React.MouseEvent) => false;
}

class LanguageGroups<P extends LanguageGroupsProps> extends React.PureComponent<P> {
	private readonly styled: {
		isNavigatorLanguageLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
		languageGroupLi: StyletronComponent<ComponentProps<typeof listBase.li>>;
		languageGroupsUl: StyletronComponent<ComponentProps<typeof listBase.ul>>;
	};

	constructor(props: P) {
		super(props);

		const partialStyled = {
			languageGroupLi: withStyleDeep(
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
			languageGroupsUl: withStyleDeep(
				listBase.ul,
				{
					// TODO: copy-pasted; make column lists reusable.
					columnCount: 6,
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
				partialStyled.languageGroupLi,
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
			languageGroupsWithNavigatorLanguages,
			onSelectLanguageGroupClick,
		} = this.props as LanguageGroupsProps;

		return (
			<this.styled.languageGroupsUl>
				{
					languageGroupsWithNavigatorLanguages
						.map(
							// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
							(languageGroupWithNavigatorLanguage) => {
								const {
									isNavigatorLanguage,
									languageGroup,
								} = languageGroupWithNavigatorLanguage;

								const ListItemType = isNavigatorLanguage
									? this.styled.isNavigatorLanguageLi
									: this.styled.languageGroupLi;

								return (
									<ListItemType
										key={languageGroup}
										// eslint-disable-next-line react/jsx-no-bind
										onClick={onSelectLanguageGroupClick.bind(null, languageGroup)}
									>
										<buttonBase.transparentButton>
											{languageGroup}
										</buttonBase.transparentButton>
									</ListItemType>
								);
							},
						)
				}
			</this.styled.languageGroupsUl>
		);
	}
}

export default LanguageGroups;
