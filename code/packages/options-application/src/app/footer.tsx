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

import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import {
	talkieStyled,
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as errors from "@talkie/shared-ui/styled/text/errors.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import React from "react";

export interface FooterStateProps {
	errorCount: number;
	versionNumber: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FooterDispatchProps {}

interface FooterProps extends FooterStateProps, FooterDispatchProps {}

export default class Footer<P extends FooterProps> extends React.PureComponent<P> {
	private readonly styled: {
		footer: typeof layoutBase.footer;
		footerLink: TalkieStyletronComponent<"a">;
		footerErrorCount: typeof errors.span;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			footer: withTalkieStyleDeep(
				layoutBase.footer,
				{
					lineHeight: "2em",
					marginBottom: "1em",
					verticalAlign: "middle",
				},
			),

			footerErrorCount: withTalkieStyleDeep(
				errors.span,
				{
					// TODO: padding on one side, depending on the user interface language ltr/rtl.
					// TODO: replace padding with before/after pseudo-element with a single space as contents?
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					verticalAlign: "middle",
				},
			),

			footerLink: talkieStyled(
				"a",
				{
					verticalAlign: "middle",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			errorCount,
			versionNumber,
		} = this.props as P;

		const ErrorCount = errorCount === 0
			? null
			: (
				<this.styled.footerErrorCount>
					errors(
					{errorCount}
					)
				</this.styled.footerErrorCount>
			);

		return (
			<this.styled.footer>
				<this.styled.footerLink
					href="https://joelpurra.com/"
					lang="sv"
					rel="noopener noreferrer"
					target="_blank"
				>
					joelpurra.com
				</this.styled.footerLink>

				{ErrorCount}

				<this.styled.footerLink href="#about" id="footer-about-link">
					v
					{versionNumber}
				</this.styled.footerLink>
			</this.styled.footer>
		);
	}
}
