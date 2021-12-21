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

import TalkieEditionIcon from "@talkie/shared-ui/components/icon/talkie-edition-icon.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import {
	ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import * as layoutBase from "@talkie/shared-ui/styles/layout/layout-base.mjs";
import {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

export type EditionSectionMode =
	| "p"
	| "h2";

export interface EditionSectionProps extends ChildrenRequiredProps, ClassNameProp {
	headingLink?: boolean;
	isPremiumEdition: boolean;
	mode: EditionSectionMode;
}

interface InternalProps extends EditionSectionProps, TranslateProps {}

class EditionSection<P extends InternalProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		const partialStyled = {
			h2ModeHeading: styled(
				textBase.h2,
				{
					marginTop: "1em",
				},
			),
			wrapperBase: styled(
				"div",
				{
					...layoutBase.rounded("0.5em"),
					marginLeft: "-0.5em",
					marginRight: "-0.5em",
					marginTop: "2em",
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					paddingTop: "0.5em",
				},
			),
		};

		this.styled = {
			...partialStyled,
			h2ModeWrapper: withStyleDeep(
				partialStyled.wrapperBase,
				{
					paddingBottom: "2em",
				},
			),
			pModeWrapper: withStyleDeep(
				partialStyled.wrapperBase,
				{
					paddingBottom: "0.5em",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			mode,
			headingLink,
			isPremiumEdition,
			children,
			className,
			translateSync,
		} = this.props as InternalProps;

		// TODO: move resolving the name to the state, like edition type?
		const text = isPremiumEdition
			? translateSync("extensionShortName_Premium")
			: translateSync("extensionShortName_Free");

		const versionClassName = isPremiumEdition
			? "premium-section"
			: "free-section";

		const classNames = [
			versionClassName,
			className,
		]
			.join(" ")
			.trim();

		let Wrapper = null;
		let Heading = null;

		switch (mode) {
			// TODO: create separate components instead of a flag.
			case "p":
				Wrapper = this.styled.pModeWrapper;
				Heading = textBase.p;
				break;

			case "h2":
				Wrapper = this.styled.h2ModeWrapper;
				Heading = this.styled.h2ModeHeading;
				break;

			default:
				throw new Error(`Unknown mode: ${typeof mode} ${JSON.stringify(mode)}`);
		}

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const LinkOrNot: React.FC = ({
			children,
		}) => headingLink
			? (
				<textBase.a
					href="#features"
					lang="en"
				>
					{children}
				</textBase.a>
			)
			: (
				// eslint-disable-next-line react/jsx-no-useless-fragment
				<>
					{children}
				</>
			);

		return (
			<Wrapper className={classNames}>
				<Heading>
					<LinkOrNot>
						<TalkieEditionIcon
							isPremiumEdition={isPremiumEdition}
							mode="inline"
						/>
						{text}
					</LinkOrNot>
				</Heading>

				{children}
			</Wrapper>
		);
	}

	static defaultProps = {
		headingLink: true,
	};

	private readonly styled: {
		h2ModeHeading: StyletronComponent<ComponentProps<"h2">>;
		wrapperBase: StyletronComponent<ComponentProps<"div">>;
		h2ModeWrapper: StyletronComponent<ComponentProps<"div">>;
		pModeWrapper: StyletronComponent<ComponentProps<"div">>;
	};
}

export default translateAttribute<InternalProps>()(
	EditionSection,
);
