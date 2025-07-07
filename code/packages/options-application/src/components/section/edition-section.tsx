/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024 Joel Purra <https://joelpurra.com/>

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

import type {
	ClassNameProp,
	TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import type {
	ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import type {
	StyleObject,
} from "styletron-react";

import TalkieEditionIcon from "@talkie/shared-ui/components/icon/talkie-edition-icon.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import {
	talkieStyled,
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import * as colorBase from "@talkie/shared-ui/styles/color/color-base.mjs";
import {
	rounded,
} from "@talkie/shared-ui/styles/shared-base.mjs";
import React from "react";

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
	static defaultProps = {
		headingLink: true,
	};

	private readonly styled: {
		h2ModeHeading: TalkieStyletronComponent<"h2">;
		wrapperBase: TalkieStyletronComponent<"div">;
		h2ModeWrapper: TalkieStyletronComponent<"div">;
		pModeWrapper: TalkieStyletronComponent<"div">;
	};

	constructor(props: P) {
		super(props);

		const partialStyled = {
			h2ModeHeading: withTalkieStyleDeep(
				textBase.h2,
				{
					marginTop: "1em",
				},
			),
			wrapperBase: talkieStyled(
				"div",
				{
					...rounded("0.5em"),
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
			h2ModeWrapper: withTalkieStyleDeep(
				partialStyled.wrapperBase,
				{
					paddingBottom: "2em",
				},
			),
			pModeWrapper: withTalkieStyleDeep(
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

		// HACK: relying on both css and css-in-js for some .premium-edition styling.
		const versionClassName = isPremiumEdition
			? "premium-section"
			: "free-section";

		const classNames = [
			versionClassName,
			className,
		]
			.join(" ")
			.trim();

		const backgroundColor: StyleObject = {
			backgroundColor: isPremiumEdition
				? colorBase.premiumSectionBackgroundColor
				: undefined,
		};

		// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
		const addBackgroundColor = <T extends React.ElementType,>(element: TalkieStyletronComponent<T>): TalkieStyletronComponent<T> => withTalkieStyleDeep(
			element,
			backgroundColor,
		);

		let Wrapper = null;
		let Heading = null;

		switch (mode) {
			// TODO: create separate components instead of using a flag.
			case "p": {
				Wrapper = addBackgroundColor(this.styled.pModeWrapper);
				Heading = talkieStyled("p");
				break;
			}

			case "h2": {
				Wrapper = addBackgroundColor(this.styled.h2ModeWrapper);
				Heading = this.styled.h2ModeHeading;
				break;
			}

			default: {
				throw new Error(`Unknown mode: ${typeof mode} ${JSON.stringify(mode)}`);
			}
		}

		// eslint-disable-next-line react/function-component-definition, @typescript-eslint/prefer-readonly-parameter-types
		const LinkOrNot: React.FunctionComponent<ChildrenRequiredProps> = ({
			children,
		}) => headingLink
			? (
				<a
					href="#features"
					lang="en"
				>
					{children}
				</a>
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
}

export default translateAttribute<InternalProps>()(
	EditionSection,
);
