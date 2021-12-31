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

import React from "react";

import {
	IsSpeakingProps,
} from "../hocs/is-speaking-types.mjs";
import {
	ChildrenRequiredProps,
} from "../types.mjs";

export interface StyleRootProps {
	isPremiumEdition: boolean;
}

export default class StyleRoot<P extends StyleRootProps & IsSpeakingProps & ChildrenRequiredProps> extends React.PureComponent<P> {
	getStateClasses(): string[] {
		const {
			isSpeaking,
			isPremiumEdition,
		} = this.props;

		const stateClasses: string[] = [];

		if (isSpeaking) {
			stateClasses.push("talkie-speaking");
		} else {
			stateClasses.push("talkie-not-speaking");
		}

		if (isPremiumEdition) {
			stateClasses.push("talkie-premium");
		} else {
			stateClasses.push("talkie-free");
		}

		return stateClasses;
	}

	override render(): React.ReactNode {
		const stateClasses = this.getStateClasses();
		const stateClassNames = stateClasses.join(" ");

		return (
			<div
				className={stateClassNames}
			>
				{React.Children.only(this.props.children)}
			</div>
		);
	}
}
