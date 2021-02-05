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

import {
	handleBubbledLinkClick,
} from "../../utils/ui";

export default class TabContents extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		// TODO: use an api call which has handleBubbledLinkClick?
		return handleBubbledLinkClick(this.props.onLinkClick, event);
	}

	static propTypes = {
		activeTabId: PropTypes.string.isRequired,
		children: PropTypes.node.isRequired,
		id: PropTypes.string.isRequired,
		onLinkClick: PropTypes.func.isRequired,
	}

	render() {
		if (this.props.id !== this.props.activeTabId) {
			return null;
		}

		return (
			<div
				id={this.props.id}
				onClick={this.handleClick}
			>
				{this.props.children}
			</div>
		);
	}
}
