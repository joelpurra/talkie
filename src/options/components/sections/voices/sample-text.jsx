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

import translate from "../../../../shared/hocs/translate.jsx";
import * as formBase from "../../../../shared/styled/form/form-base.jsx";
import * as tableBase from "../../../../shared/styled/table/table-base.jsx";

export default
@translate
class SampleText extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

    static defaultProps = {
    	value: null,
    	disabled: true,
    };

    static propTypes = {
    	onChange: PropTypes.func.isRequired,
    	value: PropTypes.string,
    	disabled: PropTypes.bool.isRequired,
    	translate: PropTypes.func.isRequired,
    };

    handleChange(e) {
    	const value = e.target.value;

    	this.props.onChange(value);
    }

    render() {
    	return (
    		<tableBase.tbody>
    			<tableBase.tr>
    				<tableBase.th scope="col">
    					{this.props.translate("frontend_voicesSampleTextHeading")}
 </tableBase.th>
 </tableBase.tr>
    			<tableBase.tr>
    				<tableBase.td>
    					<formBase.textarea
    						id="voices-sample-text"
    						rows="2"
    						value={this.props.value}
    						onChange={this.handleChange}
    						disabled={this.props.disabled || null}
    					 />
 </tableBase.td>
 </tableBase.tr>
 </tableBase.tbody>
    	);
    }
}
