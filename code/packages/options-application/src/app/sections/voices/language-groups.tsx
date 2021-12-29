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
	LanguageGroupWithNavigatorLanguage,
} from "@talkie/shared-application-helpers/transform-voices.mjs";
import * as buttonBase from "@talkie/shared-ui/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import React from "react";

interface LanguageGroupsProps {
	languageGroupsWithNavigatorLanguages: Readonly<LanguageGroupWithNavigatorLanguage[]>;
	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	onSelectLanguageGroupClick: (languageGroup: string | null, event: React.MouseEvent) => false;
}

class LanguageGroups<P extends LanguageGroupsProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			languageGroupsWithNavigatorLanguages,
			onSelectLanguageGroupClick,
		} = this.props as LanguageGroupsProps;

		return (
			<layoutBase.columnsUl6>
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
									? layoutBase.columnsLiMarked
									: layoutBase.columnsLi;

								return (
									<ListItemType
										key={languageGroup}
										// eslint-disable-next-line react/jsx-no-bind
										onClick={onSelectLanguageGroupClick.bind(null, languageGroup)}
									>
										<buttonBase.transparentButton
											type="button"
										>
											{languageGroup}
										</buttonBase.transparentButton>
									</ListItemType>
								);
							},
						)
				}
			</layoutBase.columnsUl6>
		);
	}
}

export default LanguageGroups;
