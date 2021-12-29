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

import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as errors from "@talkie/shared-ui/styled/text/errors.js";
import * as lighter from "@talkie/shared-ui/styled/text/lighter.js";
import React from "react";
import {
	withStyleDeep,
} from "styletron-react";

export interface FooterStateProps {
	errorCount: number;
	versionNumber: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FooterDispatchProps {}

interface FooterProps extends FooterStateProps, FooterDispatchProps {}

export default class Footer<P extends FooterProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.styled = {
			footer: withStyleDeep(
				layoutBase.footer,
				{
					lineHeight: "2em",
					marginBottom: "1em",
					verticalAlign: "middle",
				},
			),

			footerErrorLink: withStyleDeep(
				errors.span,
				{
					// TODO: padding on one side, depending on the user interface language ltr/rtl.
					paddingLeft: "0.5em",
					paddingRight: "0.5em",
					verticalAlign: "middle",
				},
			),

			footerFirstLink: withStyleDeep(
				lighter.a,
				{
					verticalAlign: "middle",
				},
			),

			footerSecondLink: withStyleDeep(
				lighter.a,
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
		} = this.props;

		const ErrorCount = errorCount === 0
			? null
			: (
				<errors.span>
					errors(
					{errorCount}
					)
				</errors.span>
			);

		return (
			<this.styled.footer>
				<this.styled.footerFirstLink
					href="https://joelpurra.com/"
					lang="sv"
					rel="noopener noreferrer"
					target="_blank"
				>
					joelpurra.com
				</this.styled.footerFirstLink>

				{ErrorCount}

				<this.styled.footerSecondLink href="#about" id="footer-about-link">
					v
					{versionNumber}
				</this.styled.footerSecondLink>
			</this.styled.footer>
		);
	}

	private readonly styled: {
		footer: typeof layoutBase.footer;
		footerFirstLink: typeof lighter.a;
		footerSecondLink: typeof lighter.a;
		footerErrorLink: typeof errors.span;
	};
}
