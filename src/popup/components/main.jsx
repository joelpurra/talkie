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

import styled from "../../shared/hocs/styled.jsx";
import * as layoutBase from "../../shared/styled/layout/layout-base.jsx";
import {
	handleBubbledLinkClick,
} from "../../shared/utils/ui";
import Footer from "./sections/footer.jsx";
import Header from "./sections/header.jsx";
import Menu from "./sections/menu.jsx";
import Status from "./sections/status.jsx";

const styles = {
	maxWidth: "300px",
	minWidth: "300px",
};

export default
@styled(styles)
class Main extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);
		this.handleLinkClick = this.handleLinkClick.bind(this);
		this.handleCheckLinkClick = this.handleCheckLinkClick.bind(this);
		this.handleOptionsPageClick = this.handleOptionsPageClick.bind(this);
	}

	static defaultProps = {
		className: "",
	}

	static propTypes = {
		actions: PropTypes.object.isRequired,
		className: PropTypes.string,
		isPremiumEdition: PropTypes.bool.isRequired,
		versionNumber: PropTypes.string.isRequired,
	};

	handlePlayPauseClick() {
		this.props.actions.sharedSpeaking.iconClick();
	}

	handleLinkClick(url) {
		this.props.actions.sharedNavigation.openUrlInNewTab(url);
	}

	handleCheckLinkClick(event) {
		// TODO: use an api call which has handleBubbledLinkClick?
		return handleBubbledLinkClick(this.handleLinkClick, event);
	}

	handleOptionsPageClick(event) {
		event.preventDefault();
		event.stopPropagation();

		this.props.actions.sharedNavigation.openOptionsPage();

		return false;
	}

	render() {
		const {
			isPremiumEdition,
			versionNumber,
			className,
		} = this.props;

		return (
			<div
				className={className}
				onClick={this.handleCheckLinkClick}
			>
				<Header
					isPremiumEdition={isPremiumEdition}
					playPauseClick={this.handlePlayPauseClick}
				/>

				<Status
					playPauseClick={this.handlePlayPauseClick}
				/>

				<layoutBase.hr/>

				<Menu/>

				<layoutBase.hr/>

				<Footer
					optionsPageClick={this.handleOptionsPageClick}
					versionNumber={versionNumber}
				/>
			</div>
		);
	}
}
