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
	type ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

import EditionSection, {
	type EditionSectionMode,
} from "./edition-section.js";

export interface FreeSectionProps {
	headingLink?: boolean;
	mode: EditionSectionMode;
}

export default class FreeSection<P extends FreeSectionProps & ChildrenRequiredProps & ClassNameProp> extends React.PureComponent<P> {
	static defaultProps = {
		headingLink: true,
	};

	override render(): React.ReactNode {
		const {
			className,
			headingLink,
			mode,
		} = this.props;

		const isPremiumEdition = false;

		return (
			<EditionSection
				className={className}
				headingLink={headingLink}
				isPremiumEdition={isPremiumEdition}
				mode={mode}
			>
				{this.props.children}
			</EditionSection>
		);
	}
}
