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

import translateAttribute from "../../../../shared/hocs/translate.jsx";
import ScaleRange from "../../range/scale-range.jsx";
import RangeWithHeading from "./range-with-heading.jsx";

export default
@translateAttribute
class Pitch extends React.PureComponent {
	constructor(props) {
		super(props);

		this.transformValueBeforeChange = this.transformValueBeforeChange.bind(this);
		this.getHeading = this.getHeading.bind(this);
	}

	static defaultProps = {
		voiceName: null,
	};

	static propTypes = {
		defaultValue: PropTypes.number.isRequired,
		// eslint-disable-next-line react/boolean-prop-naming
		disabled: PropTypes.bool.isRequired,
		initialValue: PropTypes.number.isRequired,
		listName: PropTypes.string.isRequired,
		max: PropTypes.number.isRequired,
		min: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
		step: PropTypes.number.isRequired,
		translate: PropTypes.func.isRequired,
		voiceName: PropTypes.string,
	}

	transformValueBeforeChange(value) {
		return value;
	}

	getHeading(voiceName, translate) {
		let heading = null;

		if (typeof voiceName === "string" && voiceName.length > 0) {
			heading = translate("frontend_voicesPitchHeading", voiceName);
		} else {
			heading = translate("frontend_voicesPitchEmptyHeading");
		}

		return heading;
	}

	render() {
		return (
			<RangeWithHeading
				{...this.props}
				ScaleRangeElementClass={ScaleRange}
				getHeading={this.getHeading}
				transformValueBeforeChange={this.transformValueBeforeChange}
			/>
		);
	}
}
