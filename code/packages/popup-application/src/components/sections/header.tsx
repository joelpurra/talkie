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

import Discretional from "@talkie/shared-application/components/discretional.js";
import ExtensionShortName from "@talkie/shared-application/components/editions/extension-short-name.js";
import TalkieEditionIcon from "@talkie/shared-application/components/icon/talkie-edition-icon.js";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure.js";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate.js";
import * as buttonBase from "@talkie/shared-application/styled/button/button-base.js";
import * as layoutBase from "@talkie/shared-application/styled/layout/layout-base.js";
import * as textBase from "@talkie/shared-application/styled/text/text-base.js";
import React, {
	ComponentProps,
} from "react";
import {
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

export interface HeaderProps {
	isPremiumEdition: boolean;
	playPauseClick: () => void;
}

class Header<P extends HeaderProps & ConfigureProps & TranslateProps> extends React.PureComponent<P> {
	private readonly styled: {
		button: StyletronComponent<ComponentProps<typeof buttonBase.a>>;
		extensionName: StyletronComponent<ComponentProps<typeof textBase.a>>;
	};

	constructor(props: P) {
		super(props);

		this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);

		this.styled = {
			button: withStyleDeep(
				buttonBase.a,
				{
					":focus": {
						outline: 0,
					},
					lineHeight: "1.5em",
				},
			),

			extensionName: withStyleDeep(
				textBase.a,
				{
					":focus": {
						outline: 0,
					},
					fontWeight: "bold",
					textDecoration: "none",
				},
			),
		};
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handlePlayPauseClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.playPauseClick();

		return false;
	}

	override render(): React.ReactNode {
		const {
			isPremiumEdition,
			configure,
			translateSync,
		} = this.props;

		return (
			<layoutBase.header>
				<Discretional
					enabled={!isPremiumEdition}
				>
					<this.styled.button
						href={configure("urls.options-upgrade")}
						id="header-premium-button"
						lang="en"
						rel="noopener noreferrer"
						target="_blank"
					>
						{translateSync("extensionShortName_Premium")}
					</this.styled.button>
				</Discretional>

				<buttonBase.transparentButton
					onClick={this.handlePlayPauseClick}
				>
					<TalkieEditionIcon
						isPremiumEdition={isPremiumEdition}
						mode="inline"
					/>
				</buttonBase.transparentButton>

				<this.styled.extensionName
					href={configure("urls.main")}
					lang="en"
					rel="noopener noreferrer"
					target="_blank"
				>
					<ExtensionShortName
						isPremiumEdition={isPremiumEdition}
					/>
				</this.styled.extensionName>
			</layoutBase.header>
		);
	}
}

export default configureAttribute<HeaderProps & ConfigureProps>()(
	translateAttribute<HeaderProps & ConfigureProps & TranslateProps>()(
		Header,
	),
);

