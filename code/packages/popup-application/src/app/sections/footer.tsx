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

import Icon from "@talkie/shared-ui/components/icon/icon.js";
import configureAttribute, {
	type ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import {
	talkieStyled,
	withTalkieStyleDeep,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import * as errors from "@talkie/shared-ui/styled/text/errors.js";
import {
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import {
	type OnOpenOptionsPageClickProp,
} from "@talkie/shared-ui/types.mjs";
import React from "react";

export interface FooterStateProps {
	errorCount: number;
	versionNumber: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FooterDispatchProps {}

export interface FooterProps extends FooterStateProps, FooterDispatchProps {
	optionsPageClick: OnOpenOptionsPageClickProp;
}

class Footer<P extends FooterProps & ConfigureProps> extends React.PureComponent<P> {
	styled: {
		footer: TalkieStyletronComponent<typeof layoutBase.footer>;
		footerFirstLink: TalkieStyletronComponent<"a">;
		footerSecondLink: TalkieStyletronComponent<"a">;
		footerErrorCount: TalkieStyletronComponent<typeof errors.span>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			footer: withTalkieStyleDeep(
				layoutBase.footer,
				{
					lineHeight: "2em",
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

			footerFirstLink: talkieStyled(
				"a",
				{
					fontSize: "1.75em",
					verticalAlign: "middle",
				},
			),

			footerSecondLink: talkieStyled(
				"a",
				{
					verticalAlign: "middle",
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			configure,
			errorCount,
			optionsPageClick,
			versionNumber,
		} = this.props as P;

		// TODO: create a component class.

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
				<this.styled.footerFirstLink
					href={configure("urls.internal.options-settings")}
					rel="noopener noreferrer"
					target="_blank"
					onClick={optionsPageClick}
				>
					<Icon
						className="icon-settings"
						mode="standalone"
						size="0.75em"
					/>
				</this.styled.footerFirstLink>

				{ErrorCount}

				<this.styled.footerSecondLink
					href={configure("urls.internal.options-about")}
					id="footer-about-link"
					rel="noopener noreferrer"
					target="_blank"
				>
					v
					{versionNumber}
				</this.styled.footerSecondLink>
			</this.styled.footer>
		);
	}
}

export default configureAttribute<FooterProps & ConfigureProps>()(
	Footer,
);
