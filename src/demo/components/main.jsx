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
import passSelectedTextToBackground from "../../shared/hocs/pass-selected-text-to-background.jsx";
import styled from "../../shared/hocs/styled.jsx";
import translateAttribute from "../../shared/hocs/translate.jsx";
import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";
import VoicesContainer from "../containers/voices-container.jsx";
import WelcomeContainer from "../containers/welcome-container.jsx";
import Footer from "./footer.jsx";
import Header from "./header.jsx";
import About from "./sections/about.jsx";
import Features from "./sections/features.jsx";
import Support from "./sections/support.jsx";
import Usage from "./sections/usage.jsx";

const widthStyles = {
	maxWidth: "1000px",
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
@translateAttribute
@styled(styles)
@passSelectedTextToBackground
class Main extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleOpenShortKeysConfigurationClick = this.handleOpenShortKeysConfigurationClick.bind(this);
		this.handleOptionsPageClick = this.handleOptionsPageClick.bind(this);

		// TODO: better place to put navigation menu links?
		this.links = [
			{
				tabId: "welcome",
				text: this.props.translate("frontend_welcomeLinkText"),
			},
			{
				tabId: "voices",
				text: this.props.translate("frontend_voicesLinkText"),
			},
			{
				tabId: "usage",
				text: this.props.translate("frontend_usageLinkText"),
			},
			{
				tabId: "features",
				text: this.props.translate("frontend_featuresLinkText"),
			},
			{
				tabId: "support",
				text: this.props.translate("frontend_supportLinkText"),
			},
			{
				tabId: "about",
				text: this.props.translate("frontend_aboutLinkText"),
			},
		];

		this.styled = {
			footerHr: styled({
				marginTop: "3em",
			})(layoutBase.hr),

			main: styled({
				paddingTop: "8em",
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

	static defaultProps = {
		osType: null,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		activeTabId: PropTypes.string.isRequired,
		className: PropTypes.string.isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
		osType: PropTypes.string,
		systemType: PropTypes.string.isRequired,
		translate: PropTypes.func.isRequired,
		versionNumber: PropTypes.string.isRequired,
	};

	componentDidMount() {
		// NOTE: execute outside the synchronous rendering.
		setTimeout(() => this.scrollToTop(), 100);
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

	handleOpenShortKeysConfigurationClick() {
		this.props.actions.sharedNavigation.openShortKeysConfiguration();
	}

	handleLinkClick(url) {
		this.props.actions.sharedNavigation.openUrlInNewTab(url);
	}

	handleOptionsPageClick(event) {
		event.preventDefault();
		event.stopPropagation();

		this.props.actions.sharedNavigation.openOptionsPage();

		return false;
	}

	render() {
		const {
			activeTabId,
			isPremiumEdition,
			versionNumber,
			systemType,
			osType,
			className,
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

				<this.styled.main
					onClick={this.handleClick}
				>
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
						<Features
							isPremiumEdition={isPremiumEdition}
							systemType={systemType}
						/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="support"
						onLinkClick={this.handleLinkClick}
					>
						<Support
							osType={osType}
							systemType={systemType}
						/>
					</TabContents>

					<TabContents
						activeTabId={activeTabId}
						id="about"
						onLinkClick={this.handleLinkClick}
					>
						<About/>
					</TabContents>
				</this.styled.main>

				<this.styled.footerHr/>

				<Footer
					optionsPageClick={this.handleOptionsPageClick}
					versionNumber={versionNumber}
				/>
			</div>
		);
	}
}
