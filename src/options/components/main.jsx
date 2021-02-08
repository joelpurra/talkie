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

import PropTypes from "prop-types";
import React from "react";

import TabContents from "../../shared/components/navigation/tab-contents.jsx";
import NavContainer from "../../shared/containers/nav-container.jsx";
import configureAttribute from "../../shared/hocs/configure.jsx";
import passSelectedTextToBackground from "../../shared/hocs/pass-selected-text-to-background.jsx";
import styled from "../../shared/hocs/styled.jsx";
import translateAttribute from "../../shared/hocs/translate.jsx";
import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";
import DynamicEnvironment from "../../split-environments/dynamic-environment.js";
import AboutContainer from "../containers/about-container.jsx";
import EditionsContainer from "../containers/editions-container.jsx";
import TextContainer from "../containers/text-container.jsx";
import VoicesContainer from "../containers/voices-container.jsx";

const dynamicEnvironment = new DynamicEnvironment();

const widthStyles = {
	maxWidth: "600px",
	minWidth: "400px",
};

const styles = Object.assign(
	{},
	widthStyles,
	{
		minHeight: "450px",
		paddingBottom: "2em",
	},
);

export default
// eslint-disable-next-line react/no-unsafe
@configureAttribute
@translateAttribute
@styled(styles)
@passSelectedTextToBackground
class Main extends React.PureComponent {
	constructor(props) {
		super(props);

		this.scrollToTop = this.scrollToTop.bind(this);
		this.handleLegaleseClick = this.handleLegaleseClick.bind(this);
		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);

		// TODO: better place to put navigation menu links?
		this.links = [
			{
				text: "←",
				url: this.props.configure("urls.popup-passclick-false"),
			},
			{
				tabId: "voices",
				text: this.props.translate("frontend_voicesLinkText"),
			},
			{
				tabId: "text",
				text: this.props.translate("frontend_textLinkText"),
			},
			{
				tabId: "upgrade",
				text: this.props.translate("frontend_upgradeLinkText"),
			},
			{
				tabId: "about",
				text: this.props.translate("frontend_aboutLinkText"),
			},
		];

		this.styled = {
			main: styled({
				marginTop: "4em",
			})(layoutBase.main),

			navHeader: styled(Object.assign(
				{},
				widthStyles,
				{
					backgroundColor: "#ffffff",
					left: 0,
					position: "fixed",
					right: 0,
					top: 0,
				},
			))("div"),
		};
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		activeTabId: PropTypes.string.isRequired,
		className: PropTypes.string.isRequired,
		configure: PropTypes.func.isRequired,
		onConfigurationChange: PropTypes.func.isRequired,
		// eslint-disable-next-line react/boolean-prop-naming
		shouldShowBackButton: PropTypes.bool.isRequired,
		translate: PropTypes.func.isRequired,
	};

	getLocationQuerystring() {
		let queryString = null;

		if (dynamicEnvironment.isWebExtension() && document.location && typeof document.location.search === "string" && document.location.search.length > 0) {
			queryString = "?" + decodeURIComponent(document.location.search.replace("?", ""));
		}

		return queryString;
	}

	// eslint-disable-next-line camelcase
	UNSAFE_componentWillMount() {
		// TODO: move "loading shouldShowBackButton" from the querystring to an action, especially to avoid using the DynamicEnvironment in a component.
		const queryString = this.getLocationQuerystring();
		const shouldShowBackButton = Boolean(queryString && queryString.includes("from=popup"));

		this.props.actions.navigation.setShouldShowBackButton(shouldShowBackButton);
	}

	componentDidMount() {
		this._unregisterConfigurationListener = this.props.onConfigurationChange(() => this.forceUpdate());

		// NOTE: execute outside the synchronous rendering.
		setTimeout(() => this.scrollToTop(), 100);
	}

	componentWillUnmount() {
		this._unregisterConfigurationListener();
	}

	// eslint-disable-next-line camelcase
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.props.activeTabId !== nextProps.activeTabId) {
			this.scrollToTop();
		}
	}

	scrollToTop() {
		// NOTE: feels like this might be the wrong place to put this? Is there a better place?
		// NOTE: due to schuffling around elements, there's some confusion regarding which element to apply scrolling to.
		document.body.scrollTop = 0;
		window.scroll(0, 0);
	}

	handleLegaleseClick(text) {
		const legaleseText = text;
		const legaleseVoice = {
			lang: "en-US",
			name: "Zarvox",
		};

		this.props.actions.sharedVoices.speak(legaleseText, legaleseVoice);
	}

	handleLinkClick(url) {
		this.props.actions.sharedNavigation.openUrlInNewTab(url);
	}

	handleOpenShortKeysConfigurationClick() {
		this.props.actions.sharedNavigation.openShortKeysConfiguration();
	}

	render() {
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
						<AboutContainer
							onLicenseClick={this.handleLegaleseClick}
						/>
					</TabContents>
				</this.styled.main>
			</div>
		);
	}
}
