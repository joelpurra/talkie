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

import TalkiePremiumEdition from "./editions/talkie-premium-edition.jsx";

export default class Editions extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleIsPremiumEditionChange = this.handleIsPremiumEditionChange.bind(this);
	}

	static defaultProps = {
		isPremiumEdition: false,
	};

	static propTypes = {
		actions: PropTypes.object.isRequired,
		isPremiumEdition: PropTypes.bool.isRequired,
	}

	handleIsPremiumEditionChange(isPremiumEdition) {
		this.props.actions.sharedMetadata.storeIsPremiumEdition(isPremiumEdition);
	}

	render() {
		const {
			isPremiumEdition,
		} = this.props;
		return (
			<section>
				<TalkiePremiumEdition
					isPremiumEdition={isPremiumEdition}
					disabled={false}
					onChange={this.handleIsPremiumEditionChange}
				/>
			</section>
		);
	}
}
