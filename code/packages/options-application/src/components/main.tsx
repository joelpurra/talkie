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

import TabContents from "@talkie/shared-application/components/navigation/tab-contents";
import NavContainer from "@talkie/shared-application/containers/nav-container";
import {
	NavLink,
} from "@talkie/shared-application/containers/nav-container-types";
import configureAttribute, {
	ConfigureProps,
} from "@talkie/shared-application/hocs/configure";
import passSelectedTextToBackground from "@talkie/shared-application/hocs/pass-selected-text-to-background";
import translateAttribute, {
	TranslateProps,
} from "@talkie/shared-application/hocs/translate";
import * as layoutBase from "@talkie/shared-application/styled/layout/layout-base";
import {
	ClassNameProp,
} from "@talkie/shared-application/styled/types";
import DynamicEnvironment from "@talkie/split-environment/dynamic-environment";
import React, {
	ComponentProps,
} from "react";
import {
	styled,
	StyleObject,
	StyletronComponent,
	withStyleDeep,
} from "styletron-react";

import AboutContainer from "../containers/about-container";
import EditionsContainer from "../containers/editions-container";
import TextContainer from "../containers/text-container";
import VoicesContainer from "../containers/voices-container";
import {
	actions,
} from "../slices/index";

export interface MainStateProps {
	activeTabId: string | null;
	shouldShowBackButton: boolean;
}

export interface MainDispatchProps {
	openUrlInNewTab: typeof actions.shared.navigation.openUrlInNewTab;
	setShouldShowBackButton: typeof actions.navigation.setShouldShowBackButton;
}

interface MainProps extends MainStateProps, MainDispatchProps {}

const dynamicEnvironment = new DynamicEnvironment();

const widthStyles = {
	maxWidth: "600px",
	minWidth: "400px",
};

const styles: StyleObject = {
	...widthStyles,
	minHeight: "450px",
	paddingBottom: "2em",
};
class Main<P extends MainProps & TranslateProps & ClassNameProp & ConfigureProps> extends React.PureComponent<P> {
	private readonly links: NavLink[];

	private readonly styled: {
		main: StyletronComponent<ComponentProps<typeof layoutBase.main>>;
		navHeader: StyletronComponent<ComponentProps<"div">>;
	};

	constructor(props: P) {
		super(props);

		this.scrollToTop = this.scrollToTop.bind(this);
		this.handleLinkClick = this.handleLinkClick.bind(this);

		// TODO: async load/unload logic for classes.
		// TODO: better place to put navigation menu links?
		this.links = [
			{
				text: "←",
				url: this.props.configure("urls.popup-passclick-false"),
			},
			{
				tabId: "voices",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_voicesLinkText"),
			},
			{
				tabId: "text",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_textLinkText"),
			},
			{
				tabId: "upgrade",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_upgradeLinkText"),
			},
			{
				tabId: "about",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_aboutLinkText"),
			},
		];

		this.styled = {
			main: withStyleDeep(
				layoutBase.main,
				{
					marginTop: "4em",
				},
			),

			navHeader: styled(
				"div",
				{
					...widthStyles,
					backgroundColor: "#ffffff",
					left: 0,
					position: "fixed",
					right: 0,
					top: 0,
				},
			),
		};
	}

	getLocationQuerystring(): string | null {
		let queryString = null;

		if (dynamicEnvironment.isWebExtension() && document.location && typeof document.location.search === "string" && document.location.search.length > 0) {
			queryString = "?" + decodeURIComponent(document.location.search.replace("?", ""));
		}

		return queryString;
	}

	override componentDidMount(): void {
		this.scrollToTop();

		// TODO: move "loading shouldShowBackButton" from the querystring to an action, especially to avoid using the DynamicEnvironment in a component.
		const queryString = this.getLocationQuerystring();
		const shouldShowBackButton = Boolean(queryString?.includes("from=popup"));

		this.props.setShouldShowBackButton(shouldShowBackButton);
	}

	override componentDidUpdate(previousProps: P): void {
		if (previousProps.activeTabId !== this.props.activeTabId) {
			this.scrollToTop();
		}
	}

	scrollToTop(): void {
		// NOTE: execute outside the synchronous rendering.
		setTimeout(() => {
			// NOTE: feels like this might be the wrong place to put this? Is there a better place?
			// NOTE: due to shuffling around elements, there's some confusion regarding which element to apply scrolling to.
			document.body.scrollTop = 0;
			window.scroll(0, 0);
		}, 100);
	}

	handleLinkClick(url: string): void {
		this.props.openUrlInNewTab(url);
	}

	override render(): React.ReactNode {
		const {
			activeTabId,
			shouldShowBackButton,
			className,
		} = this.props;

		const linksToShow = shouldShowBackButton ? this.links : this.links.slice(1);

		return (
			<div className={className}>
				<this.styled.navHeader>
					<NavContainer
						links={linksToShow}
					/>

					<layoutBase.hr/>
				</this.styled.navHeader>

				<this.styled.main>
					<TabContents
						activeTabId={activeTabId}
						id="voices"
						onLinkClick={this.handleLinkClick}
					>
						<VoicesContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="text"
						onLinkClick={this.handleLinkClick}
					>
						<TextContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="upgrade"
						onLinkClick={this.handleLinkClick}
					>
						<EditionsContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="about"
						onLinkClick={this.handleLinkClick}
					>
						<AboutContainer/>
					</TabContents>
				</this.styled.main>
			</div>
		);
	}
}

export default styled(
	configureAttribute<MainProps & ClassNameProp & ConfigureProps>()(
		translateAttribute<MainProps & TranslateProps & ClassNameProp & ConfigureProps>()(
			passSelectedTextToBackground<MainProps & TranslateProps & ClassNameProp & ConfigureProps>()(Main),
		),
	),
	styles,
);
