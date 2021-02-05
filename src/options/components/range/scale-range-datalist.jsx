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

import ScaleRangeDatalistOption from "./scale-range-datalist-option.jsx";

export default class ScaleRangeDatalist extends React.PureComponent {
	static defaultProps = {
		steps: [],
		disabled: true,
	};

	static propTypes = {
		listName: PropTypes.string.isRequired,
		steps: PropTypes.arrayOf(PropTypes.number).isRequired,
		disabled: PropTypes.bool.isRequired,
	};

	render() {
		const {
			steps,
			disabled,
			listName,
		} = this.props;

		const listOptions = steps.map((step) => (
			<ScaleRangeDatalistOption
				key={step.toString()}
				value={step}
				disabled={disabled || null}
			/>
		),
		);

		return (
			<datalist
				id={listName}
				disabled={disabled || null}
			>
				{listOptions}
			</datalist>
		);
	}
}
