/*
This file is part of Talkie -- text-to-speech browser extension button.
<https://joelpurra.com/projects/talkie/>

Copyright (c) 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025 Joel Purra <https://joelpurra.com/>

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
	talkieStyled,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import {
	type ClassNameProp,
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import * as layoutBase from "@talkie/shared-ui/styles/layout/layout-base.mjs";
import {
	type ChildrenRequiredProps,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

export type InformationType =
	| "information"
	| "warning";

export interface InformationSectionProps extends ChildrenRequiredProps, ClassNameProp {
	informationType: InformationType;
}

class InformationSection<P extends InformationSectionProps> extends React.PureComponent<P> {
	private readonly styled: {
		childBox: TalkieStyletronComponent<"div">;
		glyphIcon: TalkieStyletronComponent<"div">;
		informationBox: TalkieStyletronComponent<"div">;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			childBox: talkieStyled(
				"div",
				{
					paddingTop: "0.5em",
				},
			),
			glyphIcon: talkieStyled(
				"div",
				{
					display: "inline-block",
					"float": "left",
					fontSize: "2em",
					marginBottom: "0.5em",
					marginLeft: "0.5em",
					marginRight: "0.5em",
					marginTop: "0.5em",
				},
			),
			informationBox: talkieStyled(
				"div",
				{
					...layoutBase.roundedWithBorder("0.5em"),
					":after": {
						// TODO: avoid float hacks.
						clear: "both",
						content: "''",
						display: "table",
					},
					marginBottom: "1em",
					marginLeft: "-0.5em",
					marginRight: "-0.5em",
					marginTop: "1em",
					paddingBottom: "0.5em",
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					paddingTop: "0.5em",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			informationType,
			children,
			className,
		} = this.props as InformationSectionProps;

		let informationTypeGlyph = null;

		switch (informationType) {
			case "information": {
				informationTypeGlyph = "\u2139";
				break;
			}

			case "warning": {
				informationTypeGlyph = "\u26A0";
				break;
			}
		}

		return (
			<this.styled.informationBox
				className={className}
			>
				<this.styled.glyphIcon>
					{informationTypeGlyph}
				</this.styled.glyphIcon>

				<this.styled.childBox>
					{children}
				</this.styled.childBox>
			</this.styled.informationBox>
		);
	}
}

export default InformationSection;
