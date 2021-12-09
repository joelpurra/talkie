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

import configureAttribute, {
	ConfigureProps,
} from "../../hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "../../hocs/translate.js";
import * as textBase from "../../styled/text/text-base.js";
import {
	ClassNameProp,
} from "../../styled/types.js";
import {
	ChildrenRequiredProps,
} from "../../types.mjs";
import TalkieEditionIcon from "../icon/talkie-edition-icon.js";

export type EditionSectionMode =
	| "p"
	| "h2";

export interface EditionSectionProps extends ChildrenRequiredProps, ClassNameProp {
	isPremiumEdition: boolean;
	mode: EditionSectionMode;
}

interface InternalProps extends EditionSectionProps, ConfigureProps, TranslateProps {}

class EditionSection<P extends InternalProps> extends React.PureComponent<P> {
	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(props: P) {
		super(props);
	}

	override render(): React.ReactNode {
		const {
			mode,
			isPremiumEdition,
			children,
			className,
			translateSync,
			configure,
		} = this.props as InternalProps;

		// TODO: move resolving the name to the state, like edition type?
		const text = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		const versionClassName = isPremiumEdition ? "premium-section" : "free-section";

		const classNames = [
			versionClassName,
			className,
		]
			.join(" ")
			.trim();

		let HeadingElement = null;

		switch (mode) {
			// TODO: create separate components instead of a flag.
			case "p":
				HeadingElement = textBase.p;
				break;

			case "h2":
				HeadingElement = textBase.h2;
				break;

			default:
				throw new Error(`Unknown mode: ${typeof mode} ${JSON.stringify(mode)}`);
		}

		return (
			<div className={classNames}>
				<HeadingElement>
					<textBase.a
						href={configure("urls.options-upgrade")}
						lang="en"
					>
						<TalkieEditionIcon
							isPremiumEdition={isPremiumEdition}
							mode="inline"
						/>
						{text}
					</textBase.a>
				</HeadingElement>

				{children}
			</div>
		);
	}
}

export default translateAttribute<EditionSectionProps & ChildrenRequiredProps & TranslateProps & ClassNameProp>()(
	configureAttribute<InternalProps>()(
		EditionSection,
	),
);
