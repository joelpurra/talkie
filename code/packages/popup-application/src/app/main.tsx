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

import {
	talkieStyled,
} from "@talkie/shared-ui/styled/talkie-styled.mjs";
import {
	type ClassNameProp,
} from "@talkie/shared-ui/styled/types.js";
import {
	handleBubbledLinkClick,
} from "@talkie/shared-ui/utils/ui.mjs";
import React from "react";
import type {
	StyleObject,
} from "styletron-react";
import type {
	ReadonlyDeep,
} from "type-fest";

import {
	type actions,
} from "../slices/index.mjs";
import Footer, {
	type FooterStateProps,
} from "./sections/footer.js";
import Header from "./sections/header.js";
import Menu from "./sections/menu.js";
import Status from "./sections/status.js";

export interface MainStateProps extends FooterStateProps {
	isPremiumEdition: boolean;
	isSpeaking: boolean;
}

export interface MainDispatchProps {
	iconClick: typeof actions.shared.speaking.iconClick;
	openExternalUrlInNewTab: typeof actions.shared.navigation.openExternalUrlInNewTab;
	openOptionsPage: typeof actions.shared.navigation.openOptionsPage;
}

const styles: StyleObject = {
	marginTop: "1em",
	maxWidth: "350px",
	minWidth: "350px",
};

class Main<P extends MainStateProps & MainDispatchProps & ClassNameProp> extends React.PureComponent<P> {
	constructor(props: P) {
		super(props);

		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleCheckLinkClick = this.handleCheckLinkClick.bind(this);
		this.handleOptionsPageClick = this.handleOptionsPageClick.bind(this);
	}

	handleLinkClick(url: ReadonlyDeep<URL>): void {
		this.props.openExternalUrlInNewTab(url);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleCheckLinkClick(event: Readonly<React.MouseEvent>): false | undefined {
		// TODO: use an api call which has handleBubbledLinkClick?
		return handleBubbledLinkClick(this.handleLinkClick, event as ReadonlyDeep<React.MouseEvent>);
	}

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOptionsPageClick(event: React.MouseEvent): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.openOptionsPage();

		return false;
	}

	override render(): React.ReactNode {
		const {
			className,
			errorCount,
			iconClick,
			isPremiumEdition,
			isSpeaking,
			versionNumber,
		} = this.props as P;

		return (
			<div
				className={className}
				onClick={this.handleCheckLinkClick}
			>
				<Header
					isPremiumEdition={isPremiumEdition}
					playPauseClick={iconClick}
				/>

				<Status
					isSpeaking={isSpeaking}
					playPauseClick={iconClick}
				/>

				<Menu/>

				<Footer
					errorCount={errorCount}
					optionsPageClick={this.handleOptionsPageClick}
					versionNumber={versionNumber}
				/>
			</div>
		);
	}
}

export default talkieStyled(
	Main,
	styles,
);
