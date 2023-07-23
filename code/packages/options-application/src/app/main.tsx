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

import {
	type OsType,
	type SystemType,
} from "@talkie/shared-interfaces/imetadata-manager.mjs";
import passSelectedTextToBackground from "@talkie/shared-ui/hocs/pass-selected-text-to-background.js";
import translateAttribute, {
	type TranslateProps,
} from "@talkie/shared-ui/hocs/translate.js";
import * as layoutBase from "@talkie/shared-ui/styled/layout/layout-base.js";
import {
	type ClassNameProp,
	type TalkieStyletronComponent,
} from "@talkie/shared-ui/styled/types.js";
import * as colorBase from "@talkie/shared-ui/styles/color/color-base.mjs";
import React from "react";
import type {
	StyleObject,
} from "styletron-react";
import {
	styled,
	withStyleDeep,
} from "styletron-react";
import {
	type ReadonlyDeep,
} from "type-fest";

import Loading from "../components/loading.js";
import NavContainer from "../components/navigation/nav-container.js";
import {
	type NavLink,
} from "../components/navigation/nav-container-types.mjs";
import TabContents from "../components/navigation/tab-contents.js";
import AboutContainer from "../containers/about-container.js";
import FeaturesContainer from "../containers/features-container.js";
import TextContainer from "../containers/settings-container.js";
import VoicesContainer from "../containers/voices/voices-container.js";
import WelcomeContainer from "../containers/welcome-container.js";
import {
	type actions,
} from "../slices/index.mjs";
import Footer, {
	type FooterStateProps,
} from "./footer.js";
import Header from "./header.js";
import Support from "./sections/support.js";
import Usage from "./sections/usage.js";

export interface MainStateProps extends FooterStateProps {
	activeTabId: string | null;
	isPremiumEdition: boolean;
	osType: OsType | null;
	showAdditionalDetails: boolean;
	systemType: SystemType | null;
}

export interface MainDispatchProps {
	openShortKeysConfiguration: typeof actions.shared.navigation.openShortKeysConfiguration;
	openExternalUrlInNewTab: typeof actions.shared.navigation.openExternalUrlInNewTab;
	openOptionsPage: typeof actions.shared.navigation.openOptionsPage;
}

export interface MainProps extends MainStateProps, MainDispatchProps, TranslateProps, ClassNameProp {}

const widthStyles = {
	maxWidth: "1400px",
	minWidth: "600px",
};

const styles: StyleObject = {
	...widthStyles,
	minHeight: "600px",
	paddingBottom: "2em",
};

class Main<P extends MainProps> extends React.PureComponent<P> {
	static defaultProps = {
		osType: null,
	};

	private readonly links: NavLink[];

	private readonly styled: {
		footerHr: TalkieStyletronComponent<typeof layoutBase.hr>;
		main: TalkieStyletronComponent<typeof layoutBase.main>;
		navHeader: TalkieStyletronComponent<"div">;
	};

	constructor(props: P) {
		super(props);

		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
		this.handleOptionsPageClick = this.handleOptionsPageClick.bind(this);

		this.links = [
			{
				tabId: "welcome",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_welcomeLinkText"),
			},
			{
				tabId: "voices",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_voicesLinkText"),
			},
			{
				tabId: "usage",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_usageLinkText"),
			},
			{
				tabId: "features",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_featuresLinkText"),
			},
			{
				tabId: "settings",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_settingsLinkText"),
			},
			{
				tabId: "support",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_supportLinkText"),
			},
			{
				tabId: "about",
				// eslint-disable-next-line no-sync
				text: this.props.translateSync("frontend_aboutLinkText"),
			},
		];

		this.styled = {
			footerHr: withStyleDeep(
				layoutBase.hr,
				{
					marginTop: "3em",
				},
			),

			main: withStyleDeep(
				layoutBase.main,
				{
					marginTop: "10em",
				},
			),

			navHeader: styled(
				"div",
				{
					...widthStyles,
					backgroundColor: colorBase.bodyBackgroundColor,
					left: 0,
					position: "fixed",
					right: 0,
					top: 0,
				},
			),
		};
	}

	override componentDidMount(): void {
		this.scrollToTop();
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

	// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
	handleOpenShortKeysConfigurationClick(event: Readonly<React.MouseEvent>): false {
		event.preventDefault();
		event.stopPropagation();

		this.props.openShortKeysConfiguration();

		return false;
	}

	handleLinkClick(url: ReadonlyDeep<URL>): void {
		this.props.openExternalUrlInNewTab(url);
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
			activeTabId,
			className,
			errorCount,
			isPremiumEdition,
			osType,
			showAdditionalDetails,
			systemType,
			versionNumber,
		} = this.props;

		const linksToShow = this.links;

		return (
			<div className={className}>
				<this.styled.navHeader>
					<Header
						isPremiumEdition={isPremiumEdition}
					/>

					<NavContainer
						links={linksToShow}
					/>

					<layoutBase.hr/>
				</this.styled.navHeader>

				<layoutBase.hr/>

				<this.styled.main>
					<TabContents
						// NOTE: used when prerendering the static per-language template.
						// NOTE: may be briefly visible when loading the options page, in particular when debugging on Firefox on Ubuntu with 8000+ voices.
						activeTabId={activeTabId}
						id="fallback-tab"
						onLinkClick={this.handleLinkClick}
					>
						<Loading
							// NOTE: always "loading", as it is assumed the active tab (selected by the hash in the url) will be switched as soon as possible.
							isBlockElement
							enabled={false}
						>
							{/* NOTE: empty/loading placeholder for the "fallback-tab" default active tab id. */}
						</Loading>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="welcome"
						onLinkClick={this.handleLinkClick}
					>
						<WelcomeContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="voices"
						onLinkClick={this.handleLinkClick}
					>
						<VoicesContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="usage"
						onLinkClick={this.handleLinkClick}
					>
						<Usage
							isPremiumEdition={isPremiumEdition}
							osType={osType}
							systemType={systemType}
							onOpenShortKeysConfigurationClick={this.handleOpenShortKeysConfigurationClick}
						/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="features"
						onLinkClick={this.handleLinkClick}
					>
						<FeaturesContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="settings"
						onLinkClick={this.handleLinkClick}
					>
						<TextContainer/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="support"
						onLinkClick={this.handleLinkClick}
					>
						<Support
							osType={osType}
							showAdditionalDetails={showAdditionalDetails}
							systemType={systemType}
							onOpenShortKeysConfigurationClick={this.handleOpenShortKeysConfigurationClick}
						/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="about"
						onLinkClick={this.handleLinkClick}
					>
						<AboutContainer/>
					</TabContents>
				</this.styled.main>

				<this.styled.footerHr/>

				<Footer
					errorCount={errorCount}
					versionNumber={versionNumber}
				/>
			</div>
		);
	}
}

export default styled(
	translateAttribute<MainProps>()(
		passSelectedTextToBackground<MainProps>()(
			Main,
		),
	),
	styles,
);
