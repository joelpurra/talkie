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

import Icon from "@talkie/shared-ui/components/icon/icon.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-ui/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-ui/styled/text/text-base.js";
import React, {
	ComponentProps,
} from "react";
import type {
	StyletronComponent,
} from "styletron-react";
import {
	styled,
	withStyleDeep,
} from "styletron-react";

class Menu<P extends ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.styled = {
			a: withStyleDeep(
				textBase.a,
				{
					borderRadius: "0.3em",
					display: "block",
					height: "2em",
					lineHeight: "2em",
					textDecoration: "none",
				},
			),

			li: styled(
				"li",
				{
					display: "block",
					marginBottom: "0.25em",
					marginTop: "0.25em",
					verticalAlign: "middle",
				},
			),

			ol: styled(
				"ol",
				{
					// https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#accessibility_concerns
					listStyleType: "'\\200B'",
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					marginTop: 0,
					paddingBottom: 0,
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 0,
				},
			),
		};
	}

	override render(): React.ReactNode {
		const {
			configure,
			translateSync,
		} = this.props;

		return (
			<layoutBase.nav>
				<this.styled.ol>
					<this.styled.li>
						<this.styled.a href={configure("urls.options-voices")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-voices" mode="inline"/>
							{translateSync("frontend_PopupMenu_Voices")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.options-usage")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-usage" mode="inline"/>
							{translateSync("frontend_PopupMenu_Usage")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.options-features")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-features" mode="inline"/>
							{translateSync("frontend_PopupMenu_Features")}
						</this.styled.a>
					</this.styled.li>
					<this.styled.li>
						<this.styled.a href={configure("urls.options-support")} rel="noopener noreferrer" target="_blank">
							<Icon className="icon-feedback" mode="inline"/>
							{translateSync("frontend_supportAndFeedback")}
						</this.styled.a>
					</this.styled.li>
				</this.styled.ol>
			</layoutBase.nav>
		);
	}

	private readonly styled: {
		a: StyletronComponent<ComponentProps<typeof textBase.a>>;
		li: StyletronComponent<ComponentProps<"li">>;
		ol: StyletronComponent<ComponentProps<"ol">>;
	};
}

export default configureAttribute()(
	translateAttribute<ConfigureProps & TranslateProps>()(
		Menu,
	),
);

