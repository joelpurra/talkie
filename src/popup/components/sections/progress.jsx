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

import styled from "../../../shared/hocs/styled.jsx";

export default class Status extends React.PureComponent {
	constructor(props) {
		super(props);

		this.styled = {
			progress: styled({
				height: "0.5em",
				marginBottom: "0.5em",
				marginTop: "0.5em",
				width: "100%",
			})("progress"),
		};
	}

	static propTypes = {
		current: PropTypes.number.isRequired,
		max: PropTypes.number.isRequired,
		min: PropTypes.number.isRequired,
	}

	render() {
		const {
			min,
			current,
			max,
		} = this.props;

		return (
			<this.styled.progress
				max={max}
				min={min}
				value={current}
			/>
		);
	}
}
