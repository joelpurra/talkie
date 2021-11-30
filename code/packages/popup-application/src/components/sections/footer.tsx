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

import Icon from "@talkie/shared-application/components/icon/icon";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import * as layoutBase from "@talkie/shared-application/styled/layout/layout-base";
import * as errors from "@talkie/shared-application/styled/text/errors";
import * as lighter from "@talkie/shared-application/styled/text/lighter";
import {
	OnOpenOptionsPageClickProp,
} from "@talkie/shared-application/types";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

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
		footer: StyletronComponent<ComponentProps<typeof layoutBase.footer>>;
		footerFirstLink: StyletronComponent<ComponentProps<typeof lighter.a>>;
		footerSecondLink: StyletronComponent<ComponentProps<typeof lighter.a>>;
		footerErrorLink: StyletronComponent<ComponentProps<typeof errors.span>>;
	};

	constructor(props: P) {
		super(props);

		this.styled = {
			footer: withStyleDeep(
				layoutBase.footer,
				{
					lineHeight: "2em",
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
					fontSize: "1.75em",
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
			configure,
			errorCount,
			optionsPageClick,
			versionNumber,
		} = this.props;

		// TODO: create a component class.
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
					href={configure("urls.options")}
					onClick={optionsPageClick}
					rel="noopener noreferrer"
					target="_blank"
				>
					<Icon
						className="icon-settings"
						mode="standalone"
						size="0.75em"
					/>
				</this.styled.footerFirstLink>

				{ErrorCount}

				<this.styled.footerSecondLink
					href={configure("urls.options-about")}
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
